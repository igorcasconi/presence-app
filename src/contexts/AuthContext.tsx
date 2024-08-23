"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { app } from "@/firebase/config";
import { UserProps } from "@/shared/types/user";
import { getUserData } from "@/firebase/database/user";

const auth = getAuth(app);

interface AuthContextProps {
  userFirebase: User | null;
  userData?: UserProps | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userFirebase, setUserFirebase] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProps | null | undefined>(null);

  useEffect(() => {
    const getUserDatabase = async (uid: string) => {
      const userDatabase = await getUserData(uid);
      setUserData(userDatabase);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserDatabase(user.uid);
        setUserFirebase(user);
      } else {
        setUserFirebase(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ userFirebase, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
