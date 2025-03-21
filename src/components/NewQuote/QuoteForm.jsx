import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { UserContext } from "../../UserContext";

const QuoteForm = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      quote: "",
      author: "",
      category: "general"
    }
  });

  const onSubmit = async (data) => {
    if (!user || !user.id) {
      setError("You must be logged in to add a quote");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const quoteData = {
        text: data.quote.trim(),
        author: data.author.trim(),
        category: data.category,
        createdAt: new Date(),
        createdBy: user.id,
        likedBy: [],
        dislikedBy: []
      };

      await addDoc(collection(db, "quotes"), quoteData);
      reset();
      navigate("/");
    } catch (err) {
      console.error("Error adding quote:", err);
      setError("Failed to add quote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div className="message">Please log in to add new quotes.</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="quote-form">
      <div className="form-group">
        <textarea
          {...register("quote", {
            required: "Quote text is required",
            minLength: {
              value: 3,
              message: "Quote must be at least 3 characters long"
            },
            maxLength: {
              value: 500,
              message: "Quote cannot exceed 500 characters"
            }
          })}
          placeholder="Enter your quote"
        />
        {errors.quote && <span className="error">{errors.quote.message}</span>}
      </div>

      <div className="form-group">
        <input
          type="text"
          {...register("author", {
            required: "Author name is required",
            minLength: {
              value: 2,
              message: "Author name must be at least 2 characters long"
            }
          })}
          placeholder="Enter author name"
        />
        {errors.author && <span className="error">{errors.author.message}</span>}
      </div>

      <div className="form-group">
        <select {...register("category")}>
          <option value="general">General</option>
          <option value="motivation">Motivation</option>
          <option value="wisdom">Wisdom</option>
          <option value="success">Success</option>
          <option value="life">Life</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <button 
        type="submit" 
        className="submit-button" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding Quote..." : "Add Quote"}
      </button>
    </form>
  );
};

export default QuoteForm;

