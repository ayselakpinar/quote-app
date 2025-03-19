import { db } from "../../firebase/config.js"; 
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

export default function QuoteForm() {
  const [quote, setQuote] = useState("");
  const [category, setCategory] = useState("inspirational");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quote.trim()) {
      setMessage("Quote cannot be empty!");
      return;
    }

    try {
      await addDoc(collection(db, "quotes"), {
        text: quote,
        category: category,
        createdAt: new Date(),
      });

      setMessage("Quote added successfully!");
      setQuote(""); 
      setCategory("inspirational");
    } catch (error) {
      console.error("Error adding quote: ", error);
      setMessage("Error saving quote!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        placeholder="Enter your quote"
        style={{ fontSize: "18px", padding: "10px", width: "100%" }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ fontSize: "18px", padding: "10px", width: "100%", marginTop: "10px" }}
      >
        <option value="inspirational">Inspirational</option>
        <option value="funny">Funny</option>
        <option value="life">Life</option>
        <option value="love">Love</option>
        <option value="wisdom">Wisdom</option>
      </select>

      <button type="submit" style={{ fontSize: "18px", padding: "10px", marginTop: "10px" }}>
        Save Quote
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}

