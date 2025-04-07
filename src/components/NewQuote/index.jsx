"use client";
import React from "react";
import QuoteForm from './QuoteForm';
import { Title } from "../Title";

export function NewQuotePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Title>New Quote</Title>
        <div className="bg-white rounded-lg shadow-md p-8">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}

