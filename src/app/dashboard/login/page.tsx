"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SoftAurora from '@/components/SoftAurora';

export default function DashboardLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/dashboard/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.refresh();
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login request error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-viewport-container">
      {/* Background SoftAurora */}
      <SoftAurora
        speed={0.5}
        scale={1.4}
        brightness={0.8}
        color1="#3b82f6"
        color2="#a855f7"
        noiseFrequency={2.5}
        noiseAmplitude={1.0}
        bandHeight={0.5}
        bandSpread={1.0}
        octaveDecay={0.1}
        layerOffset={0.0}
        colorSpeed={1.0}
        enableMouseInteraction={true}
        mouseInfluence={0.2}
      />

      <div className="login-page-wrapper">
        <div className="glass-panel login-card">
          <div className="login-card-header">
            <div className="login-logo">
              <span className="login-logo-box" />
              <h2 className="login-logo-text">ADEMXO</h2>
            </div>
            <h1 className="login-title">Analytics Dashboard</h1>
            <p className="login-subtitle">Secure administrative access</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-field-container">
              <label htmlFor="dashboard-password" className="form-label">
                Access Token / Password
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  id="dashboard-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security token"
                  required
                  disabled={isLoading}
                  className={`form-input ${error ? 'has-error' : ''}`}
                />
                <div className="focus-glow-border" />
              </div>
            </div>

            {error && (
              <div className="login-error-alert" role="alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary login-btn"
            >
              {isLoading ? 'Verifying Credentials...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
