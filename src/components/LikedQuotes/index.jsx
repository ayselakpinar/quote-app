import React, { useState, useEffect, useContext } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { UserContext } from "../../UserContext";
import { Loading } from "../Shared/Loading";
import { CenteredContainer } from "../Shared/CenteredContainer";
import { PageTitle } from "../Shared/PageTitle";

export function LikedQuotes() {
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function fetchLikedQuotes() {
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
        }));

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
