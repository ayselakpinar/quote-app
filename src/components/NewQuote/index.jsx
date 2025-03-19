"use client";
import { useActionState } from "react";
import QuoteForm from "./QuoteForm.jsx"; 

export function NewQuotePage() {
  return (
    <div>
      <h1>New Quote</h1>
      <QuoteForm />
    </div>
  );
}

