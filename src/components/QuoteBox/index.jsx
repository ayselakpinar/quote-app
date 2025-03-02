import {
    UserContext,
    UserDispatchContext,
    UserActionTypes,
  } from "../../UserContext";
  import { useContext, useState, useEffect } from "react";
  import { doc, setDoc, query, collection, where, getDocs } from "firebase/firestore";
  import { db } from "../../firebase/config";
  
  export function QuoteBox({ id, quote, author, onNewQuoteClick }) {
    const { user } = useContext(UserContext);
    const dispatch = useContext(UserDispatchContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);
  
    const collectionReference = collection(db, "quotes");
  
    useEffect(() => {
      console.log("Current User in QuoteBox:", user);
      if (user && user.id) {
        setErrorMessage("");
      }
  
      async function fetchQuoteData() {
        const dbQuery = query(collectionReference, where("id", "==", id));
        const querySnapshots = await getDocs(dbQuery);
        if (!querySnapshots.empty) {
          const docSnapshot = querySnapshots.docs[0];
          const currentQuoteDocument = docSnapshot.data();
  
          setLikeCount(currentQuoteDocument.likedBy ? currentQuoteDocument.likedBy.length : 0);
          setDislikeCount(currentQuoteDocument.dislikedBy ? currentQuoteDocument.dislikedBy.length : 0);
        }
      }
  
      fetchQuoteData();
    }, [id, user]);
  
    async function handleVote(actionType) {
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
        const currentQuoteDocument = docSnapshot.data();
        const userHasVoted = currentQuoteDocument[field]?.includes(user.id);
  
        if (userHasVoted) {
          const message = `You already ${actionType}d this quote!`;
          setErrorMessage(message);
          console.log(message);
          return;
        }
  
        dispatch({
          type: actionType === "like" ? UserActionTypes.UpdateLikedQuotes : UserActionTypes.UpdateDislikedQuotes,
          payload: { id }
        });
  
        const quoteDocRef = doc(db, "quotes", docSnapshot.id);
        const updatedVotes = new Set(
          Array.isArray(currentQuoteDocument[field]) ? currentQuoteDocument[field] : []
        );
        updatedVotes.add(user.id);
  
        const updatedData = { ...currentQuoteDocument, [field]: Array.from(updatedVotes) };
  
        Object.keys(updatedData).forEach(
          key => updatedData[key] === undefined && delete updatedData[key]
        );
  
        await setDoc(quoteDocRef, updatedData);
        stateSetter(updatedVotes.size);
      } catch (error) {
        const message = `Error updating ${actionType}: ${error.message}`;
        setErrorMessage(message);
        console.error(message);
      }
    }
  
    const isLiked = user?.likedQuotes?.includes(id);
    const isDisliked = user?.dislikedQuotes?.includes(id);
  
    return (
      <>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <div>
          <p>{quote}</p>
          <span>{author}</span>
          {user && user.id && (
            <div>
              <button
                disabled={isLiked}
                onClick={() => handleVote("like")}
              >
                👍 {likeCount}
              </button>
              <button
                disabled={isDisliked}
                onClick={() => handleVote("dislike")}
              >
                👎 {dislikeCount}
              </button>
            </div>
          )}
        </div>
        {user && user.id && <button onClick={onNewQuoteClick}>New Quote</button>}
      </>
    );
  }