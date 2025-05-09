import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { logout, auth } from "./firebase/auth.js";
import { UserPage } from "./components/UserPage/index.jsx";
import { Home } from "./components/Home/index.jsx";
import { Login } from "./components/Login/index.jsx";
import { Register } from "./components/Register/index.jsx";
import { NavButton } from "./components/Shared/NavButton.jsx";
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
                  <NavButton onClick={() => navigate("/user")}>
                    My Account
                  </NavButton>
                  <NavButton onClick={() => navigate("/new-quote")}>
                    New Quote
                  </NavButton>
                  <NavButton onClick={() => navigate("/user/quotes")}>
                    Liked Quotes
                  </NavButton>
                  <NavButton onClick={() => navigate("/user/settings")}>
                    Settings
                  </NavButton>
                  <NavButton onClick={handleLogout} variant="danger">
                    Logout
                  </NavButton>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <NavButton onClick={() => navigate("/login")}>
                    Login
                  </NavButton>
                  <NavButton
                    onClick={() => navigate("/register")}
                    variant="primary"
                  >
                    Register
                  </NavButton>
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
