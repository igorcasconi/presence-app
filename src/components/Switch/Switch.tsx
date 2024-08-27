"use client";
import { ChangeEvent } from "react";
import { InputProps } from "../Input/Input";

interface SwitchProps extends Pick<InputProps, "value" | "onChange"> {
  checked: boolean;
}

const Switch = ({ onChange, checked }: SwitchProps) => {
  const handleChangeSwitch = (event?: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  };

  return (
    <div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          id="switch"
          type="checkbox"
          className="peer sr-only"
          onChange={handleChangeSwitch}
          checked={checked}
        />
        <div
          className="peer h-6 w-11 rounded-full border border-gray-700 bg-gray-600 after:absolute after:left-[2px] 
        after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-600 
        after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 
        peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-green-400"
        />
      </label>
    </div>
  );
};

export default Switch;
