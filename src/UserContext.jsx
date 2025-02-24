// UserContext.jsx

import { createContext, useReducer } from "react";

// Kullanıcı verilerini saklayacağımız context
export const UserContext = createContext();
export const UserDispatchContext = createContext();

// Action type'ları
export const UserActionTypes = {
  SetUser: "SET_USER",
  UpdateLikedQuotes: "UPDATE_LIKED_QUOTES",
  UpdateDislikedQuotes: "UPDATE_DISLIKED_QUOTES",
};

// Kullanıcı state'ini yöneten reducer
function userReducer(state, action) {
  switch (action.type) {
    case UserActionTypes.SetUser:
      return { 
        ...action.payload, 
        likedQuotes: state.likedQuotes || [], 
        dislikedQuotes: state.dislikedQuotes || [] 
      };
    case UserActionTypes.UpdateLikedQuotes:
      if (state.dislikedQuotes.includes(action.payload.id)) {
        const updatedDislikedQuotes = state.dislikedQuotes.filter(
          (dislikedQuoteId) => dislikedQuoteId !== action.payload.id
        );
        return {
          ...state,
          likedQuotes: [...state.likedQuotes, action.payload.id],
          dislikedQuotes: updatedDislikedQuotes,
        };
      }
      return {
        ...state,
        likedQuotes: [...state.likedQuotes, action.payload.id],
      };
    case UserActionTypes.UpdateDislikedQuotes:
      if (state.likedQuotes.includes(action.payload.id)) {
        const updatedLikedQuotes = state.likedQuotes.filter(
          (likedQuoteId) => likedQuoteId !== action.payload.id
        );
        return {
          ...state,
          dislikedQuotes: [...state.dislikedQuotes, action.payload.id],
          likedQuotes: updatedLikedQuotes,
        };
      }
      return {
        ...state,
        dislikedQuotes: [...state.dislikedQuotes, action.payload.id],
      };
    default:
      throw Error(`Action type ${action.type} is not supported`);
  }
}

// HOC - Higher Order Component (UserProvider)
export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, { 
    user: null, 
    likedQuotes: [], 
    dislikedQuotes: [] 
  });

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

