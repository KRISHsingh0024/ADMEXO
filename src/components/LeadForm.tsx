"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormField from './FormField';
import ServiceCard from './ServiceCard';
import SuccessScreen from './SuccessScreen';

// Types for form state
interface FormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  companySize: string;
  budget: string;
  services: string[];
  description: string;
}

const initialFormData: FormData = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  industry: '',
  companySize: '',
  budget: '',
  services: [],
  description: ''
};

// Available services definition
const servicesList = [
  { id: 'Performance Marketing', title: 'Performance Marketing', desc: 'Paid ads, conversion rate optimization, ROI-driven growth campaigns.', icon: 'marketing' as const },
  { id: 'Search Engine Optimization', title: 'SEO Optimization', desc: 'Organic search visibility, technical SEO audits, content mapping.', icon: 'seo' as const },
  { id: 'Social Media Management', title: 'Social Media Growth', desc: 'Brand presence, creative visual production, community leadership.', icon: 'social' as const },
  { id: 'Web Development', title: 'NextJS / Web Design', desc: 'High-performance headless applications and marketing sites.', icon: 'web' as const },
  { id: 'Marketing Automation', title: 'Intelligent Automation', desc: 'CRM onboarding, email sequence pipelines, and lead scoring.', icon: 'automation' as const },
  { id: 'AI/ML Solutions', title: 'Cognitive AI Integration', desc: 'Conversational agents, custom LLM solutions, workflow optimization.', icon: 'ai' as const }
];

