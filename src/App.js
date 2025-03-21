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
import "./App.css";
import { uploadQuotesScript } from "./uploadQuotesScript.js";
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
    <div className="App">
      <nav className="nav--top">
        <button onClick={() => navigate("/")} className="nav-btn">
          Home
        </button>

        {user && user.user ? (
          <>
            <button onClick={() => navigate("/user")} className="nav-btn">
              My Account
            </button>
            <button onClick={() => navigate("/new-quote")} className="nav-btn">
              New Quote
            </button>
            <button onClick={() => navigate("/user/quotes")} className="nav-btn">
              Liked Quotes
            </button>
            <button onClick={() => navigate("/user/settings")} className="nav-btn">
              Settings
            </button>
            <button onClick={handleLogout} className="nav-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="nav-btn">
              Login
            </button>
            <button onClick={() => navigate("/register")} className="nav-btn">
              Register
            </button>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/user/quotes" element={<LikedQuotes />} />
        <Route path="/user/settings" element={<UserSettings />} />
        <Route path="/new-quote" element={<NewQuotePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
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
