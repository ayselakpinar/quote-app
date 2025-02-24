import { db } from "./firebase/config";
import { quotes } from "./quotes";
import { addDoc, collection } from "firebase/firestore";

export const uploadQuotesScript = () => {
  const quotesCollectionRef = collection(db, "quotes");

  let counter = 0;
  quotes.forEach(async (quote) => {
    try {
      await addDoc(quotesCollectionRef, { ...quote, likedBy: [], dislikedBy: []});
      counter++;
    } catch (error) {
      console.error("Error adding quote:", error);
    } finally {
      if (counter === quotes.length) {
        console.log("All quotes added successfully");
      }
    }
  });
};