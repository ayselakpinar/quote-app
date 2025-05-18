import React from "react";

export const Input = ({
  type = "text",
  id,
  placeholder,
  required = false,
  onChange,
  value,
}) => {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
  );
};
