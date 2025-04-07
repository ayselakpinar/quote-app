import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { logout, auth } from "./firebase/auth.js";
import { UserPage } from "./components/UserPage/index.jsx";
import { Home } from "./components/Home/index.jsx";
import { Login } from "./components/Login/index.jsx";
import { Register } from "./components/Register/index.jsx";
import {
  UserContext,
  UserDispatchContext,
  UserActionTypes,
} from "./UserContext.jsx";
import { NewQuotePage } from "./components/NewQuote/index.jsx";
import { LikedQuotes } from "./components/LikedQuotes/index.jsx";
import { UserSettings } from "./components/UserSettings/index.jsx";

function AppContent() {
  const user = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, displayName, uid } = user;
        if (dispatch) {
          dispatch({
            type: UserActionTypes.SetUser,
            payload: { email, name: displayName, id: uid },
          });
        }
      } else {
        if (dispatch) {
          dispatch({ type: UserActionTypes.SetUser, payload: null });
        }
      }
    });

    return unsubscribe;
  }, [dispatch]);

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <button 
                  onClick={() => navigate("/")} 
                  className="text-2xl font-bold text-primary hover:text-primary-dark transition duration-300"
                >
                  Quotes
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
              {user && user.user ? (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate("/user")} 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition duration-300"
                  >
                    My Account
                  </button>
                  <button 
                    onClick={() => navigate("/new-quote")} 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition duration-300"
                  >
                    New Quote
                  </button>
                  <button 
                    onClick={() => navigate("/user/quotes")} 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition duration-300"
                  >
                    Liked Quotes
                  </button>
                  <button 
                    onClick={() => navigate("/user/settings")} 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition duration-300"
                  >
                    Settings
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate("/login")} 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition duration-300"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate("/register")} 
                    className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-dark transition duration-300"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="pt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/user/quotes" element={<LikedQuotes />} />
          <Route path="/user/settings" element={<UserSettings />} />
          <Route path="/new-quote" element={<NewQuotePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
