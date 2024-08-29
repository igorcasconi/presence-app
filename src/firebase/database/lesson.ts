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

import { LessonFormProps, LessonProps } from "@/shared/types/lesson";

const database = getDatabase(app);

export const createUpdateLesson = async (
  uid: string,
  lesson: LessonFormProps
) => {
  let error;
  try {
    set(ref(database, "lessons/" + uid), {
      isActive: lesson.isActive,
      time: lesson.time,
      modality: lesson.modality,
      teacher: lesson.teacher,
      createdAt: new Date(),
      ...(!!lesson?.weekDays?.length && { weekDays: lesson.weekDays }),
      ...(!!lesson?.date && { date: lesson.date }),
    });
  } catch (err) {
    console.log("error", err);
    error = err;
  }

  return { error };
};

export const getLessonList = async (startKey: string | null, limit: number) => {
  let lessonsRef = ref(database, "lessons");

  if (!!startKey) {
    // @ts-ignore
    lessonsRef = query(
      lessonsRef,
      orderByKey(),
      startAt(startKey),
      limitToFirst(limit + 1)
    );
  } else {
    // @ts-ignore
    lessonsRef = query(lessonsRef, orderByKey(), limitToFirst(limit));
  }

  try {
    const snapshot = await get(lessonsRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as { [key: string]: LessonProps };
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user list:", error);
    return null;
  }
};

export const getLessonData = async (lessonId: string) => {
  const userRef = ref(database, `lessons/${lessonId}`);

  try {
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const data = snapshot.val() as LessonProps;
      return data;
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
