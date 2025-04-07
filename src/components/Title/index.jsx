import React from 'react';

export function Title({ children }) {
  return (
    <h1 className="text-4xl font-bold text-primary-dark mb-8 text-center">
      {children}
    </h1>
  );
}