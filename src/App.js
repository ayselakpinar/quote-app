// App.js

import React, { useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { logout, auth } from "./firebase/auth.js";
import { UserPage } from "./components/UserPage/index.jsx";
import { Home } from "./components/Home/index.jsx";
import { Login } from "./components/Login/index.jsx";
import { Register } from "./components/Register/index.jsx";
import { UserContext, UserDispatchContext, UserActionTypes } from "./UserContext.jsx";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const user = useContext(UserContext);  // Kullanıcı bilgilerini context'ten al
  const dispatch = useContext(UserDispatchContext); // dispatch fonksiyonunu al

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
      setCurrentPage("home");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out. Please try again.");
    }
  }

  return (
    <div className="App">
      <nav className="nav--top">
        <button onClick={() => setCurrentPage("home")} className="nav-btn">
          Home
        </button>

        {user && user.user ? (
          <>
            <button onClick={() => setCurrentPage("user")} className="nav-btn">
              User
            </button>
            <button onClick={handleLogout} className="nav-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setCurrentPage("login")} className="nav-btn">
              Login
            </button>
            <button
              onClick={() => setCurrentPage("register")}
              className="nav-btn"
            >
              Register
            </button>
          </>
        )}
      </nav>

      {/* Sayfa Rendering */}
      {currentPage === "home" && <Home />}
      {currentPage === "user" && <UserPage />}
      {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
      {currentPage === "register" && <Register setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;
