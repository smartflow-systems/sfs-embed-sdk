/**
 * SFS Embed SDK - Form Widget
 * Embeddable form with lead capture
 */

import { useState } from 'react';
import type { FormWidgetConfig, FormField } from '../types';

interface FormWidgetProps {
  config: FormWidgetConfig;
  workspaceId: string;
  apiKey?: string;
  onClose?: () => void;
}

export function FormWidget({ config, workspaceId, apiKey, onClose }: FormWidgetProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Call custom onSubmit if provided
      if (config.onSubmit) {
        config.onSubmit(formData);
      }

      // Send data to SFS API
      const response = await fetch(
        config.submitUrl || `https://api.sfs.dev/forms/${config.formId}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey && { 'X-SFS-API-Key': apiKey }),
          },
          body: JSON.stringify({
            workspaceId,
            formId: config.formId,
            data: formData,
            meta: {
              url: window.location.href,
              referrer: document.referrer,
              timestamp: new Date().toISOString(),
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSubmitted(true);

      // Emit custom event for parent site
      window.postMessage(
        {
          type: 'sfs_form_submitted',
          formId: config.formId,
          data: formData,
        },
        '*'
      );
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const baseClasses = `
      w-full px-4 py-2.5 rounded-lg border border-gray-300
      focus:ring-2 focus:ring-blue-500 focus:border-transparent
      outline-none transition-all text-sm
    `;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            className={`${baseClasses} min-h-[100px] resize-y`}
            onChange={(e) => handleChange(field.name, e.target.value)}
            value={formData[field.name] || ''}
          />
        );

      case 'select':
        return (
          <select
            name={field.name}
            required={field.required}
            className={baseClasses}
            onChange={(e) => handleChange(field.name, e.target.value)}
            value={formData[field.name] || ''}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={field.name}
              required={field.required}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleChange(field.name, e.target.checked)}
              checked={formData[field.name] || false}
            />
            <span className="text-sm text-gray-700">{field.label}</span>
          </label>
        );

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
            onChange={(e) => handleChange(field.name, e.target.value)}
            value={formData[field.name] || ''}
          />
        );
    }
  };

  if (isSubmitted) {
    return (
      <div className="sfs-widget-card p-6 max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
          <p className="text-gray-600 mb-4">
            Your submission has been received.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="sfs-widget-card p-6 max-w-md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">{config.title || 'Get in Touch'}</h3>
          {config.description && (
            <p className="text-sm text-gray-600 mt-1">{config.description}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {config.fields?.map((field) => (
          <div key={field.name}>
            {field.type !== 'checkbox' && (
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {renderField(field)}
          </div>
        ))}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        <p className="text-xs text-center text-gray-500">
          Powered by <span className="font-semibold">SFS</span>
        </p>
      </form>
    </div>
  );
}
