import React from "react";

export const Input = ({
  type = "text",
  id,
  value,
  onChange,
  placeholder,
  required = false,
  className = "w-full px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:border-primary",
}) => {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={className}
    />
  );
};
