import React, { createContext, useReducer, useContext } from 'react';

// İlk durum
const initialState = {
  user: null,
  likedQuotes: [],
  dislikedQuotes: [],
};

// Action types
export const UserActionTypes = {
  SetUser: 'SET_USER',
  UpdateLikedQuotes: 'UPDATE_LIKED_QUOTES',
  UpdateDislikedQuotes: 'UPDATE_DISLIKED_QUOTES',
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case UserActionTypes.SetUser:
      return { ...state, user: action.payload };
    case UserActionTypes.UpdateLikedQuotes:
      return { ...state, likedQuotes: [...state.likedQuotes, action.payload.id] };
    case UserActionTypes.UpdateDislikedQuotes:
      return { ...state, dislikedQuotes: [...state.dislikedQuotes, action.payload.id] };
    default:
      return state;
  }
};

// Context'ler
export const UserContext = createContext();
export const UserDispatchContext = createContext();

// Provider
export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

// Kullanıcı context'ini almak için custom hook
export const useUserContext = () => {
  return useContext(UserContext);
};

export const useUserDispatchContext = () => {
  return useContext(UserDispatchContext);
};


