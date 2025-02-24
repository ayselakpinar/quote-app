import React, { useState, useContext } from "react";
import { register } from "../../firebase/auth";
import { UserDispatchContext, UserActionTypes } from "../../UserContext";
import "./styles.css";


export const Register = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useContext(UserDispatchContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userData = await register(email, password);
      dispatch({ type: UserActionTypes.SetUser, payload: userData });
      setCurrentPage("home");
    } catch (error) {
      console.error("Error registering:", error);
      setError("Error registering. Make sure to use password with at least 6 characters.");
    }
  };

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleRegister} className="form">
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
          Register
        </button>
        <div className="error">
          <p>{error}</p>
        </div>
      </form>
    </>
  );
};