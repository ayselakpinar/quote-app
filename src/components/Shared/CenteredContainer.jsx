import React from "react";

export const CenteredContainer = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8">{children}</div>
    </div>
  );
};
