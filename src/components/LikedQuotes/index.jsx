import React, { useState, useEffect, useContext } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { UserContext } from '../../UserContext';
import '../LikedQuotes/styles.css';

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
        const quotes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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
    return (
      <div className="liked-quotes-container">
        <div className="loading-message">Loading...</div>
      </div>
    );
  }

  if (likedQuotes.length === 0) {
    return (
      <div className="liked-quotes-container">
        <div className="no-quotes-message">No liked quotes yet.</div>
      </div>
    );
  }

  return (
    <div className="liked-quotes-container">
      <div className="liked-quotes-list">
        {likedQuotes.map((quote) => (
          <div key={quote.id} className="liked-quote-item">
            <div className="liked-quote-text">{quote.text}</div>
            <div className="liked-quote-author">{quote.author}</div>
            {quote.category && (
              <div className="liked-quote-category">{quote.category}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
