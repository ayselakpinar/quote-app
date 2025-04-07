import { QuoteBox } from "../QuoteBox";
import { Title } from "../Title";
import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from '../../firebase/config';

export const Home = () => {
  const [quotes, setQuotes] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const getRandomQuoteIndex = () => Math.floor(Math.random() * quotes.length);

  const quotesCollectionRef = collection(db, 'quotes');

  useEffect(() => {
    const getQuotes = async () => {
      try {
        const data = await getDocs(quotesCollectionRef);
        const quotes = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(quotes);
        setQuotes(quotes);
      } catch (error) {
        console.error("Error getting quotes:", error);
      }
    };
    getQuotes();
  }, []);

  function handleNewQuoteClick() {
    setQuoteIndex(getRandomQuoteIndex());
  }

  if (quotes.length === 0) return <p className="text-center text-xl text-gray-600 mt-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Title>Random Quotes</Title>
        <QuoteBox
          id={quotes[quoteIndex].id}
          quote={quotes[quoteIndex].quote}
          author={quotes[quoteIndex].author}
          onNewQuoteClick={handleNewQuoteClick}
        />
      </div>
    </div>
  );
};