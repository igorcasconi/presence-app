import { useEffect } from "react";
import { getAuth, onIdTokenChanged } from "firebase/auth";

const useFirebaseAuthSync = () => {
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(); // não força renovação aqui
        await fetch("/api/login", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    });

    return () => unsubscribe();
  }, []);
};

export default useFirebaseAuthSync;
