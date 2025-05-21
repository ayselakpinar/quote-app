import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../firebase/auth";
import { useUserDispatchContext, UserActionTypes } from "../../UserContext";
import { CenteredContainer } from "../Shared/CenteredContainer";
import { PageTitle } from "../Shared/PageTitle";
import { Label } from "../Shared/Label";
import { Input } from "../Shared/Input";

interface UserData {
  email: string | null;
  name: string | null;
  id: string;
}

export const Login: React.FC = (): React.ReactElement => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useUserDispatchContext();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    try {
      const userData = (await login(email, password)) as UserData;
      dispatch({
        type: UserActionTypes.SetUser,
        payload: userData,
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <CenteredContainer className="p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <PageTitle>Login</PageTitle>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
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
    </CenteredContainer>
  );
};
