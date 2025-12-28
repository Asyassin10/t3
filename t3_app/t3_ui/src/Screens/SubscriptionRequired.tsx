import React, { useEffect, useState } from 'react';
import t3_system_client from '../axios/t3_system_client';
import { CheckCircle, XCircle } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  stripe_price_id: string;
  features: string[];
}

const SubscriptionRequired: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await t3_system_client.get('/subscription/plans');
      setPlans(response.data.plans);
    } catch (err) {
      setError('Failed to load subscription plans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    if (!priceId) {
      setError('This plan is not configured yet. Please contact support.');
      return;
    }

    setSubscribing(true);
    setError(null);

    try {
      const response = await t3_system_client.post('/subscription/checkout', {
        price_id: priceId,
      });

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create checkout session');
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription Required
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your subscription has expired or is not active. Please choose a plan below to continue using our services.
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-xl text-gray-600 ml-2">
                    /{plan.interval}
                  </span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.stripe_price_id)}
                  disabled={subscribing || !plan.stripe_price_id}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                    subscribing || !plan.stripe_price_id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                  }`}
                >
                  {subscribing ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => window.location.href = '/auth/signing'}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRequired;