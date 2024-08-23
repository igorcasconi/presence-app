export type SignUpFormProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormProps = {
  email: string;
  password: string;
};

export type UserProps = {
  name: string;
  isStudent?: boolean;
  isTeacher?: boolean;
  isAdmin?: boolean;
  isActive?: boolean;
  modalities?: string[];
  uid?: string;
};
