import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from "react-hot-toast";

interface BillingDetailsProps {
  onClose: () => void;
  planId: string;
}

const BillingDetails: React.FC<BillingDetailsProps> = ({ onClose, planId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe n'est pas chargé");
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Champ carte introuvable");

      // Appel au backend pour obtenir le clientSecret
      const response = await fetch("http://localhost:3001/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const { clientSecret } = await response.json();
      if (!clientSecret) throw new Error("Erreur lors de la création de l'abonnement");

      // Confirmation du paiement
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        toast.error(`Erreur: ${error.message}`);
      } else if (paymentIntent?.status === 'succeeded') {
        toast.success("Paiement réussi ! Abonnement activé.");
        onClose();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`Erreur: ${err.message}`);
      } else {
        toast.error("Une erreur inconnue s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Informations de paiement</h3>
          <CardElement className="p-2 border border-gray-300 rounded-md" />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg"
          >
            {loading ? "Traitement..." : "Valider le paiement"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillingDetails;
