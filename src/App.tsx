import React, { ReactElement } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/auth";
import { UserPage } from "./components/UserPage";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { NavButton } from "./components/Shared/NavButton";
import { UserProvider } from "./UserContext";
import { NewQuotePage } from "./components/NewQuote";
import { LikedQuotes } from "./components/LikedQuotes";
import { UserSettings } from "./components/UserSettings";
import { useUserContext } from "./UserContext";

interface UserState {
  user: {
    id: string;
    email: string | null;
    name: string | null;
  } | null;
}

const AppContent: React.FC = (): ReactElement => {
  const { user, dispatch } = useUserContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: "SET_USER",
          payload: {
            id: user.uid,
            email: user.email,
            name: user.displayName,
          },
        });
      } else {
        dispatch({ type: "SET_USER", payload: null });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "SET_USER", payload: null });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out. Please try again.");
    }
  };

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
              {user ? (
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
};

export const App: React.FC = (): ReactElement => {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
};
