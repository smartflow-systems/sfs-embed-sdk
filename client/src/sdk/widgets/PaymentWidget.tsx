/**
 * SFS Embed SDK - Payment Widget
 * Stripe-powered payment collection with beautiful UI
 */

import { useState } from 'react';

export interface PaymentWidgetConfig {
  paymentId: string;
  amount: number;
  currency?: string;
  title?: string;
  description?: string;
  stripePublicKey?: string;
  collectBilling?: boolean;
  allowCustomAmount?: boolean;
  successUrl?: string;
  cancelUrl?: string;
}

interface PaymentWidgetProps {
  config: PaymentWidgetConfig;
  workspaceId: string;
  apiKey?: string;
  onClose?: () => void;
}

export function PaymentWidget({ config, workspaceId, apiKey, onClose }: PaymentWidgetProps) {
  const [amount, setAmount] = useState(config.amount);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatAmount = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: config.currency || 'USD',
    }).format(value / 100); // Stripe uses cents
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiry = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + (cleaned.length > 2 ? '/' + cleaned.slice(2, 4) : '');
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value.replace(/\s/g, ''));
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.length <= 5) {
      setExpiry(formatted);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvc(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // In production, use Stripe.js to create a token
      // This is a simplified example
      const response = await fetch(`https://api.sfs.dev/payments/charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { 'X-SFS-API-Key': apiKey }),
        },
        body: JSON.stringify({
          workspaceId,
          paymentId: config.paymentId,
          amount,
          currency: config.currency || 'USD',
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiry,
          cvc,
          name,
          email,
          metadata: {
            url: window.location.href,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();

      setIsPaid(true);

      // Emit event
      window.postMessage(
        {
          type: 'sfs_payment_success',
          paymentId: config.paymentId,
          amount,
          transactionId: data.transactionId,
        },
        '*'
      );

      // Redirect if success URL provided
      if (config.successUrl) {
        setTimeout(() => {
          window.location.href = config.successUrl!;
        }, 2000);
      }
    } catch (err) {
      setError('Payment failed. Please check your card details and try again.');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPaid) {
    return (
      <div className="sfs-widget-card p-8 max-w-md">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-once">
            <svg
              className="w-10 h-10 text-green-600"
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
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">
            Thank you for your payment of {formatAmount(amount)}.
          </p>
          <p className="text-sm text-gray-500">
            You will receive a confirmation email shortly.
          </p>
          {config.successUrl && (
            <p className="text-xs text-gray-400 mt-4">Redirecting...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="sfs-widget-card p-6 max-w-md">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">
            {config.title || 'Complete Payment'}
          </h2>
          {config.description && (
            <p className="text-sm text-gray-600">{config.description}</p>
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

      {/* Amount Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-6">
        <p className="text-sm text-gray-600 mb-1">Amount to pay</p>
        {config.allowCustomAmount ? (
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-blue-900">$</span>
            <input
              type="number"
              value={amount / 100}
              onChange={(e) => setAmount(Math.floor(parseFloat(e.target.value || '0') * 100))}
              className="text-3xl font-bold text-blue-900 bg-transparent border-b-2 border-blue-300 focus:border-blue-600 outline-none w-32"
              min="1"
              step="0.01"
            />
          </div>
        ) : (
          <p className="text-4xl font-bold text-blue-900">{formatAmount(amount)}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg tracking-wider"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <svg className="w-8 h-6" viewBox="0 0 32 20" fill="none">
                <rect width="32" height="20" rx="3" fill="#1434CB"/>
                <circle cx="12" cy="10" r="6" fill="#EB001B"/>
                <circle cx="20" cy="10" r="6" fill="#F79E1B"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Expiry & CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={handleCvcChange}
              placeholder="123"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Cardholder Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Pay {formatAmount(amount)}
            </>
          )}
        </button>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secured by Stripe • PCI DSS Compliant</span>
        </div>

        <p className="text-xs text-center text-gray-500">
          Powered by <span className="font-semibold">SFS</span>
        </p>
      </form>

      <style>{`
        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
