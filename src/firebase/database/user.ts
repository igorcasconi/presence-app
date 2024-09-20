import { UserProps } from "@/shared/types/user";
import { app } from "../config";
import {
  getDatabase,
  ref,
  get,
  query,
  orderByKey,
  startAt,
  limitToFirst,
  set,
} from "firebase/database";

const database = getDatabase(app);

export const getUserData = async (userId: string) => {
  const userRef = ref(database, `users/${userId}`);

  try {
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const data = snapshot.val() as UserProps;
      return data;
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const getUserList = async (startKey: string | null, limit: number) => {
  let usersRef = ref(database, "users");

  if (!!startKey) {
    // @ts-ignore
    usersRef = query(
      usersRef,
      orderByKey(),
      startAt(startKey),
      limitToFirst(limit + 1)
    );
  } else {
    // @ts-ignore
    usersRef = query(usersRef, orderByKey(), limitToFirst(limit));
  }

  try {
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as { [key: string]: UserProps };
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user list:", error);
    return null;
  }
};

export const updateUser = async (uid: string, user: UserProps) => {
  try {
    set(ref(database, "users/" + uid), {
      isActive: user.isActive,
      isTeacher: user.isTeacher,
      isAdmin: user.isAdmin,
      isStudent: user.isStudent,
      name: user.name,
    });
  } catch (error) {
    console.log("error", error);
  }
};

export const getTeacherSelectList = async () => {
  let modalitiesRef = ref(database, "users");
  try {
    // @ts-ignore
    modalitiesRef = query(modalitiesRef, orderByKey());
    const snapshot = await get(modalitiesRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as { [key: string]: UserProps };
      const arrayData = Object.keys(data).map((key) => ({
        uid: key,
        ...data[key],
      }));
      return arrayData.filter((user) => user.isTeacher);
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching modality list:", error);
    return null;
  }
};
