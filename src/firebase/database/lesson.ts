import {
  get,
  getDatabase,
  limitToFirst,
  orderByKey,
  ref,
  set,
  startAt,
  query,
  remove,
} from "firebase/database";

import { v4 as uuidv4 } from "uuid";

import { app } from "../config";

import { LessonFormProps, LessonProps } from "@/shared/types/lesson";
import { differenceInDays } from "date-fns";

const database = getDatabase(app);

export const createLesson = async (uid: string, lesson: LessonFormProps) => {
  let error;
  try {
    set(ref(database, "lessons/" + uid), {
      isActive: lesson.isActive,
      time: lesson.time,
      modality: lesson.modality,
      teacher: lesson.teacher,
      createdAt: new Date(),
      hasGenerateLesson: false,
      ...(!!lesson?.weekDays?.length && { weekDays: lesson.weekDays }),
      ...(!!lesson?.date && { date: lesson.date }),
      ...(!!lesson?.title && { title: lesson.title }),
    });

    if (lesson.isSingleLesson) {
      const uidAttendance = uuidv4();
      set(ref(database, "attendance/" + uidAttendance), {
        isActive: true,
        createdAt: new Date(),
        modality: lesson.modality,
        teacher: lesson.teacher,
        time: lesson.time,
        date: lesson.date,
        lessonId: uid,
        isSingleLesson: true,
        title: lesson.title,
      });
    }
  } catch (err) {
    console.log("error", err);
    error = err;
  }

  return { error };
};

export const updateButtonGenerateLesson = async (
  lessonId: string,
  hasGenerateLesson: boolean
) => {
  const lessonRef = ref(database, `lessons/${lessonId}`);

  try {
    const snapshot = await get(lessonRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as LessonProps;
      set(ref(database, "lessons/" + lessonId), {
        ...data,
        hasGenerateLesson,
      });
    }
  } catch (error) {
    console.error("Error updating lesson:", error);
    return false;
  }
};

export const deleteLesson = async (lessonId: string) => {
  try {
    await remove(ref(database, `lessons/${lessonId}`));
    return true;
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return false;
  }
};

export const deleteOldLessons = async () => {
  let lessonsRef = ref(database, "lessons");
  try {
    // @ts-ignore
    lessonsRef = query(lessonsRef, orderByKey());
    const snapshot = await get(lessonsRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as { [key: string]: LessonProps };
      Object.keys(data).forEach((key) => {
        const today = new Date();

        const numberOfDays = differenceInDays(today, new Date(data[key].date!));

        if (numberOfDays >= 2) {
          remove(ref(database, `lessons/${key}`));
        }
      });
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error delete old lesson:", error);
    return null;
  }
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
  const lessonRef = ref(database, `lessons/${lessonId}`);

  try {
    const snapshot = await get(lessonRef);

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
