import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { UserContext } from '../../UserContext';

export function QuoteForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      quote: '',
      author: '',
      category: 'general'
    }
  });
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const onSubmit = async (data) => {
    if (!user || !user.id) {
      navigate('/login');
      return;
    }

    try {
      await addDoc(collection(db, 'quotes'), {
        text: data.quote.trim(),
        author: data.author.trim(),
        category: data.category,
        createdAt: new Date(),
        createdBy: user.id,
        likedBy: [],
        dislikedBy: []
      });

      reset();
      navigate('/');
    } catch (error) {
      console.error('Error adding quote:', error);
    }
  };

  if (!user || !user.id) {
    return (
      <div className="quote-form">
        <div className="error-message">Please login to add quotes</div>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter your quote"
          {...register('quote', {
            required: 'Quote is required',
            minLength: {
              value: 3,
              message: 'Quote must be at least 3 characters'
            },
            maxLength: {
              value: 500,
              message: 'Quote must be less than 500 characters'
            }
          })}
        />
        {errors.quote && (
          <div className="error-message">{errors.quote.message}</div>
        )}
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Author name"
          {...register('author', {
            required: 'Author name is required',
            minLength: {
              value: 2,
              message: 'Author name must be at least 2 characters'
            },
            maxLength: {
              value: 100,
              message: 'Author name must be less than 100 characters'
            }
          })}
        />
        {errors.author && (
          <div className="error-message">{errors.author.message}</div>
        )}
      </div>

      <div className="form-group">
        <select {...register('category')}>
          <option value="general">General</option>
          <option value="motivation">Motivation</option>
          <option value="wisdom">Wisdom</option>
          <option value="love">Love</option>
          <option value="life">Life</option>
          <option value="success">Success</option>
          <option value="happiness">Happiness</option>
        </select>
      </div>

      <button type="submit" className="submit-button">
        Add Quote
      </button>
    </form>
  );
} 