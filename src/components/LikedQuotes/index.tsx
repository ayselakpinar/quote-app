import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useUserContext } from "../../UserContext";
import { Loading } from "../Shared/Loading";
import { CenteredContainer } from "../Shared/CenteredContainer";
import { PageTitle } from "../Shared/PageTitle";

interface LikedQuote {
  id: string;
  text: string;
  author: string;
  category?: string;
  userId: string;
  quoteId: string;
  createdAt: Date;
}

export function LikedQuotes(): React.ReactElement {
  const [likedQuotes, setLikedQuotes] = useState<LikedQuote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUserContext();

  useEffect(() => {
    async function fetchLikedQuotes(): Promise<void> {
      if (!user || !user.id) return;

      try {
        const q = query(
          collection(db, "likedQuotes"),
          where("userId", "==", user.id)
        );

        const querySnapshot = await getDocs(q);
        const quotes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LikedQuote[];

        setLikedQuotes(quotes);
      } catch (error) {
        console.error("Error fetching liked quotes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLikedQuotes();
  }, [user]);

  if (loading) {
    return <Loading className="text-2xl text-primary-dark" />;
  }

  if (likedQuotes.length === 0) {
    return (
      <CenteredContainer>
        <div className="text-2xl text-primary-dark">No liked quotes yet.</div>
      </CenteredContainer>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <PageTitle className="text-3xl font-bold text-primary-dark mb-8">
          Your Liked Quotes
        </PageTitle>
        <div className="grid gap-6">
          {likedQuotes.map((quote) => (
            <div key={quote.id} className="bg-white rounded-lg shadow-md p-6">
              <p className="text-lg text-gray-800 mb-4">{quote.text}</p>
              <div className="flex justify-between items-center">
                <span className="text-primary-dark font-medium">
                  {quote.author}
                </span>
                {quote.category && (
                  <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">
                    {quote.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
