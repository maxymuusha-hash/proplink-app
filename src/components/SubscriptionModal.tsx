import React, { useState, useEffect } from 'react';
import { X, Check, Clock, Crown, AlertCircle, Loader2, Home, Briefcase, Building2 } from 'lucide-react';
import { SEEKER_TIERS, OWNER_TIERS, SubscriptionTier } from '@/types/property';
import { supabase } from '@/lib/supabase';
import PaymentModal from './PaymentModal';

interface SubscriptionModalProps {
  onClose: () => void;
  onSubscribe: (tier: SubscriptionTier, subscription: any) => void;
  currentSubscription: string | null;
  userId: string;
  userEmail: string;
  userType?: 'owner' | 'seeker' | null;
}

interface ActiveSubscription {
  id: string;
  subscription_type: string;
  status: string;
  expires_at: string;
  receipt_number: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ 
  onClose, 
  onSubscribe,
  currentSubscription,
  userId,
  userEmail,
  userType
}) => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tiers = userType === 'owner' ? OWNER_TIERS : SEEKER_TIERS;

  useEffect(() => {
    fetchActiveSubscriptions();
  }, [userId]);

  const fetchActiveSubscriptions = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'paid');
      if (!error && data) {
        setActiveSubscriptions(data);
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionStatus = (tierAccessType: string) => {
    const sub = activeSubscriptions.find(
      s => s.subscription_type === tierAccessType && s.status === 'paid'
    );
    if (sub) {
      const expiresAt = new Date(sub.expires_at);
      const now = new Date();
      const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isExpired = daysLeft <= 0;
      return {
        active: !isExpired,
        expired: isExpired,
        daysLeft: Math.max(0, daysLeft),
        expiresAt: sub.expires_at
      };
    }
    return { active: false, expired: false, daysLeft: 0, expiresAt: null };
  };

  const handleSelectTier = (tier: SubscriptionTier) => {
    const status = getSubscriptionStatus(tier.accessType);
    if (status.active) return;
    setSelectedTier(tier);
  };

  const handleProceedToPayment = () => {
    if (selectedTier) {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = (subscription: any) => {
    setShowPaymentModal(false);
    if (selectedTier) {
      onSubscribe(selectedTier, subscription);
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'residential_rental': return <Home className="w-6 h-6 text-blue-500" />;
      case 'commercial_rental': return <Briefcase className="w-6 h-6 text-orange-500" />;
      case 'seller_residential': return <Home className="w-6 h-6 text-green-500" />;
      case 'seller_commercial': return <Building2 className="w-6 h-6 text-purple-500" />;
      default: return <Crown className="w-6 h-6 text-amber-500" />;
    }
  };

  const getHeaderText = () => {
    if (userType === 'owner') {
      return {
        title: 'List Your Property',
        subtitle: 'Choose a listing plan to connect with seekers'
      };
    }
    return {
      title: 'Choose Your Plan',
      subtitle: 'Subscribe to access property owner contact details'
    };
  };

  const { title, subtitle } = getHeaderText();

  // Get active (non-expired) subscriptions for the banner
  const validSubscriptions = activeSubscriptions.filter(s => {
    const expiresAt = new Date(s.expires_at);
    const now = new Date();
    return expiresAt > now;
  });

  // Get expired subscriptions
  const expiredSubscriptions = activeSubscriptions.filter(s => {
    const expiresAt = new Date(s.expires_at);
    const now = new Date();
    return expiresAt <= now;
  });

  if (showPaymentModal && selectedTier) {
    return (
      <PaymentModal
        tier={selectedTier}
        userId={userId}
        userEmail={userEmail}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-1">{subtitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Active subscriptions banner */}
        {validSubscriptions.length > 0 && (
          <div className="mx-6 mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-800">Active Subscriptions</p>
                <div className="mt-2 space-y-1">
                  {validSubscriptions.map(sub => {
                    const status = getSubscriptionStatus(sub.subscription_type);
                    return (
                      <p key={sub.id} className="text-sm text-emerald-700">
                        {sub.subscription_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} — {status.daysLeft} days remaining
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expired subscriptions banner */}
        {expiredSubscriptions.length > 0 && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Expired Subscriptions</p>
                <div className="mt-2 space-y-1">
                  {expiredSubscriptions.map(sub => (
                    <p key={sub.id} className="text-sm text-red-700">
                      {sub.subscription_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} — Expired. Please renew below.
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${tiers.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' : 'md:grid-cols-3'} gap-6`}>
              {tiers.map((tier) => {
                const status = getSubscriptionStatus(tier.accessType);
                const isSelected = selectedTier?.id === tier.id;

                return (
                  <div
                    key={tier.id}
                    onClick={() => handleSelectTier(tier)}
                    className={`relative rounded-2xl border-2 p-6 transition-all ${
                      status.active
                        ? 'border-emerald-500 bg-emerald-50 cursor-default'
                        : status.expired
                          ? 'border-red-300 bg-red-50 cursor-pointer hover:border-red-400'
                          : isSelected
                            ? 'border-cyan-500 bg-cyan-50 shadow-lg cursor-pointer'
                            : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                    }`}
                  >
                    {status.active && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Active
                      </span>
                    )}
                    {status.expired && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Expired — Renew
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      {getTierIcon(tier.id)}
                      <h3 className="text-xl font-bold text-gray-800">{tier.name}</h3>
                    </div>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-cyan-600">${tier.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                    <ul className="space-y-3">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {status.active && (
                      <div className="mt-4 pt-4 border-t border-emerald-200">
                        <div className="flex items-center gap-2 text-sm text-emerald-700">
                          <Clock className="w-4 h-4" />
                          <span>{status.daysLeft} days remaining</span>
                        </div>
                      </div>
                    )}
                    {status.expired && (
                      <div className="mt-4 pt-4 border-t border-red-200">
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span>Subscription expired — click to renew</span>
                        </div>
                      </div>
                    )}
                    {isSelected && !status.active && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-gray-500 mt-6">
            <Clock className="w-5 h-5" />
            <span>All subscriptions are valid for 30 days from activation</span>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Payment Information</p>
                <p className="mt-1">
                  Payments are processed securely via Paynow Zimbabwe. You can pay using EcoCash, OneMoney,
                  InnBucks, or bank card. All transaction fees are included in the price.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleProceedToPayment}
              disabled={!selectedTier || getSubscriptionStatus(selectedTier?.accessType || '').active}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedTier && getSubscriptionStatus(selectedTier.accessType).active
                ? 'Already Subscribed'
                : selectedTier
                  ? `Continue to Payment - $${selectedTier.price}`
                  : 'Select a Plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
