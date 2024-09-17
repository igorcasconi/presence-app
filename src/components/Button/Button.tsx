import React from "react";
import { Loader } from "@/components";

interface ButtonProps {
  text: string;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "submit" | "button";
  disabled?: boolean;
  textStyle?: string;
}

const Button = ({
  text,
  loading = false,
  className,
  onClick,
  type = "button",
  disabled,
  textStyle,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`flex justify-center items-center rounded-lg w-full h-12 px-6 bg-secondary ring-0 ring-[rgba(23, 24, 28, 0.08)] ${className}
      ${disabled && `opacity-40`}`}
    >
      {loading ? (
        <Loader />
      ) : (
        <p className={`text-white text-base font-semibold w-full ${textStyle}`}>
          {text}
        </p>
      )}
    </button>
  );
};

export default Button;
