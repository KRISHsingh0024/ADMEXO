import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-line" />
      <div className="footer-content">
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} <strong>ADEMXO</strong>. All rights reserved.
        </p>
        <p className="footer-tagline">
          Engineering Scalable Growth Through Performance Marketing &amp; Intelligent Automation.
        </p>
      </div>
    </footer>
  );
}
