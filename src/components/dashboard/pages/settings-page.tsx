import React, { useEffect, useState } from "react";
import { Bell, Lock, Globe, CreditCard, Bot } from "lucide-react";
import { getSupabaseClient } from "../../../lib/supabase";
import { useAuthStore } from "../../../lib/store";
import toast from "react-hot-toast";
import { ChangePasswordModal } from "../modals/change-password-modal";
import { useNavigate } from "react-router-dom";

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

const AI_MODELS = [
  {
    id: "openai",
    name: "OpenAI GPT-4",
    description:
      "Modèle le plus avancé avec une excellente compréhension du contexte",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "Alternative performante avec un bon rapport qualité/prix",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Modèle polyvalent avec de bonnes capacités multimodales",
  },
];

export function SettingsPage() {
  const [parameters, setParameters] = useState<Parameters | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const aiConfig = useAuthStore((state) => state.aiConfig);
  const setAIConfig = useAuthStore((state) => state.setAIConfig);
  const navigate = useNavigate();

  useEffect(() => {
    fetchParameters();
  }, []);

  const fetchParameters = async () => {
    if (!user) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { data: existingParams, error: checkError } = await supabase
        .from("parameters")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (!existingParams) {
        const defaultParams = {
          user_id: user.id,
          notifications_email: true,
          notifications_updates: true,
          language: "fr",
          theme: "light",
        };

        const { data: newParams, error: insertError } = await supabase
          .from("parameters")
          .upsert(defaultParams, {
            onConflict: "user_id",
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setParameters(newParams as unknown as Parameters);
      } else {
        setParameters(existingParams as unknown as Parameters);
      }
    } catch (error) {
      console.error("Error fetching parameters:", error);
      toast.error("Erreur lors du chargement des paramètres");
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
        .from("parameters")
        .update({ [key]: value })
        .eq("user_id", user.id);

      if (error) throw error;

      setParameters({ ...parameters, [key]: value });
      toast.success("Paramètres mis à jour");
    } catch (error) {
      console.error("Error updating parameters:", error);
      toast.error("Erreur lors de la mise à jour des paramètres");
    } finally {
      setSaving(false);
    }
  };

  const handleAIConfigChange = (key: keyof typeof aiConfig, value: string) => {
    setAIConfig({ ...aiConfig, [key]: value });
    toast.success("Configuration IA mise à jour");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-[#9333ea] border-t-transparent" />
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
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
              </h3>
              <p className="text-gray-500">
                Gérez vos préférences de notifications
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span>Notifications par email</span>
              <input
                type="checkbox"
                checked={parameters?.notifications_email}
                onChange={(e) =>
                  handleParameterChange("notifications_email", e.target.checked)
                }
                className="rounded text-[#9333ea] focus:ring-[#9333ea]"
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Notifications de mise à jour</span>
              <input
                type="checkbox"
                checked={parameters?.notifications_updates}
                onChange={(e) =>
                  handleParameterChange(
                    "notifications_updates",
                    e.target.checked
                  )
                }
                className="rounded text-[#9333ea] focus:ring-[#9333ea]"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-[#9333ea]/10 rounded-lg">
              <Bot className="w-6 h-6 text-[#9333ea]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Configuration IA
              </h3>
              <p className="text-gray-500">
                Gérez vos paramètres d'intelligence artificielle
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modèle IA
              </label>
              <select
                value={aiConfig.model}
                onChange={(e) => handleAIConfigChange("model", e.target.value)}
                className="w-full rounded-lg border border-gray-300 focus:border-[#9333ea] focus:ring-[#9333ea]"
              >
                {AI_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {AI_MODELS.find((m) => m.id === aiConfig.model)?.description}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clé API
              </label>
              <input
                type="password"
                value={aiConfig.apiKey}
                onChange={(e) => handleAIConfigChange("apiKey", e.target.value)}
                placeholder="sk-..."
                className="w-full rounded-lg border border-gray-300 focus:border-[#9333ea] focus:ring-[#9333ea]"
              />
              <p className="mt-1 text-sm text-gray-500">
                Votre clé API sera stockée de manière sécurisée et utilisée
                uniquement pour les requêtes IA
              </p>
            </div>
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
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full py-2 px-4 text-[#9333ea] border-2 border-[#9333ea] rounded-lg hover:bg-[#9333ea] hover:text-white transition-colors"
          >
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
            onChange={(e) => handleParameterChange("language", e.target.value)}
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
              <h3 className="text-lg font-semibold text-gray-900">
                Abonnement
              </h3>
              <p className="text-gray-500">Gérez votre abonnement</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <p className="font-medium text-gray-900">Plan Pro</p>
            <p className="text-gray-500">9.99€/mois</p>
          </div>
          <button
            onClick={() => navigate("/subscription")}
            className="w-full py-2 px-4 text-[#9333ea] border-2 border-[#9333ea] rounded-lg hover:bg-[#9333ea] hover:text-white transition-colors"
          >
            Gérer l'abonnement
          </button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
