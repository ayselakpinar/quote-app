import React from "react";

export const PageTitle = ({
  children,
  className = "text-3xl font-bold text-primary-dark mb-8 text-center",
}) => {
  return <h1 className={className}>{children}</h1>;
};
