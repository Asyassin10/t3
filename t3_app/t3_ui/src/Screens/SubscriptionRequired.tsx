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
      setError('Échec du chargement des plans d\'abonnement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    if (!priceId) {
      setError('Ce plan n\'est pas encore configuré. Veuillez contacter le support.');
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
      setError(err.response?.data?.message || 'Échec de la création de la session de paiement');
      setSubscribing(false);
    }
  };

  const handleManageSubscription = () => {
    window.location.href = 'http://localhost:8234';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Chargement des plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900 rounded-full mb-4">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Abonnement Requis
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Votre abonnement a expiré ou n'est pas actif. Veuillez choisir un plan ci-dessous pour continuer à utiliser nos services.
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-900 border border-red-700 rounded-lg p-4">
            <p className="text-red-200 text-center">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-xl text-gray-400 ml-2">
                    /{plan.interval}
                  </span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.stripe_price_id)}
                  disabled={subscribing || !plan.stripe_price_id}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                    subscribing || !plan.stripe_price_id
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                  }`}
                >
                  {subscribing ? 'Traitement en cours...' : 'Souscrire maintenant'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <button
            onClick={handleManageSubscription}
            className="block mx-auto px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Gérer mon abonnement
          </button>

          <button
            onClick={() => window.location.href = '/auth/signing'}
            className="text-white hover:text-gray-300 font-medium"
          >
            ← Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRequired;
