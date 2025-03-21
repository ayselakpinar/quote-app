"use client";
import React from "react";
import  QuoteForm  from './QuoteForm';
import './styles.css';
import { Title } from "../Title";

export function NewQuotePage() {
  return (
    <div className="new-quote-container">
      <Title>New Quote</Title>
      <QuoteForm />
    </div>
  );
}

