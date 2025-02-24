import React, { useState, useContext } from "react";
import { login } from "../../firebase/auth";
import { UserDispatchContext, UserActionTypes } from "../../UserContext";
import "./styles.css";

export const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useContext(UserDispatchContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      dispatch({ type: UserActionTypes.SetUser, payload: userData });
      setCurrentPage("home");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="form">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="form-input"
        />
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="form-input"
        />
        <button type="submit" className="btn--primary">
          Login
        </button>

        <div className="error">
          <p>{error}</p>
        </div>
      </form>
    </>
  );
};




