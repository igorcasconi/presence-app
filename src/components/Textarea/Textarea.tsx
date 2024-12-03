"use client";

import React from "react";
import { InputProps } from "../Input/Input";

const containerPropsDefault = "w-full min-h-30 relative";

const Textarea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  containerProps = containerPropsDefault,
  inputStyle,
  message,
  register,
  error,
  readOnly = false,
  onClick,
}: InputProps) => {
  return (
    <div className={containerProps}>
      <label
        className={`text-base font-medium leading-4 mb-1 ${
          !!error ? `text-negative-100` : `text-gray-50`
        }`}
      >
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        onClick={onClick}
        {...(!!register && { ...register(name) })}
        className={`block w-full h-40 rounded-lg border bg-primary p-3 text-white  focus:outline-transparent focus:outline-0 ${inputStyle} ${
          !!error
            ? `border-negative-100 focus:border-negative-100`
            : `border-gray-50 focus:border-secondary`
        }`}
      />
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

export default Textarea;
