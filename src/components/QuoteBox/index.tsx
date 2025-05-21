import React from "react";
import { UserContext, useUserContext } from "../../UserContext";
import { useContext, useState, useEffect } from "react";
import {
  doc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

interface QuoteBoxProps {
  id: string;
  quote: string;
  author: string;
  onNewQuoteClick: () => void;
}

interface QuoteDocument {
  id: string;
  likedBy?: string[];
  dislikedBy?: string[];
  category?: string;
}

export function QuoteBox({
  id,
  quote,
  author,
  onNewQuoteClick,
}: QuoteBoxProps): React.ReactElement {
  const { user, likedQuotes, dislikedQuotes } = useUserContext();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);
  const [totalLikeCount, setTotalLikeCount] = useState<number>(0);
  const [totalDislikeCount, setTotalDislikeCount] = useState<number>(0);

  const collectionReference = collection(db, "quotes");

  useEffect(() => {
    console.log("Current User in QuoteBox:", user);
    if (user && user.id) {
      setErrorMessage("");
    }

    async function fetchQuoteData(): Promise<void> {
      const dbQuery = query(collectionReference, where("id", "==", id));
      const querySnapshots = await getDocs(dbQuery);
      if (!querySnapshots.empty) {
        const docSnapshot = querySnapshots.docs[0];
        const currentQuoteDocument = docSnapshot.data() as QuoteDocument;

        setLikeCount(currentQuoteDocument.likedBy?.length ?? 0);
        setDislikeCount(currentQuoteDocument.dislikedBy?.length ?? 0);
        setTotalLikeCount(currentQuoteDocument.likedBy?.length ?? 0);
        setTotalDislikeCount(currentQuoteDocument.dislikedBy?.length ?? 0);
      }
    }

    fetchQuoteData();
  }, [id, user]);

  async function handleVote(actionType: "like" | "dislike"): Promise<void> {
    if (!user || !user.id) {
      const message = "User is not logged in!";
      setErrorMessage(message);
      console.error(message);
      return;
    }

    const field = actionType === "like" ? "likedBy" : "dislikedBy";
    const stateSetter = actionType === "like" ? setLikeCount : setDislikeCount;

    try {
      const dbQuery = query(collectionReference, where("id", "==", id));
      const querySnapshots = await getDocs(dbQuery);
      if (querySnapshots.empty) throw new Error("Quote document not found");

      const docSnapshot = querySnapshots.docs[0];
      const currentQuoteDocument = docSnapshot.data() as QuoteDocument;
      const userHasVoted = currentQuoteDocument[field]?.includes(user.id);
      if (userHasVoted) return;

      const quoteDocRef = doc(db, "quotes", docSnapshot.id);
      const updatedVotes = new Set(currentQuoteDocument[field] || []);
      updatedVotes.add(user.id);

      await updateDoc(quoteDocRef, { [field]: Array.from(updatedVotes) });

      stateSetter(updatedVotes.size);

      if (actionType === "like") {
        await setDoc(doc(db, "likedQuotes", `${user.id}_${id}`), {
          userId: user.id,
          quoteId: id,
          text: quote,
          author,
          category: currentQuoteDocument.category || "general",
          createdAt: new Date(),
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Error: ${error.message}`);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    }
  }

  const isLiked = likedQuotes?.includes(id);
  const isDisliked = dislikedQuotes?.includes(id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <div className="space-y-4">
        <p className="text-xl text-gray-800 italic">"{quote}"</p>
        <p className="text-gray-600">- {author}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">👍 {totalLikeCount}</span>
            <span className="text-sm text-gray-500">
              👎 {totalDislikeCount}
            </span>
          </div>
          {user && user.id && (
            <div className="flex space-x-2">
              <button
                disabled={isLiked}
                onClick={() => handleVote("like")}
                className={`px-4 py-2 rounded-lg transition duration-300 ${
                  isLiked
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                👍 {likeCount}
              </button>
              <button
                disabled={isDisliked}
                onClick={() => handleVote("dislike")}
                className={`px-4 py-2 rounded-lg transition duration-300 ${
                  isDisliked
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                👎 {dislikeCount}
              </button>
            </div>
          )}
          <button
            onClick={onNewQuoteClick}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition duration-300"
          >
            New Quote
          </button>
        </div>
      </div>
    </div>
  );
}
