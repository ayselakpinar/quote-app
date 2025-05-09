import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../../firebase/auth";
import { UserDispatchContext, UserActionTypes } from "../../UserContext";
import { CenteredContainer } from "../Shared/CenteredContainer";
import { PageTitle } from "../Shared/PageTitle";
import { Label } from "../Shared/Label";
import { Input } from "../Shared/Input";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useContext(UserDispatchContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userData = await registerUser(email, password);
      dispatch({
        type: UserActionTypes.SetUser,
        payload: userData,
      });
      navigate("/");
    } catch (error) {
      console.error("Error registering:", error);
      setError("Error registering. Please try again.");
    }
  };

  return (
    <CenteredContainer className="p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <PageTitle>Register</PageTitle>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Register
          </button>

          {error && (
            <div className="text-red-500 text-center">
              <p>{error}</p>
            </div>
          )}
        </form>
      </div>
    </CenteredContainer>
  );
};
