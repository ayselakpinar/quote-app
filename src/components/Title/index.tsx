import React, { ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
}

export const Title: React.FC<TitleProps> = ({
  children,
}): React.ReactElement => {
  return (
    <h1 className="text-4xl font-bold text-primary-dark mb-8 text-center">
      {children}
    </h1>
  );
};
