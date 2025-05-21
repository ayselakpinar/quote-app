import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useUserContext } from "../../UserContext";
import { Label } from "../Shared/Label";
import { Input } from "../Shared/Input";

interface QuoteFormData {
  quote: string;
  author: string;
  category: string;
}

interface QuoteData {
  text: string;
  author: string;
  category: string;
  createdAt: Date;
  createdBy: string;
  likedBy: string[];
  dislikedBy: string[];
}

export const QuoteForm: React.FC = (): React.ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuoteFormData>({
    defaultValues: {
      quote: "",
      author: "",
      category: "general",
    },
  });
  const navigate = useNavigate();
  const { user } = useUserContext();

  const onSubmit = async (data: QuoteFormData): Promise<void> => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    try {
      const quoteData: QuoteData = {
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
    } catch (error) {
      console.error("Error adding quote:", error);
    }
  };

  if (!user || !user.id) {
    return (
      <div className="text-center text-red-500 p-4">
        <div className="text-lg">Please login to add quotes</div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="quote">Quote</Label>
        <Input
          id="quote"
          type="text"
          placeholder="Enter your quote"
          {...register("quote", {
            required: "Quote is required",
            minLength: {
              value: 3,
              message: "Quote must be at least 3 characters",
            },
            maxLength: {
              value: 500,
              message: "Quote must be less than 500 characters",
            },
          })}
        />
        {errors.quote && (
          <div className="mt-1 text-red-500 text-sm">
            {errors.quote.message}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          type="text"
          placeholder="Author name"
          {...register("author", {
            required: "Author name is required",
            minLength: {
              value: 2,
              message: "Author name must be at least 2 characters",
            },
            maxLength: {
              value: 100,
              message: "Author name must be less than 100 characters",
            },
          })}
        />
        {errors.author && (
          <div className="mt-1 text-red-500 text-sm">
            {errors.author.message}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="w-full px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:border-primary"
          {...register("category")}
        >
          <option value="general">General</option>
          <option value="motivation">Motivation</option>
          <option value="wisdom">Wisdom</option>
          <option value="love">Love</option>
          <option value="life">Life</option>
          <option value="success">Success</option>
          <option value="happiness">Happiness</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition duration-300"
      >
        Add Quote
      </button>
    </form>
  );
};
