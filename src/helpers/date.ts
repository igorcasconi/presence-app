import { AttendanceProps } from "@/shared/types/attendance";
import {
  nextMonday,
  nextThursday,
  nextWednesday,
  nextTuesday,
  nextFriday,
  nextSaturday,
  nextSunday,
  format,
  set,
  isToday,
  differenceInDays,
} from "date-fns";

export enum WEEK_DAYS_PT {
  Monday = "Segunda-feira",
  Tuesday = "Terça-feira",
  Wednesday = "Quarta-feira",
  Thursday = "Quinta-feira",
  Friday = "Sexta-feira",
  Saturday = "Sábado",
  Sunday = "Domingo",
}

export const getDate = (weekDayName: string, dateNextSunday: Date) => {
  let date: Date;
  switch (weekDayName) {
    case "Monday":
      date = nextMonday(dateNextSunday);
      break;
    case "Tuesday":
      date = nextTuesday(dateNextSunday);
      break;
    case "Wednesday":
      date = nextWednesday(dateNextSunday);
      break;
    case "Thursday":
      date = nextThursday(dateNextSunday);
      break;
    case "Friday":
      date = nextFriday(dateNextSunday);
      break;
    case "Saturday":
      date = nextSaturday(dateNextSunday);
      break;
    case "Sunday":
      date = nextSunday(dateNextSunday);
      break;
    default:
      date = dateNextSunday;
      break;
  }

  return format(date, "yyyy-MM-dd");
};

export const handleSortData = (
  dataLeft: AttendanceProps,
  dataRight: AttendanceProps
) => {
  const splittedTimeRight = dataRight.time.split(":");
  const dateRight = set(new Date(dataRight.date), {
    hours: Number(splittedTimeRight[0]),
    minutes: Number(splittedTimeRight[1]),
  });

  const splittedTimeLeft = dataLeft.time.split(":");
  const dateLeft = set(new Date(dataLeft.date), {
    hours: Number(splittedTimeLeft[0]),
    minutes: Number(splittedTimeLeft[1]),
  });

  if (dateLeft < dateRight) return -1;
  return 1;
};

export const isOpenAccordionWeekDay = (weekDay: Date) => {
  return isToday(weekDay);
};

export const validateRegistrationDate = (date: string) => {
  const monthlyFeeDay = Number(format(date!, "dd"));
  const monthlyFeeDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    monthlyFeeDay
  );

  const isDateGreaterThanMonthlyFee = differenceInDays(
    new Date(),
    monthlyFeeDate
  );

  return isDateGreaterThanMonthlyFee > 1;
};
