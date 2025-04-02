import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { getSupabaseClient } from '../../../lib/supabase';
import { useAuthStore } from '../../../lib/store';
import toast from 'react-hot-toast';
import { cn } from '../../../lib/utils';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  summary: string | null;
}

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!user) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      // First, check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (!existingProfile) {
        // Create default profile using upsert to handle race conditions
        const defaultProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: null,
          address: null,
          summary: null
        };

        const { data: newProfile, error: upsertError } = await supabase
          .from('profiles')
          .upsert(defaultProfile, {
            onConflict: 'id'
          })
          .select()
          .single();

        if (upsertError) throw upsertError;

        setProfile(newProfile);
      } else {
        setProfile(existingProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const profileData = {
      id: user.id,
      full_name: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || null,
      address: formData.get('address') as string || null,
      summary: formData.get('summary') as string || null,
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'id'
        });

      if (error) throw error;

      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name
        }
      });

      toast.success('Profil mis à jour avec succès');
      setProfile(profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
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
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Mon profil</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-[#9333ea]/10 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-[#9333ea]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{profile?.full_name || 'Non renseigné'}</h3>
            <p className="text-gray-500">{profile?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span>{profile?.email || 'Non renseigné'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span>{profile?.phone || 'Non renseigné'}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span>{profile?.address || 'Non renseigné'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Modifier mes informations</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              type="text"
              name="fullName"
              defaultValue={profile?.full_name || ''}
              className="w-full rounded-lg border border-gray-300 focus:border-[#9333ea] focus:ring-[#9333ea]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={profile?.email || ''}
              className="w-full rounded-lg border border-gray-300 focus:border-[#9333ea] focus:ring-[#9333ea]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              defaultValue={profile?.phone || ''}
              className="w-full rounded-lg border border-gray-300 focus:border-[#9333ea] focus:ring-[#9333ea]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <input
              type="text"
              name="address"
              defaultValue={profile?.address || ''}
              className="w-full rounded-lg border border-gray-300 focus:border-[#9333ea] focus:ring-[#9333ea]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Résumé professionnel
            </label>
            <textarea
              name="summary"
              defaultValue={profile?.summary || ''}
              rows={4}
              className="w-full rounded-lg border border-gray-300 focus:border-[#9333ea] focus:ring-[#9333ea]"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className={cn(
              "w-full py-2 px-4 bg-[#9333ea] text-white rounded-lg",
              "hover:bg-[#7e22ce] transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}