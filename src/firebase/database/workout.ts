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

import { app } from "../config";

import { WorkoutFormProps, WorkoutProps } from "@/shared/types/workout";
import { INCREASE_LIMIT_PAGE } from "@/constants";

const database = getDatabase(app);

export const createWorkout = async (uid: string, workout: WorkoutFormProps) => {
  let error;
  try {
    set(ref(database, "workouts/" + uid), {
      isActive: workout.isActive,
      createdAt: new Date(),
      title: workout.title,
      rest: workout.rest,
      observation: workout.observation,
      sets: workout.sets,
      rhythm: workout.rhythm,
      repetition: workout.repetition,
      type: workout.type,
      url: workout.url,
    });
  } catch (err) {
    console.log("error", err);
    error = err;
  }

  return { error };
};

export const deleteWorkout = async (lessonId: string) => {
  try {
    await remove(ref(database, `workouts/${lessonId}`));
    return true;
  } catch (error) {
    console.error("Error deleting workout:", error);
    return false;
  }
};

export const getWorkoutList = async (
  startKey: string | null,
  limit: number
) => {
  let workoutsRef = ref(database, "workouts");

  if (!!startKey) {
    // @ts-ignore
    workoutsRef = query(
      workoutsRef,
      orderByKey(),
      startAt(startKey),
      limitToFirst(limit + INCREASE_LIMIT_PAGE)
    );
  } else {
    // @ts-ignore
    workoutsRef = query(workoutsRef, orderByKey(), limitToFirst(limit));
  }

  try {
    const snapshot = await get(workoutsRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as { [key: string]: WorkoutProps };
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching workout list:", error);
    return null;
  }
};

export const getWorkoutData = async (workoutId: string) => {
  const workoutsRef = ref(database, `workouts/${workoutId}`);

  try {
    const snapshot = await get(workoutsRef);

    if (snapshot.exists()) {
      const data = snapshot.val() as WorkoutProps;
      return data;
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return null;
  }
};

export const getWorkoutFullList = async () => {
  let workoutsRef = ref(database, "workouts");
  try {
    // @ts-ignore
    workoutsRef = query(workoutsRef, orderByKey());
    const snapshot = await get(workoutsRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as { [key: string]: WorkoutProps };
      return Object.keys(data).map((key) => ({ ...data[key], uid: key }));
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching workouts list:", error);
    return null;
  }
};
