import { db } from "./firebase/config.js";
import { quotes } from "./quotes.js";
import { addDoc, collection } from "firebase/firestore";

console.log("⚡ Script başlatıldı...");

export const uploadQuotesScript = () => {
  const quotesCollectionRef = collection(db, "quotes");

  let counter = 0;
  quotes.forEach(async (quote) => {
    try {
      await addDoc(quotesCollectionRef, { ...quote, likedBy: [], dislikedBy: []});
      counter++;
      console.log(`Added quote #${counter}: ${quote.quote}`); // Eklenen alıntıyı konsola yazdır
    } catch (error) {
      console.error("Error adding quote:", error);
    } finally {
      if (counter === quotes.length) {
        console.log("All quotes added successfully");
      }
    }
  });
};
