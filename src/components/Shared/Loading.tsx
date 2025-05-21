import React from "react";

interface LoadingProps {
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  text = "Loading...",
  className = "text-center text-xl text-gray-600 mt-8",
}) => {
  return <p className={className}>{text}</p>;
};
