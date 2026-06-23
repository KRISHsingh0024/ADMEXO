"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface SuccessScreenProps {
  companyName: string;
  contactName: string;
  email: string;
  selectedServices: string[];
  onReset: () => void;
}

export default function SuccessScreen({
  companyName,
  contactName,
  email,
  selectedServices,
  onReset
}: SuccessScreenProps) {
  return (
    <div className="success-container">
      <div className="success-header">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="checkmark-circle"
        >
          <svg className="checkmark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="success-title"
        >
          Submission Successful
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="success-subtitle"
        >
          Thank you, <span className="highlight-text">{contactName}</span>. We've recorded the details for <span className="highlight-text">{companyName}</span>.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="summary-box"
      >
        <h3 className="summary-title">Summary of Request</h3>
        <ul className="summary-list">
          <li>
            <span className="summary-label">Company Email:</span>
            <span className="summary-value">{email}</span>
          </li>
          {selectedServices.length > 0 && (
            <li>
              <span className="summary-label">Selected Services:</span>
              <span className="summary-value">{selectedServices.join(', ')}</span>
            </li>
          )}
        </ul>
        <div className="email-alert">
          <svg className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-4a2 2 0 011.83 0l8 4A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
          </svg>
          <p className="alert-text">
            A confirmation email detailing these requirements has been dispatched to <strong>{email}</strong>. Please check your inbox (including spam folder).
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="success-actions"
      >
        <button onClick={onReset} className="btn btn-secondary">
          Submit Another Request
        </button>
      </motion.div>
    </div>
  );
}
