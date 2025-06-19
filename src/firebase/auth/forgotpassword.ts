import { app } from "../config";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth(app);

export const forgotPasswordUser = async (email: string) => {
  let result = null,
    error = null;
  try {
    result = await sendPasswordResetEmail(auth, email);
  } catch (err) {
    error = err;
  }

  return { result, error };
};
