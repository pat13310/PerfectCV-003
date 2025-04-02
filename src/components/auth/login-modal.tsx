import React, { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { getSupabaseClient } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup, onForgotPassword }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      toast.error('Erreur de configuration Supabase. Veuillez configurer votre projet.');
      setLoading(false);
      return;
    }

    try {
      // Trim whitespace from credentials
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        toast.error('Format d\'email invalide');
        setLoading(false);
        return;
      }

      // Validate password length
      if (trimmedPassword.length < 6) {
        toast.error('Le mot de passe doit contenir au moins 6 caractères');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (error) {
        console.error('Login error details:', error);
        
        switch (error.message) {
          case 'Invalid login credentials':
            toast.error('Email ou mot de passe incorrect');
            break;
          case 'Email not confirmed':
            toast.error('Veuillez confirmer votre email avant de vous connecter');
            break;
          case 'Too many requests':
            toast.error('Trop de tentatives. Veuillez réessayer plus tard');
            break;
          default:
            toast.error(`Erreur de connexion: ${error.message}`);
        }
        return;
      }

      if (data?.user) {
        setUser(data.user);
        toast.success('Connexion réussie !');
        onClose();
      } else {
        toast.error('Erreur inattendue lors de la connexion');
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('Une erreur inattendue est survenue');
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

        <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-[#c026d3] to-[#9333ea] inline-block w-full text-transparent bg-clip-text">
          Connexion
        </h2>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full rounded-lg border border-gray-300 focus:border-[#9333ea] focus:ring-[#9333ea] transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#9333ea] focus:ring-[#9333ea]"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>
            <button 
              type="button" 
              onClick={onForgotPassword}
              className="text-sm text-[#9333ea] hover:text-[#7e22ce]"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#c026d3] to-[#9333ea] text-white rounded-lg hover:from-[#a21caf] hover:to-[#7e22ce] transition-all duration-300 shadow-lg shadow-[#9333ea]/25 hover:shadow-[#9333ea]/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-[#9333ea] hover:text-[#7e22ce] font-medium"
          >
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  );
}