import React from "react";
import {
  Check,
  CreditCard,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "../../../lib/utils";

import BillingDetails from "../../billingdetails";

const PLANS = [
  {
    id: "free",
    name: "Gratuit",
    price: "0€",
    description: "Pour commencer avec les fonctionnalités essentielles",
    features: [
      "1 CV personnalisé",
      "Templates de base",
      "Export PDF",
      "Assistance par email",
    ],
    cta: "Plan actuel",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "9.99€",
    period: "/mois",
    description: "Pour les professionnels qui veulent se démarquer",
    features: [
      "CVs illimités",
      "Tous les templates premium",
      "Export multi-formats",
      "Analyse IA avancée",
      "Support prioritaire 24/7",
      "Suggestions IA personnalisées",
    ],
    cta: "Commencer l'essai Pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Entreprise",
    price: "49.99€",
    period: "/mois",
    description: "Pour les équipes et les grandes organisations",
    features: [
      "Tout le plan Pro",
      "Gestion multi-utilisateurs",
      "API d'intégration",
      "Support dédié",
      "Formation personnalisée",
      "Personnalisation sur mesure",
    ],
    cta: "Contacter les ventes",
    popular: false,
  },
];
/* 
interface BillingDetailsProps {
  onClose: () => void;
}

function BillingDetails({ onClose }: BillingDetailsProps) {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Abonnement mis à jour avec succès");
      onClose();
    } catch  {
      toast.error("Erreur lors de la mise à jour de l'abonnement");
    } finally {
      setLoading(false);
    }
    };
  */



export function SubscriptionPage() {
  const [showBilling, setShowBilling] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  //const user = useAuthStore((state) => state.user);

/**
 * Handle a plan selection and open the billing form
 * @param {string} planId - The ID of the selected plan
 */
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowBilling(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Abonnement</h2>
        <p className="mt-2 text-gray-600">
          Choisissez le plan qui correspond le mieux à vos besoins
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:scale-[1.02]",
              "flex flex-col min-h-80", // Added h-full to ensure full height
              plan.popular ? "border-[#9333ea] md:scale-105" : "border-gray-100"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-5 inset-x-0 flex justify-center">
                <span className="bg-gradient-to-r from-[#c026d3] to-[#9333ea] text-white px-4 py-1 rounded-full text-sm font-medium">
                  Le plus populaire
                </span>
              </div>
            )}

            <div className="p-6 flex-1 flex flex-col">
              <div>
                <h3 className="text-2xl font-bold text-[#9333ea]">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-lg text-gray-500 ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-gray-500">{plan.description}</p>
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-[#9333ea] shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gray-50 rounded-b-2xl mt-auto">
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={cn(
                  "w-full py-3 px-4 rounded-lg font-medium transition-all duration-300",
                  plan.popular
                    ? "bg-gradient-to-r from-[#c026d3] to-[#9333ea] text-white hover:from-[#a21caf] hover:to-[#7e22ce]"
                    : "text-[#9333ea] border-2 border-[#9333ea] hover:bg-[#9333ea] hover:text-white"
                )}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#9333ea]/10 rounded-xl">
            <Shield className="w-6 h-6 text-[#9333ea]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Garantie satisfait ou remboursé
            </h3>
            <p className="text-gray-600">
              Essayez Perfect CV Pro pendant 14 jours. Si vous n'êtes pas
              satisfait, nous vous remboursons intégralement.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#9333ea]/10 rounded-lg shrink-0">
              <Zap className="w-5 h-5 text-[#9333ea]" />
            </div>
            <div>
              <h4 className="font-medium">Mise à niveau instantanée</h4>
              <p className="text-sm text-gray-500">
                Accédez immédiatement aux fonctionnalités premium
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#9333ea]/10 rounded-lg shrink-0">
              <ArrowRight className="w-5 h-5 text-[#9333ea]" />
            </div>
            <div>
              <h4 className="font-medium">Annulation facile</h4>
              <p className="text-sm text-gray-500">
                Annulez à tout moment en quelques clics
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#9333ea]/10 rounded-lg shrink-0">
              <CreditCard className="w-5 h-5 text-[#9333ea]" />
            </div>
            <div>
              <h4 className="font-medium">Paiement sécurisé</h4>
              <p className="text-sm text-gray-500">
                Vos données bancaires sont protégées
              </p>
            </div>
          </div>
        </div>
      </div>

      {showBilling && selectedPlan && (
        <BillingDetails
          onClose={() => setShowBilling(false)}
          planId={selectedPlan}
        />
      )}
    </div>
  );
}
