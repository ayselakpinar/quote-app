import React, { ReactNode } from "react";

interface CenteredContainerProps {
  children: ReactNode;
  className?: string;
}

export const CenteredContainer = ({
  children,
  className = "",
}: CenteredContainerProps) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${className}`}
    >
      <div className="max-w-md w-full p-8">{children}</div>
    </div>
  );
};
