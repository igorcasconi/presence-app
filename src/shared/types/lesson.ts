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
  title?: string;
};

export type LessonProps = {
  time: string;
  isActive: boolean;
  weekDays?: string[];
  translateWeekDays?: string[];
  modality?: string;
  teacher?: string;
  uid?: string;
  date?: string;
  hasGenerateLessons?: boolean;
  createdAt?: Date;
  title?: string;
} & NamesProps;

export type OptionProp = {
  id: string;
  label: string;
};

export type NamesProps = {
  teacherName?: string;
  modalityName?: string;
};
