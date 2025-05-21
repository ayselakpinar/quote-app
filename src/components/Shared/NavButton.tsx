import React, { ReactNode, MouseEvent } from "react";

type ButtonVariant = "default" | "primary" | "danger";

interface NavButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

export const NavButton = ({
  onClick,
  children,
  variant = "default",
  className = "",
}: NavButtonProps) => {
  const baseStyles =
    "px-3 py-2 rounded-md text-sm font-medium transition duration-300";

  const variantStyles: Record<ButtonVariant, string> = {
    default: "text-gray-700 hover:text-primary hover:bg-gray-100",
    primary: "text-white bg-primary hover:bg-primary-dark",
    danger: "text-white bg-red-500 hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
