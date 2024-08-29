"use client";

import { InputProps } from "../Input/Input";
import { ArrowDownIcon } from "../icons";
import { OptionProp } from "@/shared/types/lesson";

interface SelectProps
  extends Pick<
    InputProps,
    | "onChange"
    | "value"
    | "label"
    | "error"
    | "message"
    | "placeholder"
    | "register"
    | "name"
  > {
  options: Array<OptionProp>;
}

const Select = ({
  label,
  onChange,
  value,
  error,
  placeholder,
  name,
  register,
  options,
  message,
}: SelectProps) => {
  const handleSelectOption = (event?: any) => {
    console.log(event.target.value, "select");
    onChange?.(event.target.value);
  };

  return (
    <div className="relative h-auto w-full">
      <label
        className={`text-base font-medium leading-4 mb-1 ${
          !!error ? `text-negative-100` : `text-gray-50`
        }`}
      >
        {label}
      </label>
      <select
        onChange={handleSelectOption}
        defaultValue={value}
        {...register(name)}
        className={`block w-full rounded-lg border bg-primary p-3 text-white  focus:outline-transparent focus:outline-0 ${
          !!error
            ? `border-negative-100 focus:border-negative-100`
            : `border-gray-50 focus:border-secondary`
        }`}
      >
        <option value="" disabled selected hidden className="text-zinc-600">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.id}
            className="mt-2 cursor-pointer"
            value={option.id}
          >
            {option.label}
          </option>
        ))}
      </select>
      <div
        className={`absolute right-4 ${error ? "top-[40%]" : "top-[50%]"} z-10`}
      >
        <ArrowDownIcon />
      </div>
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

export default Select;
