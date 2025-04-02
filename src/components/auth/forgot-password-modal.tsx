import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { getSupabaseClient } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose, onSwitchToLogin }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      toast.error('Erreur de configuration Supabase');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success('Instructions envoyées par email !');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du lien');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-[#c026d3] to-[#9333ea] inline-block w-full text-transparent bg-clip-text">
          Mot de passe oublié ?
        </h2>
        
        <p className="text-center text-gray-600 mb-8">
          Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full rounded-lg border border-gray-300 focus:border-[#9333ea] focus:ring-[#9333ea] transition-colors"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#c026d3] to-[#9333ea] text-white rounded-lg hover:from-[#a21caf] hover:to-[#7e22ce] transition-all duration-300 shadow-lg shadow-[#9333ea]/25 hover:shadow-[#9333ea]/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          <button
            onClick={onSwitchToLogin}
            className="text-[#9333ea] hover:text-[#7e22ce] font-medium"
          >
            Retour à la connexion
          </button>
        </p>
      </div>
    </div>
  );
}