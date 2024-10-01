import { PropsWithChildren } from "react";

export interface CardProps<T> {
  data?: T;
  onClick?: () => void;
}

const Card = ({ onClick, children }: PropsWithChildren<CardProps<any>>) => {
  return (
    <div
      className="h-auto w-full flex flex-col py-2 px-4 mt-4 bg-zinc-800 rounded-md shadow-lg cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
