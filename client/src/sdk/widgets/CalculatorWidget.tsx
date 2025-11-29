/**
 * SFS Embed SDK - Calculator Widget
 * Custom formulas with dynamic inputs
 */

import { useState, useEffect } from 'react';
import type { CalculatorWidgetConfig, CalculatorInput } from '../types';

interface CalculatorWidgetProps {
  config: CalculatorWidgetConfig;
  workspaceId: string;
  onClose?: () => void;
}

export function CalculatorWidget({ config, workspaceId, onClose }: CalculatorWidgetProps) {
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize inputs with default values
  useEffect(() => {
    const initialInputs: Record<string, number> = {};
    config.inputs.forEach((input) => {
      initialInputs[input.name] = input.default || 0;
    });
    setInputs(initialInputs);
  }, [config.inputs]);

  // Calculate result whenever inputs change
  useEffect(() => {
    if (Object.keys(inputs).length > 0) {
      calculateResult();
    }
  }, [inputs]);

  const calculateResult = () => {
    try {
      setError(null);

      // Create a safe evaluation context
      const context = { ...inputs, Math };

      // Replace variable names in formula with their values
      let formula = config.formula;
      Object.entries(inputs).forEach(([key, value]) => {
        formula = formula.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
      });

      // Evaluate the formula
      // NOTE: In production, you should use a safer formula parser
      // like mathjs or create a custom parser
      const calculated = Function(`"use strict"; return (${formula})`)();

      setResult(calculated);

      // Emit event for parent site
      window.postMessage(
        {
          type: 'sfs_calculator_result',
          calculatorId: config.calculatorId,
          inputs,
          result: calculated,
        },
        '*'
      );
    } catch (err) {
      setError('Invalid calculation. Please check your inputs.');
      console.error('Calculator error:', err);
    }
  };

  const handleInputChange = (name: string, value: number) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleCTA = () => {
    if (config.ctaUrl) {
      // Append calculator data to URL
      const url = new URL(config.ctaUrl);
      Object.entries(inputs).forEach(([key, value]) => {
        url.searchParams.set(key, value.toString());
      });
      if (result !== null) {
        url.searchParams.set('result', result.toString());
      }
      window.open(url.toString(), '_blank');
    }
  };

  const renderInput = (input: CalculatorInput) => {
    const value = inputs[input.name] || 0;

    if (input.type === 'slider') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {input.label}
            </label>
            <span className="text-sm font-semibold text-blue-600">
              {input.prefix}
              {formatNumber(value)}
              {input.suffix}
            </span>
          </div>
          <input
            type="range"
            min={input.min || 0}
            max={input.max || 100}
            step={input.step || 1}
            value={value}
            onChange={(e) =>
              handleInputChange(input.name, parseFloat(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {input.prefix}
              {formatNumber(input.min || 0)}
              {input.suffix}
            </span>
            <span>
              {input.prefix}
              {formatNumber(input.max || 100)}
              {input.suffix}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {input.label}
        </label>
        <div className="relative">
          {input.prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {input.prefix}
            </span>
          )}
          <input
            type="number"
            min={input.min}
            max={input.max}
            step={input.step || 1}
            value={value}
            onChange={(e) =>
              handleInputChange(input.name, parseFloat(e.target.value) || 0)
            }
            className={`
              w-full px-4 py-2.5 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              outline-none transition-all text-sm
              ${input.prefix ? 'pl-8' : ''}
              ${input.suffix ? 'pr-12' : ''}
            `}
          />
          {input.suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {input.suffix}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="sfs-widget-card p-6 max-w-lg">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-xl font-semibold">{config.title}</h3>
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

      <div className="space-y-6">
        {/* Inputs */}
        <div className="space-y-4">
          {config.inputs.map((input) => (
            <div key={input.name}>{renderInput(input)}</div>
          ))}
        </div>

        {/* Result */}
        {result !== null && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <p className="text-sm text-blue-700 font-medium mb-2">
              Estimated Result
            </p>
            <p className="text-4xl font-bold text-blue-900">
              {formatCurrency(result)}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* CTA Button */}
        {config.ctaText && config.ctaUrl && result !== null && (
          <button
            onClick={handleCTA}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {config.ctaText}
          </button>
        )}

        {/* Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Formula:</strong> {config.formula}
          </p>
        </div>

        <p className="text-xs text-center text-gray-500">
          Powered by <span className="font-semibold">SFS</span>
        </p>
      </div>
    </div>
  );
}
