import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  AuthError,
} from "firebase/auth";
import { app } from "./config";

interface User {
  email: string | null;
  name: string | null;
  id: string;
}

export const auth = getAuth(app);

export const register = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return {
      email: user.email,
      name: user.displayName,
      id: user.uid,
    };
  } catch (error) {
    console.error("Register error:", error);
    throw error as AuthError;
  }
};

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return {
      email: user.email,
      name: user.displayName,
      id: user.uid,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error as AuthError;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error as AuthError;
  }
};
