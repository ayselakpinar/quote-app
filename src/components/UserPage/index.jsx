import { UserContext } from "../../UserContext";
import { useContext } from "react";
import { quotes } from "../../quotes";

export const UserPage = () => {
  const user = useContext(UserContext);
  const likedQuoteIds = user.likedQuotes; // array of quote ids

  const likedQuotes = quotes.filter((quote) => likedQuoteIds.includes(quote.id));

  return (
    <section>
      <h1>User Page</h1>
      <p>Here you can see all the quotes you liked:</p>
      <ul>
        {
          likedQuotes.map((quote) => (
            <li key={quote.id}>
              <p>{quote.quote}</p>
              <span>{quote.author}</span>
              <hr />
            </li>
          ))
        }
      </ul>
    </section>
  )
};