import { getDatabase, ref, set } from "firebase/database";
import { app } from "../config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";

const auth = getAuth(app);
const database = getDatabase(app);

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
    set(ref(database, "users/" + auth?.currentUser.uid), {
      name: name,
      isStudent: true,
      isTeacher: false,
      isAdmin: false,
      isActive: true,
    });

    result = updateProfile(auth?.currentUser, {
      displayName: name,
    });
  } catch (err) {
    error = err;
  }

  return { result, error };
};
