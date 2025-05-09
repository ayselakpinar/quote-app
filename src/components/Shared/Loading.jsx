import React from "react";

export const Loading = ({
  text = "Loading...",
  className = "text-center text-xl text-gray-600 mt-8",
}) => {
  return <p className={className}>{text}</p>;
};
