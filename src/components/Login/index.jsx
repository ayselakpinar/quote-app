import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../firebase/auth";
import { UserDispatchContext, UserActionTypes } from "../../UserContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useContext(UserDispatchContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const userData = await login(email, password);
      dispatch({
        type: UserActionTypes.SetUser,
        payload: userData
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-primary-dark mb-8 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-primary-dark font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-primary-dark font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Login
          </button>

          {error && (
            <div className="text-red-500 text-center">
              <p>{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};




