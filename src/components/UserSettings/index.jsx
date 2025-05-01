import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { UserContext } from '../../UserContext';
import './styles.css';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'wisdom', label: 'Wisdom' },
  { value: 'love', label: 'Love' },
  { value: 'life', label: 'Life' },
  { value: 'success', label: 'Success' },
  { value: 'happiness', label: 'Happiness' }
];

export function UserSettings() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    async function fetchUserSettings() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setValue('username', data.name || '');
          setValue('email', data.email || '');
          setValue('favoriteCategories', data.favoriteCategories || []);
        } else {
          const defaultData = {
            name: user.name || '',
            email: user.email || '',
            favoriteCategories: []
          };
          await setDoc(userDocRef, defaultData);
          setValue('username', defaultData.name);
          setValue('email', defaultData.email);
          setValue('favoriteCategories', defaultData.favoriteCategories);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserSettings();
  }, [user, setValue]);

  const onSubmit = async (data) => {
    if (!user?.id) {
      setSaveStatus('error');
      return;
    }

    try {
      setSaveStatus('saving');
      const userDocRef = doc(db, 'users', user.id);

      const userData = {
        name: data.username,
        email: data.email,
        favoriteCategories: Array.isArray(data.favoriteCategories) ? data.favoriteCategories : [],
        updatedAt: new Date()
      };

      await setDoc(userDocRef, userData);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
    }
  };

  if (loading) {
    return <div className="settings-container">Loading...</div>;
  }

  if (!user?.id) {
    return <div className="settings-container">Please login to view settings</div>;
  }

  return (
    <div className="settings-container">
      <h2>User Settings</h2>
      <form className="settings-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 2,
                message: 'Username must be at least 2 characters'
              }
            })}
          />
          {errors.username && (
            <div className="error-message">{errors.username.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <div className="error-message">{errors.email.message}</div>
          )}
        </div>

        <div className="form-group">
          <label>Favorite Categories</label>
          <div className="categories-grid">
            {CATEGORIES.map(category => (
              <label key={category.value} className="category-checkbox">
                <input
                  type="checkbox"
                  value={category.value}
                  {...register('favoriteCategories')}
                />
                {category.label}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="save-button">
          {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
        </button>

        {saveStatus === 'saved' && (
          <div className="success-message">Settings saved successfully!</div>
        )}
        {saveStatus === 'error' && (
          <div className="error-message">Error saving settings. Please try again.</div>
        )}
      </form>
    </div>
  );
} 