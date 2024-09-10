import {
  nextMonday,
  nextThursday,
  nextWednesday,
  nextTuesday,
  nextFriday,
  nextSaturday,
  nextSunday,
  format,
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
