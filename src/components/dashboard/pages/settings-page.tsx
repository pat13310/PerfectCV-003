import React, { useEffect, useState } from 'react';
import { Bell, Lock, Globe, CreditCard, Loader2 } from 'lucide-react';
import { getSupabaseClient } from '../../../lib/supabase';
import { useAuthStore } from '../../../lib/store';
import toast from 'react-hot-toast';
import { cn } from '../../../lib/utils';

interface Parameters {
  id: string;
  user_id: string;
  notifications_email: boolean;
  notifications_updates: boolean;
  language: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

export function SettingsPage() {
  const [parameters, setParameters] = useState<Parameters | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchParameters();
  }, []);

  const fetchParameters = async () => {
    if (!user) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { data: existingParams, error: checkError } = await supabase
        .from('parameters')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (!existingParams) {
        // Create default parameters
        const defaultParams = {
          user_id: user.id,
          notifications_email: true,
          notifications_updates: true,
          language: 'fr',
          theme: 'light'
        };

        const { data: newParams, error: insertError } = await supabase
          .from('parameters')
          .upsert(defaultParams, {
            onConflict: 'user_id'
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setParameters(newParams);
      } else {
        setParameters(existingParams);
      }
    } catch (error) {
      console.error('Error fetching parameters:', error);
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleParameterChange = async (
    key: keyof Parameters,
    value: boolean | string
  ) => {
    if (!user || !parameters) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('parameters')
        .update({ [key]: value })
        .eq('user_id', user.id);

      if (error) throw error;

      setParameters({ ...parameters, [key]: value });
      toast.success('Paramètres mis à jour');
    } catch (error) {
      console.error('Error updating parameters:', error);
      toast.error('Erreur lors de la mise à jour des paramètres');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#9333ea]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Paramètres</h2>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-[#9333ea]/10 rounded-lg">
              <Bell className="w-6 h-6 text-[#9333ea]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <p className="text-gray-500">Gérez vos préférences de notifications</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span>Notifications par email</span>
              <input
                type="checkbox"
                checked={parameters?.notifications_email}
                onChange={(e) => handleParameterChange('notifications_email', e.target.checked)}
                className="rounded text-[#9333ea] focus:ring-[#9333ea]"
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Notifications de mise à jour</span>
              <input
                type="checkbox"
                checked={parameters?.notifications_updates}
                onChange={(e) => handleParameterChange('notifications_updates', e.target.checked)}
                className="rounded text-[#9333ea] focus:ring-[#9333ea]"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-[#9333ea]/10 rounded-lg">
              <Lock className="w-6 h-6 text-[#9333ea]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
              <p className="text-gray-500">Gérez vos paramètres de sécurité</p>
            </div>
          </div>
          <button className="w-full py-2 px-4 text-[#9333ea] border-2 border-[#9333ea] rounded-lg hover:bg-[#9333ea] hover:text-white transition-colors">
            Changer le mot de passe
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-[#9333ea]/10 rounded-lg">
              <Globe className="w-6 h-6 text-[#9333ea]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Langue</h3>
              <p className="text-gray-500">Choisissez votre langue préférée</p>
            </div>
          </div>
          <select
            value={parameters?.language}
            onChange={(e) => handleParameterChange('language', e.target.value)}
            className="w-full rounded-lg border border-gray-300 focus:border-[#9333ea] focus:ring-[#9333ea]"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-[#9333ea]/10 rounded-lg">
              <CreditCard className="w-6 h-6 text-[#9333ea]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Abonnement</h3>
              <p className="text-gray-500">Gérez votre abonnement</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <p className="font-medium text-gray-900">Plan Pro</p>
            <p className="text-gray-500">9.99€/mois</p>
          </div>
          <button className="w-full py-2 px-4 text-[#9333ea] border-2 border-[#9333ea] rounded-lg hover:bg-[#9333ea] hover:text-white transition-colors">
            Gérer l'abonnement
          </button>
        </div>
      </div>
    </div>
  );
}