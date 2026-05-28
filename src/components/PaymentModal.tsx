import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Shield, Check, AlertCircle, Loader2, Receipt, Download } from 'lucide-react';
import { SUBSCRIPTION_TIERS, SubscriptionTier } from '@/types/property';

const PAYNOW_SERVER = 'https://paynow-integration.onrender.com';

interface PaymentModalProps {
  tier: SubscriptionTier;
  userId: string;
  userEmail: string;
  onClose: () => void;
  onSuccess: (subscription: any) => void;
}

type PaymentMethod = 'ecocash' | 'onemoney' | 'innbucks' | 'web';

interface PaymentState {
  step: 'method' | 'phone' | 'processing' | 'success' | 'error';
  method: PaymentMethod | null;
  phoneNumber: string;
  error: string | null;
  pollUrl: string | null;
  reference: string | null;
  receiptNumber: string | null;
  instructions: string | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  tier,
  userId,
  userEmail,
  onClose,
  onSuccess
}) => {
  const [state, setState] = useState<PaymentState>({
    step: 'method',
    method: null,
    phoneNumber: '',
    error: null,
    pollUrl: null,
    reference: null,
    receiptNumber: null,
    instructions: null,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { id: 'ecocash' as PaymentMethod, name: 'EcoCash', icon: '📱', color: 'bg-green-500' },
    { id: 'onemoney' as PaymentMethod, name: 'OneMoney', icon: '💳', color: 'bg-purple-500' },
    { id: 'innbucks' as PaymentMethod, name: 'InnBucks', icon: '🏦', color: 'bg-blue-500' },
    { id: 'web' as PaymentMethod, name: 'Card/Bank', icon: '💻', color: 'bg-gray-700' }
  ];

  const selectMethod = (method: PaymentMethod) => {
    setState(prev => ({ ...prev, method }));
    if (method === 'web') {
      initiatePayment(method);
    } else {
      setState(prev => ({ ...prev, step: 'phone' }));
    }
  };

  const initiatePayment = async (method: PaymentMethod, phone?: string) => {
    setState(prev => ({ ...prev, step: 'processing', error: null }));
    setIsProcessing(true);
    const resolvedPhone = phone || state.phoneNumber;
    if (!resolvedPhone || !userEmail || !userId) {
      setState(prev => ({ ...prev, step: 'error', error: 'Missing phone number or account details.' }));
      setIsProcessing(false);
      return;
    }

    try {
      const reference = `REF-${userId.slice(0, 8)}-${Date.now()}`;

      const response = await fetch(`${PAYNOW_SERVER}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          email: userEmail,
          phone: resolvedPhone,
          method: method === 'web' ? 'ecocash' : method,
          items: [{ name: tier.name, amount: tier.price }]
        })
      });

      const data = await response.json();

      if (data.success) {
        setState(prev => ({
          ...prev,
          pollUrl: data.pollUrl,
          reference,
          instructions: data.instructions || null,
        }));

        // Start polling for payment status
        pollPaymentStatus(data.pollUrl, reference);
      } else {
        throw new Error(data.error || 'Payment initiation failed');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setState(prev => ({
        ...prev,
        step: 'error',
        error: err.message || 'Failed to initiate payment'
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (pollUrl: string, reference: string) => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals

    const checkStatus = async () => {
      try {
        const response = await fetch(`${PAYNOW_SERVER}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pollUrl })
        });

        const data = await response.json();

        if (data.paid) {
          const receiptNumber = `REC-${Date.now()}`;
          setState(prev => ({
            ...prev,
            step: 'success',
            receiptNumber
          }));
          onSuccess({ reference, receiptNumber, tier });
          return;
        } else if (data.status === 'Failed' || data.status === 'Cancelled') {
          setState(prev => ({
            ...prev,
            step: 'error',
            error: `Payment ${data.status}. Please try again.`
          }));
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000);
        } else {
          setState(prev => ({
            ...prev,
            step: 'error',
            error: 'Payment timeout. Please check your payment status and try again.'
          }));
        }
      } catch (err) {
        console.error('Status check error:', err);
      }
    };

    checkStatus();
  };

  const generateReceipt = () => {
    const receiptContent = `
PROPLINK SUBSCRIPTION RECEIPT
=============================
Receipt #: ${state.receiptNumber}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

SUBSCRIPTION DETAILS
--------------------
Plan: ${tier.name}
Amount: $${tier.price} USD
Duration: 30 days
Reference: ${state.reference}

CUSTOMER
--------
Email: ${userEmail}

Thank you for subscribing to PropLink!
Your subscription is now active.

For support: info@proplink.co.zw
=============================
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PropLink-Receipt-${state.receiptNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Complete Payment</h2>
              <p className="text-cyan-100 text-sm mt-1">{tier.name} - ${tier.price}/month</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Method Selection */}
          {state.step === 'method' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => selectMethod(method.id)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:bg-cyan-50 transition-all text-center"
                  >
                    <span className="text-2xl mb-2 block">{method.icon}</span>
                    <span className="font-medium text-gray-800">{method.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secured by Paynow Zimbabwe</span>
                </div>
              </div>
            </div>
          )}

          {/* Phone Number Input */}
          {state.step === 'phone' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Enter Phone Number</h3>
              <p className="text-gray-600 text-sm mb-4">
                Enter your {state.method === 'ecocash' ? 'EcoCash' : state.method === 'onemoney' ? 'OneMoney' : 'InnBucks'} registered phone number
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={state.phoneNumber}
                    onChange={(e) => setState(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="0771234567"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setState(prev => ({ ...prev, step: 'method', method: null }))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => initiatePayment(state.method!, state.phoneNumber)}
                  disabled={!state.phoneNumber || state.phoneNumber.length < 10}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50"
                >
                  Pay ${tier.price}
                </button>
              </div>
            </div>
          )}

          {/* Processing */}
          {state.step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 text-cyan-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {isProcessing ? 'Processing Payment...' : 'Waiting for Payment'}
              </h3>
              {state.instructions && (
                <div className="mt-4 p-4 bg-green-50 rounded-xl text-left">
                  <p className="text-sm font-medium text-green-800 mb-1">Payment Instructions:</p>
                  <p className="text-sm text-green-700">{state.instructions}</p>
                </div>
              )}
              {state.reference && (
                <p className="text-gray-500 text-sm mt-3">Reference: {state.reference}</p>
              )}
            </div>
          )}

          {/* Success */}
          {state.step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your {tier.name} subscription is now active for 30 days.
              </p>

              {state.receiptNumber && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-800">Receipt Details</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Receipt #:</strong> {state.receiptNumber}</p>
                    <p><strong>Amount:</strong> ${tier.price} USD</p>
                    <p><strong>Plan:</strong> {tier.name}</p>
                    <p><strong>Valid Until:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={generateReceipt}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {state.step === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Failed</h3>
              <p className="text-gray-600 text-sm mb-6">{state.error}</p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setState(prev => ({ ...prev, step: 'method', error: null }))}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
