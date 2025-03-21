import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../UserContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Title } from "../Title";
import { QuoteBox } from "../QuoteBox";

export const UserPage = () => {
  const { user } = useContext(UserContext);
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedQuotes = async () => {
      if (!user || !user.id) return;

      try {
        setLoading(true);
        const likedQuotesRef = collection(db, "likedQuotes");
        const q = query(likedQuotesRef, where("userId", "==", user.id));
        const querySnapshot = await getDocs(q);
        
        const quotes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setLikedQuotes(quotes);
      } catch (err) {
        console.error("Error fetching liked quotes:", err);
        setError("Error loading liked quotes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedQuotes();
  }, [user]);

  if (!user) {
    return <div>Please log in to continue.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Title>Your Liked Quotes</Title>
      {likedQuotes.length === 0 ? (
        <p>You haven't liked any quotes yet.</p>
      ) : (
        <div>
          {likedQuotes.map((quote) => (
            <QuoteBox
              key={quote.id}
              id={quote.quoteId}
              quote={quote.text}
              author={quote.author}
            />
          ))}
        </div>
      )}
    </div>
  );
};