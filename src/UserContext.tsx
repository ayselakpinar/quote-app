import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface User {
  id: string;
  email: string | null;
  name: string | null;
}

interface UserState {
  user: User | null;
  likedQuotes: string[];
  dislikedQuotes: string[];
}

export const UserActionTypes = {
  SetUser: "SET_USER",
  ClearUser: "CLEAR_USER",
  UpdateLikedQuotes: "UPDATE_LIKED_QUOTES",
  UpdateDislikedQuotes: "UPDATE_DISLIKED_QUOTES",
} as const;

type UserAction =
  | { type: typeof UserActionTypes.SetUser; payload: User | null }
  | { type: typeof UserActionTypes.ClearUser }
  | { type: typeof UserActionTypes.UpdateLikedQuotes; payload: string }
  | { type: typeof UserActionTypes.UpdateDislikedQuotes; payload: string };

const initialState: UserState = {
  user: null,
  likedQuotes: [],
  dislikedQuotes: [],
};

export const UserContext = createContext<UserState | undefined>(undefined);
export const UserDispatchContext = createContext<
  React.Dispatch<UserAction> | undefined
>(undefined);

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case UserActionTypes.SetUser:
      return {
        ...state,
        user: action.payload,
      };
    case UserActionTypes.ClearUser:
      return {
        ...state,
        user: null,
      };
    case UserActionTypes.UpdateLikedQuotes:
      return {
        ...state,
        likedQuotes: [...state.likedQuotes, action.payload],
      };
    case UserActionTypes.UpdateDislikedQuotes:
      return {
        ...state,
        dislikedQuotes: [...state.dislikedQuotes, action.payload],
      };
    default:
      return state;
  }
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);

  if (context === undefined || dispatch === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return { ...context, dispatch };
};

export const useUserDispatchContext = () => {
  const dispatch = useContext(UserDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      "useUserDispatchContext must be used within a UserProvider"
    );
  }
  return dispatch;
};
