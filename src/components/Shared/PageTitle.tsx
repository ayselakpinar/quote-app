import React, { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
  className?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({
  children,
  className = "text-3xl font-bold text-primary-dark mb-8 text-center",
}) => {
  return <h1 className={className}>{children}</h1>;
};
