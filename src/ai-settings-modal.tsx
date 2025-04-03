import React from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from './lib/store';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AI_MODELS = [
  { id: 'deepseek', name: 'DeepSeek', endpoint: 'https://api.deepseek.com/v1/chat/completions' },
  { id: 'openai', name: 'OpenAI', endpoint: 'https://api.openai.com/v1/chat/completions' },
  { id: 'gemini', name: 'Google Gemini', endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent' }
];

export function AISettingsModal({ isOpen, onClose }: AISettingsModalProps) {
  const aiConfig = useAuthStore((state) => state.aiConfig);
  const setAIConfig = useAuthStore((state) => state.setAIConfig);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Paramètres IA</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modèle IA
            </label>
            <select
              value={aiConfig.model}
              onChange={(e) => setAIConfig({ ...aiConfig, model: e.target.value as 'deepseek' | 'openai' | 'gemini' })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
            >
              {AI_MODELS.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clé API
            </label>
            <input
              type="password"
              value={aiConfig.apiKey}
              onChange={(e) => setAIConfig({ ...aiConfig, apiKey: e.target.value })}
              placeholder="Entrez votre clé API"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
            />
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-[#9333ea] text-white rounded-lg hover:bg-[#7e22ce] transition-colors mt-6"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}