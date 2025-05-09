import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { UserContext } from "../../UserContext";
import { Label } from "../Shared/Label";
import { Input } from "../Shared/Input";

const QuoteForm = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      quote: "",
      author: "",
      category: "general",
    },
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
        dislikedBy: [],
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
    return (
      <div className="text-center text-red-500 p-4">
        Please log in to add new quotes.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="quote">Quote Text</Label>
        <textarea
          id="quote"
          rows="4"
          {...register("quote", {
            required: "Quote text is required",
            minLength: {
              value: 3,
              message: "Quote must be at least 3 characters long",
            },
            maxLength: {
              value: 500,
              message: "Quote cannot exceed 500 characters",
            },
          })}
          placeholder="Enter your quote"
          className="w-full px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:border-primary"
        />
        {errors.quote && (
          <span className="mt-1 text-red-500 text-sm">
            {errors.quote.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          type="text"
          {...register("author", {
            required: "Author name is required",
            minLength: {
              value: 2,
              message: "Author name must be at least 2 characters long",
            },
          })}
          placeholder="Enter author name"
        />
        {errors.author && (
          <span className="mt-1 text-red-500 text-sm">
            {errors.author.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          {...register("category")}
          className="w-full px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="general">General</option>
          <option value="motivation">Motivation</option>
          <option value="wisdom">Wisdom</option>
          <option value="success">Success</option>
          <option value="life">Life</option>
        </select>
      </div>

      {error && <div className="text-red-500 text-center p-2">{error}</div>}

      <button
        type="submit"
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding Quote..." : "Add Quote"}
      </button>
    </form>
  );
};

export default QuoteForm;
