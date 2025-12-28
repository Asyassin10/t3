import React, { useEffect, useState } from 'react';
import api_client from '../axios/api_client';
import { XCircle } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await api_client.get('/subscription/plans');
      setPlans(response.data.plans);
    } catch (err) {
      setError('Échec du chargement des plans d\'abonnement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const handleManageSubscription = () => {
    window.location.href = 'http://localhost:8234';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-900">Chargement des plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Abonnement Requis
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Votre abonnement a expiré ou n'est pas actif. Veuillez choisir un plan ci-dessous pour continuer à utiliser nos services.
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-50 border border-red-300 rounded-lg p-4">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white border-2 border-gray-300 rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
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


              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <button
            onClick={handleManageSubscription}
            className="block mx-auto px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Gérer mon abonnement
          </button>

          <button
            onClick={() => window.location.href = '/auth/signing'}
            className="text-gray-900 hover:text-gray-700 font-medium"
          >
            ← Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRequired;