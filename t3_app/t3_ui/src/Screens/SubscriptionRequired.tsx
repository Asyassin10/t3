import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api_client from '../axios/api_client';
import { XCircle, Ban, CheckCircle } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  stripe_price_id: string;
  features: string[];
}

interface SubscriptionStatus {
  paye: boolean;
  is_active: boolean;
  message: string;
}

const SubscriptionRequired: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      // Check subscription status
      const statusResponse = await api_client.get('/subscription/status');
      const statusData: SubscriptionStatus = statusResponse.data;

      setStatus(statusData);

      // If both paye and is_active are true, redirect to dashboard
      if (statusData.paye && statusData.is_active) {
        navigate('/dashboard');
        return;
      }

      // If we need to show subscription plans (not paid), load them
      if (!statusData.paye && statusData.is_active) {
        const plansResponse = await api_client.get('/subscription/plans');
        setPlans(plansResponse.data.plans || []);
      }
    } catch (err) {
      console.error('Error checking subscription status:', err);
      setError('Erreur lors de la vérification du statut');
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
          <p className="mt-4 text-gray-900">Vérification du statut...</p>
        </div>
      </div>
    );
  }

  // Account Deactivated Page (is_active = false)
  if (status && !status.is_active) {
    return (
      <div className="min-h-screen bg-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-6">
              <Ban className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Compte Désactivé
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Votre compte a été désactivé par l'administrateur. Vous ne pouvez plus accéder aux services.
            </p>

            <div className="bg-white border-2 border-red-200 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Que faire maintenant ?
              </h2>
              <ul className="text-left space-y-4 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Contactez l'administrateur pour comprendre la raison de la désactivation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Vérifiez que vos paiements sont à jour</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Demandez la réactivation de votre compte si nécessaire</span>
                </li>
              </ul>
            </div>

            {error && (
              <div className="max-w-3xl mx-auto mb-8 bg-red-100 border border-red-300 rounded-lg p-4">
                <p className="text-red-800 text-center">{error}</p>
              </div>
            )}

            <div className="text-center mt-8 space-y-4">
              <button
                onClick={() => window.location.href = '/auth/signing'}
                className="text-gray-900 hover:text-gray-700 font-medium"
              >
                ← Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Subscription Not Paid Page (paye = false, is_active = true)
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <XCircle className="w-10 h-10 text-orange-600" />
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

        {plans.length > 0 && (
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

                  {plan.features && plan.features.length > 0 && (
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

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
