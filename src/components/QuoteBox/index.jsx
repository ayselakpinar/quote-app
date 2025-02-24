import {
    UserContext,
    UserDispatchContext,
    UserActionTypes,
  } from "../../UserContext";
  import { useContext } from "react";
  import { doc, setDoc, query, collection, where, getDocs } from "firebase/firestore";
  import { db } from "../../firebase/config";
  
  export function QuoteBox({ id, quote, author, onNewQuoteClick }) {
    const user = useContext(UserContext);
    const dispatch = useContext(UserDispatchContext);
  
    const collectionReference = collection(db, "quotes");
    async function handleLike() {
      dispatch({ type: UserActionTypes.UpdateLikedQuotes, payload: { id } });
      try {
        const dbQuery = query(
          collectionReference,
          where("id", "==", id)
        );
  
        const querySnapshots = await getDocs(dbQuery);
        if (querySnapshots.empty)  throw Error("Quote document is not found");
  
        const currentQuoteDocument = querySnapshots.docs.map(doc => doc.data())[0];
  
        const quoteDocRef = doc(db, "quotes", currentQuoteDocument.id);
        await setDoc(quoteDocRef, { ...currentQuoteDocument, likedBy: [...currentQuoteDocument.likedBy, user.id] });
      } catch (error) {
        console.error("Error getting quotes:", error);
      }
    }
  
  
    function handleDislike() {
      dispatch({ type: UserActionTypes.UpdateDislikedQuotes, payload: { id } });
      // TODO: update the quote document in the database to reflect like count
    }
  
    // TODO: only show the like and dislike buttons if the user is logged in
    // TODO: On the quote in the Database, keep track of the total like count.

    return (
      <>
        <div>
          <p>{quote}</p>
          <span>{author}</span>
          <div>
            <button disabled={user && user.likedQuotes && user.likedQuotes.includes(id)} onClick={handleLike}>
            👍{user && user.likedQuotes && user.likedQuotes.includes(id) ? 1 : 0}
            </button>
            <button
              disabled={user && user.dislikedQuotes && user.dislikedQuotes.includes(id)}
              onClick={handleDislike}
            >
              👎 {user && user.dislikedQuotes && user.dislikedQuotes.includes(id) ? 1 : 0}
            </button>
          </div>
        </div>
        <button onClick={onNewQuoteClick}>New Quote</button>
      </>
    );
  }