import React, { ChangeEvent } from "react";

interface InputProps {
  type?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  id,
  placeholder,
  required = false,
  onChange,
  value,
  className = "",
}) => {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
    />
  );
};
