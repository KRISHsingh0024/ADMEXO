"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToForm = () => {
    const formElement = document.getElementById('lead-generation-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-grid-overlay" />
      <div className="hero-glow-1 pulsing-glow" style={{ top: '10%', left: '15%', width: '350px', height: '350px', backgroundColor: 'rgba(59, 130, 246, 0.12)' }} />
      <div className="hero-glow-2 pulsing-glow" style={{ bottom: '20%', right: '10%', width: '400px', height: '400px', backgroundColor: 'rgba(168, 85, 247, 0.1)' }} />

      <div className="hero-container">
        {/* Logo/Branding Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="brand-logo-container"
        >
          <div className="logo-icon-mesh">
            <span className="logo-accent-dot" />
          </div>
          <span className="brand-name">ADEMXO</span>
        </motion.div>

        {/* Slogan & Headlines */}
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="hero-tagline-badge"
          >
            <span className="badge-glow" />
            <span className="badge-text">Intelligent Lead Capture System</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-main-title"
          >
            Engineering Scalable Growth Through <br />
            <span className="gradient-text-accent">Performance Marketing</span> &amp; <br />
            <span className="gradient-text">Intelligent Automation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-lead-description"
          >
            Scale your company's acquisition pipelines. Fill out your details below to activate ADEMXO's automated campaign assessment and receive a structured business growth prospectus direct to your inbox.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-actions-container"
          >
            <button onClick={scrollToForm} className="btn btn-primary hero-cta-btn">
              Get Started
              <svg className="cta-arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </motion.div>

          {/* Dynamic Specs grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hero-specs-row"
          >
            <div className="spec-item">
              <span className="spec-num">2.8x</span>
              <span className="spec-label">Avg. ROI Uplift</span>
            </div>
            <div className="spec-divider" />
            <div className="spec-item">
              <span className="spec-num">&lt; 3 mins</span>
              <span className="spec-label">Setup & Deployment</span>
            </div>
            <div className="spec-divider" />
            <div className="spec-item">
              <span className="spec-num">100%</span>
              <span className="spec-label">Automated Handshakes</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
