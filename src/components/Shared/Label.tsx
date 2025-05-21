import React, { ReactNode } from "react";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
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
