import { app } from "../config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateCurrentUser,
  updateProfile,
} from "firebase/auth";

const auth = getAuth(app);

export const signUpUser = async (email: string, password: string) => {
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    error = err;
  }

  return { result, error };
};

export const updateUserData = async (name: string) => {
  let result = null,
    error = null;

  if (!auth.currentUser) {
    error = "Não possui acesso neste momento!";
    return { error };
  }

  try {
    result = updateProfile(auth?.currentUser, {
      displayName: name,
    });
  } catch (err) {
    error = err;
  }

  return { result, error };
};
