import {
  get,
  getDatabase,
  limitToFirst,
  orderByKey,
  ref,
  set,
  startAt,
  query,
} from "firebase/database";
import { app } from "../config";
import { ModalityProps } from "@/shared/types/modality";

const database = getDatabase(app);

export const createUpdateModality = async (
  uid: string,
  modality: ModalityProps
) => {
  let error;
  try {
    set(ref(database, "modalities/" + uid), {
      isActive: modality.isActive,
      name: modality.name,
    });
  } catch (err) {
    console.log("error", err);
    error = err;
  }

  return { error };
};

export const getModalityList = async (
  startKey: string | null,
  limit: number
) => {
  let modalitiesRef = ref(database, "modalities");

  if (!!startKey) {
    // @ts-ignore
    modalitiesRef = query(
      modalitiesRef,
      orderByKey(),
      startAt(startKey),
      limitToFirst(limit + 1)
    );
  } else {
    // @ts-ignore
    modalitiesRef = query(modalitiesRef, orderByKey(), limitToFirst(limit));
  }

  try {
    const snapshot = await get(modalitiesRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as { [key: string]: ModalityProps };
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user list:", error);
    return null;
  }
};

export const getModalityData = async (modalityId: string) => {
  const userRef = ref(database, `modalities/${modalityId}`);

  try {
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const data = snapshot.val() as ModalityProps;
      return data;
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