export default function LeadForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  // Handle standard input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Toggle service selection
  const handleToggleService = (serviceId: string) => {
    setFormData(prev => {
      const selected = prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId];
      
      // Clear services validation error if any
      if (errors.services) {
        setErrors(err => ({ ...err, services: undefined }));
      }
      
      return { ...prev, services: selected };
    });
  };

  // Step field validations
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (formData.phone.replace(/\D/g, '').length < 8) {
        newErrors.phone = 'Please enter a valid phone number';
      }

      if (formData.website.trim() && !formData.website.startsWith('http://') && !formData.website.startsWith('https://')) {
        newErrors.website = 'Website should start with http:// or https://';
      }
    }

    if (step === 2) {
      if (!formData.industry) newErrors.industry = 'Please select your industry';
      if (!formData.companySize) newErrors.companySize = 'Please select company size';
      if (!formData.budget) newErrors.budget = 'Please select a budget range';
    }

    if (step === 3) {
      if (formData.services.length === 0) {
        newErrors.services = 'Please select at least one service';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Please describe your project requirements';
      } else if (formData.description.trim().length < 20) {
        newErrors.description = 'Please provide a more detailed description (min 20 characters)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle final form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setApiErrorMessage('');

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setApiErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setApiErrorMessage('Network error occurred. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitStatus('idle');
    setCurrentStep(1);
    setApiErrorMessage('');
  };

  // Slider animation options
  const slideVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' as const }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeIn' as const }
    })
  };

  // Determine pagination direction parameter
  const [dir, setDir] = useState(1);
  const triggerNext = () => {
    setDir(1);
    handleNext();
  };
  const triggerPrev = () => {
    setDir(-1);
    handlePrev();
  };

  if (submitStatus === 'success') {
    return (
      <SuccessScreen
        companyName={formData.companyName}
        contactName={formData.contactName}
        email={formData.email}
        selectedServices={formData.services}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="lead-form-wrapper glass-panel">
      {/* Progress header */}
      <div className="form-progress-bar-container">
        <div className="progress-steps-label">
          <span>Step {currentStep} of 3</span>
          <span className="step-percentage">{Math.round((currentStep / 3) * 100)}% Complete</span>
        </div>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="lead-form-element">
        <AnimatePresence custom={dir} mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={dir}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="form-step-slide"
            >
              <div className="step-intro">
                <span className="step-tag">Phase 01</span>
                <h3 className="step-title">Company Info</h3>
                <p className="step-desc">Help us understand who we'll be collaborating with.</p>
              </div>

              <FormField label="Company Name" id="companyName" error={errors.companyName} required>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`form-input ${errors.companyName ? 'has-error' : ''}`}
                  placeholder="e.g. Acme Corporation"
                />
              </FormField>

              <FormField label="Contact Person Name" id="contactName" error={errors.contactName} required>
                <input
                  type="text"
                  name="contactName"
                  id="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className={`form-input ${errors.contactName ? 'has-error' : ''}`}
                  placeholder="e.g. John Doe"
                />
              </FormField>

              <div className="form-fields-row">
                <FormField label="Work Email Address" id="email" error={errors.email} required>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'has-error' : ''}`}
                    placeholder="e.g. john@acme.com"
                  />
                </FormField>

                <FormField label="Phone Number" id="phone" error={errors.phone} required>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'has-error' : ''}`}
                    placeholder="e.g. +1 (555) 019-2834"
                  />
                </FormField>
              </div>

              <FormField label="Company Website" id="website" error={errors.website}>
                <input
                  type="url"
                  name="website"
                  id="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={`form-input ${errors.website ? 'has-error' : ''}`}
                  placeholder="e.g. https://www.acme.com"
                />
              </FormField>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              custom={dir}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="form-step-slide"
            >
              <div className="step-intro">
                <span className="step-tag">Phase 02</span>
                <h3 className="step-title">Scale & Scope</h3>
                <p className="step-desc">Provide context on your industry presence and budget scale.</p>
              </div>

              <FormField label="Industry / Sector" id="industry" error={errors.industry} required>
                <select
                  name="industry"
                  id="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={`form-select ${errors.industry ? 'has-error' : ''}`}
                >
                  <option value="">Select Industry...</option>
                  <option value="Technology & Software">Technology & Software</option>
                  <option value="E-commerce & Retail">E-commerce & Retail</option>
                  <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Real Estate & Construction">Real Estate & Construction</option>
                  <option value="Professional Services">Professional & B2B Services</option>
                  <option value="Education & Non-Profit">Education & Non-Profit</option>
                  <option value="Other">Other</option>
                </select>
              </FormField>

              <FormField label="Company Size" id="companySize" error={errors.companySize} required>
                <select
                  name="companySize"
                  id="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className={`form-select ${errors.companySize ? 'has-error' : ''}`}
                >
                  <option value="">Select Employees Count...</option>
                  <option value="1-10">1 - 10 Employees</option>
                  <option value="11-50">11 - 50 Employees</option>
                  <option value="51-200">51 - 200 Employees</option>
                  <option value="201-500">201 - 500 Employees</option>
                  <option value="500+">500+ Employees</option>
                </select>
              </FormField>

              <FormField label="Target Monthly Digital Budget" id="budget" error={errors.budget} required>
                <select
                  name="budget"
                  id="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className={`form-select ${errors.budget ? 'has-error' : ''}`}
                >
                  <option value="">Select Budget Range...</option>
                  <option value="Under $2,500">Under $2,500 / mo</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000 / mo</option>
                  <option value="$5,000 - $15,000">$5,000 - $15,000 / mo</option>
                  <option value="$15,000 - $50,000">$15,000 - $50,000 / mo</option>
                  <option value="$50,000+">$50,000+ / mo</option>
                </select>
              </FormField>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              custom={dir}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="form-step-slide"
            >
              <div className="step-intro">
                <span className="step-tag">Phase 03</span>
                <h3 className="step-title">Requirements Brief</h3>
                <p className="step-desc">Pick marketing and automation layers you wish to engineer.</p>
              </div>

              <div className="services-selection-section">
                <label className="form-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
                  Services of Interest <span className="required-asterisk">*</span>
                </label>
                <div className="services-grid">
                  {servicesList.map(s => (
                    <ServiceCard
                      key={s.id}
                      id={s.id}
                      title={s.title}
                      description={s.desc}
                      selected={formData.services.includes(s.id)}
                      onToggle={handleToggleService}
                      icon={s.icon}
                    />
                  ))}
                </div>
                {errors.services && (
                  <p className="field-error-message" style={{ marginTop: '0.5rem' }}>
                    {errors.services}
                  </p>
                )}
              </div>

              <FormField label="Describe your specific target goals / timelines" id="description" error={errors.description} required>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`form-textarea ${errors.description ? 'has-error' : ''}`}
                  placeholder="e.g. We are looking to scale our lead flow by 50% over the next quarter using search campaigns and build an integration mapping email conversions to Salesforce..."
                />
              </FormField>

              {submitStatus === 'error' && (
                <div className="form-api-error-alert" role="alert">
                  <svg className="api-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{apiErrorMessage}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="form-navigation-actions">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={triggerPrev}
              disabled={isSubmitting}
              className="btn btn-secondary nav-btn-back"
            >
              Back
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={triggerNext}
              className="btn btn-primary nav-btn-next"
              style={{ marginLeft: 'auto' }}
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary nav-btn-submit"
              style={{ marginLeft: 'auto' }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Engineering Pipeline...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
