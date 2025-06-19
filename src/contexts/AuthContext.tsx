"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { app } from "@/firebase/config";
import { UserProps } from "@/shared/types/user";
import { getUserData } from "@/firebase/database/user";

const auth = getAuth(app);

interface AuthContextProps {
  userFirebase: User | null;
  userData?: UserProps | null;
  setUserData: Dispatch<SetStateAction<UserProps | undefined>>;
  loading: boolean;
  isUserLimitOnLesson?: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userFirebase, setUserFirebase] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProps>();
  const isUserLimitOnLesson =
    process.env.NEXT_PUBLIC_ALLOW_MAX_USERS_PER_LESSON === "true";

  const getUserDatabase = async (uid: string) => {
    const userDatabase = await getUserData(uid);

    setUserData({
      isActive: userDatabase?.isActive!,
      isAdmin: userDatabase?.isAdmin!,
      isStudent: userDatabase?.isStudent!,
      isTeacher: userDatabase?.isTeacher!,
      name: userDatabase?.name!,
      uid,
      ...(!!userDatabase?.registrationDate && {
        registrationDate: userDatabase?.registrationDate,
      }),
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserFirebase(user);
        getUserDatabase(user.uid);
      } else {
        setUserFirebase(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userFirebase,
        userData,
        loading,
        isUserLimitOnLesson,
        setUserData,
      }}
    >
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
