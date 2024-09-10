export type LessonFormProps = {
  time: string;
  modality: string;
  teacher: string;
  isActive: boolean;
  uid?: string;
  isSingleLesson?: boolean;
  weekDays?: string[];
  date?: string;
  hasGenerateLesson?: boolean;
};

export type LessonProps = {
  time: string;
  isActive: boolean;
  weekDays?: string[];
  translateWeekDays?: string[];
  modality?: string;
  teacher?: string;
  teacherName?: string;
  modalityName?: string;
  uid?: string;
  date?: string;
  hasGenerateLessons?: boolean;
};

export type OptionProp = {
  id: string;
  label: string;
};
