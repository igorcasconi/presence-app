import { NamesProps } from "./lesson";

export type AttendanceProps = {
  isActive: boolean;
  createAt: string;
  modality: string;
  teacher: string;
  time: string;
  date: string;
  attendanceList: Array<string>;
  lessonId: string;
  isSingleLesson?: boolean;
  title?: string;
} & NamesProps;
