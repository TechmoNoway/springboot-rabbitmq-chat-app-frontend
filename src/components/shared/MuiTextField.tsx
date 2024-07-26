import React, { forwardRef, useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  labelValue?: string;
}

const MuiTextField = forwardRef<HTMLInputElement, InputProps>(
  ({ className, labelValue, ...props }, ref) => {
    const [value, setValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    };

    return (
      <div className="relative items-center">
        <label
          htmlFor="username"
          className={`absolute left-4 top-[14px] text- text-[16px] transition-all duration-200 ${
            isFocused || value
              ? "text-xs transform -translate-y-3 text-sky-600"
              : "text-lg font-semibold"
          }`}
        >
          {labelValue}
        </label>
        <Input
          id="username"
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "py-2 px-4 w-96 text-base bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
export default MuiTextField;
