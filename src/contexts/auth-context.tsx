import React, { createContext, useContext, useState, useEffect } from "react";
//import { auth } from "../config/firebase-config";
/* import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth"; */

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  //signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log("Auth Provider Rendered");
  const [user, setUser] = useState<User | null>(null);

  // Simulated authentication function
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    // Hardcoded credentials (replace with database lookup in production)
    if (username === "craigbauer23@gmail.com" && password === "password") {
      setUser({ username });
      localStorage.setItem("user", JSON.stringify({ username }));
      return true;
    }
    return false;
  };

  const logOut = () => {
    console.log("User logged out");
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
