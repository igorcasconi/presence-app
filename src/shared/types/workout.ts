export type WorkoutFormProps = {
  isActive: boolean;
  title: string;
  rest?: string;
  observation?: string;
  sets?: string;
  rhythm?: string;
  repetition?: string;
  url?: string;
  uid?: string;
  type?: string;
  position?: number | string;
};

export type WorkoutProps = {
  isActive: boolean;
  title: string;
  uid: string;
  rest?: string;
  observation?: string;
  sets?: string;
  rhythm?: string;
  repetition?: string;
  url?: string;
  type?: string;
  createdAt?: Date;
  position?: number | string;
};
