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
};
