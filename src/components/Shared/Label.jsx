import React from "react";

export const Label = ({
  htmlFor,
  children,
  className = "block text-primary-dark font-medium mb-2",
}) => {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
};
