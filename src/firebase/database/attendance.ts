import {
  get,
  getDatabase,
  orderByKey,
  ref,
  set,
  query,
  remove,
} from "firebase/database";
import {
  differenceInWeeks,
  nextSunday as getNextSunday,
  isPast,
  isWithinInterval,
} from "date-fns";
import { v4 as uuidv4 } from "uuid";

import { app } from "../config";

import { LessonProps } from "@/shared/types/lesson";
import { getDate } from "@/helpers/date";
import { AttendanceProps } from "@/shared/types/attendance";

const database = getDatabase(app);

export const createAttendanceList = async (lesson: LessonProps) => {
  let error;
  const dateNextSunday = getNextSunday(new Date());

  try {
    if (!!lesson.weekDays?.length) {
      lesson.weekDays.forEach((day) => {
        const uid = uuidv4();
        const date = getDate(day, dateNextSunday);
        set(ref(database, "attendance/" + uid), {
          isActive: true,
          createdAt: new Date(),
          modality: lesson.modality,
          teacher: lesson.teacher,
          time: lesson.time,
          date: date,
          lessonId: lesson.uid,
        });
      });
    }
  } catch (err) {
    console.log("error", err);
    error = err;
  }

  return { error };
};

export const setUserPresence = async (
  uid: string,
  attendance: AttendanceProps
) => {
  let error;

  delete attendance.modalityName;
  delete attendance.teacherName;

  try {
    set(ref(database, `attendance/${uid}`), {
      ...attendance,
      attendanceList: attendance.attendanceList,
    });
  } catch (err) {
    console.log("error", err);
    error = err;
  }

  return { error };
};

export const changeStatusAttendanceList = async (
  uid: string,
  attendance: AttendanceProps
) => {
  let error;

  delete attendance.modalityName;
  delete attendance.teacherName;

  try {
    set(ref(database, `attendance/${uid}`), {
      ...attendance,
    });
  } catch (err) {
    console.log("error", err);
    error = err;
  }

  return { error };
};

export const deleteAttendanceWithLessonId = async (lessonId: string) => {
  let attendancesRef = ref(database, "attendance");
  try {
    // @ts-ignore
    attendancesRef = query(attendancesRef, orderByKey());
    const snapshot = await get(attendancesRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as { [key: string]: AttendanceProps };
      Object.keys(data).forEach((key) => {
        if (data[key].lessonId === lessonId) {
          remove(ref(database, `attendance/${key}`));
        }
      });
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error delete attendance with by lesson id:", error);
    return null;
  }
};

export const deleteOldAttendance = async () => {
  let attendancesRef = ref(database, "attendance");
  try {
    // @ts-ignore
    attendancesRef = query(attendancesRef, orderByKey());
    const snapshot = await get(attendancesRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as { [key: string]: AttendanceProps };
      Object.keys(data).forEach((key) => {
        const today = new Date();

        const numberOfWeeks = differenceInWeeks(
          today,
          new Date(data[key].date)
        );

        if (numberOfWeeks >= 2) {
          remove(ref(database, `attendance/${key}`));
        }
      });
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error delete old attendance:", error);
    return null;
  }
};

export const getAttendanceWeekList = async (
  startDayWeek: Date,
  endDayWeek: Date
) => {
  let attendancesRef = ref(database, "attendance");

  try {
    // @ts-ignore
    attendancesRef = query(attendancesRef, orderByKey());
    const snapshot = await get(attendancesRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as { [key: string]: AttendanceProps };
      const filteredData = Object.keys(data)
        .map((key) => {
          const dateIsWithinInterval = isWithinInterval(
            new Date(data[key].date),
            {
              start: startDayWeek,
              end: endDayWeek,
            }
          );

          if (dateIsWithinInterval && !data[key].isSingleLesson)
            return { ...data[key], uid: key };
        })
        .filter((day) => !!day);

      return filteredData;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getSingleLessons = async () => {
  let attendancesRef = ref(database, "attendance");

  try {
    // @ts-ignore
    attendancesRef = query(attendancesRef, orderByKey());
    const snapshot = await get(attendancesRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as { [key: string]: AttendanceProps };
      const filteredData = Object.keys(data)
        .map((key) => {
          if (!isPast(data[key].date) && data[key].isSingleLesson)
            return { ...data[key], uid: key };
        })
        .filter((day) => !!day);

      return filteredData;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAttendanceData = async (attendanceId: string) => {
  const attendanceRef = ref(database, `attendance/${attendanceId}`);

  try {
    const snapshot = await get(attendanceRef);

    if (snapshot.exists()) {
      const data = snapshot.val() as AttendanceProps;
      return data;
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
