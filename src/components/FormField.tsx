"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({
  label,
  id,
  error,
  required = false,
  children
}: FormFieldProps) {
  return (
    <div className="form-field-container">
      <div className="label-container">
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-asterisk"> *</span>}
        </label>
      </div>
      <div className="input-wrapper">
        {children}
        <div className="focus-glow-border" />
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="field-error-message"
            id={`${id}-error`}
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
