import React from "react";

export const CenteredContainer = ({ children, className = "" }) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-background ${className}`}
    >
      {children}
    </div>
  );
};
