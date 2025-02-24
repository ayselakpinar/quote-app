import { useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { logout, auth } from "./firebase/auth";
import { UserPage } from "./components/UserPage";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { UserContext, UserDispatchContext, UserActionTypes } from "./UserContext";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const user = useContext(UserContext);  // Get the current user from context
  const dispatch = useContext(UserDispatchContext);

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
      {/* Navigation Bar */}
      <nav className="nav--top">
        <button onClick={() => setCurrentPage("home")} className="nav-btn">
          Home
        </button>

        {/* If user is logged in, show User and Logout buttons */}
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
          // If not logged in, show Login and Register buttons
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

      {/* Page Rendering */}
      {currentPage === "home" && <Home />}
      {currentPage === "user" && <UserPage />}
      {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
      {currentPage === "register" && <Register setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;


