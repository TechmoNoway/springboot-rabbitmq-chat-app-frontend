import React, { useState } from "react";

const TextField = ({ id, label }: { id: string; label: string }) => {
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
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-3 top-3 transition-all duration-200 ${
          isFocused || value ? "text-xs transform -translate-y-6" : "text-base"
        }`}
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="py-2 px-4 w-96 text-base bg-transparent border-2 border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10"
      />
      <div
        className={`absolute inset-0 border-2 ${
          isFocused ? "border-blue-500" : "border-gray-300"
        } rounded-md pointer-events-none transition-all duration-200 ${
          isFocused ? "border-t-transparent" : ""
        }`}
      ></div>
    </div>
  );
};

export default TextField;
