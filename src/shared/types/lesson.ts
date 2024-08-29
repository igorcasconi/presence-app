export type LessonFormProps = {
  time: string;
  modality: string;
  teacher: string;
  isActive: boolean;
  uid?: string;
  isSingleLesson?: boolean;
  weekDays?: string[];
  date?: string;
};

export type LessonProps = {
  time: string;
  isActive: boolean;
  weekDays?: string[];
  modality?: string;
  teacher?: string;
  uid?: string;
  date?: string;
};

export type OptionProp = {
  id: string;
  label: string;
};
