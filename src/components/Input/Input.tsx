"use client";

import { useInputMask } from "@code-forge/react-input-mask";
import React, { useState } from "react";
import { EyeHideIcon, EyeIcon } from "../icons";

const containerPropsDefault = "w-full h-auto relative";

export interface InputProps {
  value?: string;
  onChange?: (event: any) => void;
  label?: string;
  name?: string;
  placeholder?: string;
  type?: string;
  inputStyle?: string;
  message?: string;
  register?: any;
  error?: boolean;
  containerProps?: string;
  readOnly?: boolean;
  onClick?: () => void;
  mask?: string;
}

const Input = ({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  containerProps = containerPropsDefault,
  inputStyle,
  message,
  register,
  error,
  readOnly = false,
  onClick,
  mask,
}: InputProps) => {
  const [inputType, setInputType] = useState(type);
  const { getInputProps } = useInputMask({
    mask: mask,
  });

  const handleInputTypePassword = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  return (
    <div className={containerProps}>
      <label
        className={`text-base font-medium leading-4 mb-1 ${
          !!error ? `text-negative-100` : `text-gray-50`
        }`}
      >
        {label}
      </label>
      <input
        type={inputType}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        onClick={onClick}
        {...(!!register && { ...register(name) })}
        className={`block w-full rounded-lg border bg-primary p-3 text-white  focus:outline-transparent focus:outline-0 ${inputStyle} ${
          !!error
            ? `border-negative-100 focus:border-negative-100`
            : `border-gray-50 focus:border-secondary`
        }`}
        {...getInputProps()}
      />
      {type === "password" && (
        <button
          className="absolute top-[50%] right-4"
          type="button"
          onClick={handleInputTypePassword}
        >
          {inputType === "text" ? <EyeIcon /> : <EyeHideIcon />}
        </button>
      )}
      {!!message && (
        <p
          className={`mt-1 w-full text-base font-normal leading-4 ${
            !!error ? `text-negative-100` : `text-gray-50`
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Input;
