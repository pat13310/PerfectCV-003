import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { persist } from 'zustand/middleware';

interface AIConfig {
  model: 'deepseek' | 'openai' | 'gemini';
  apiKey: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  aiConfig: AIConfig;
  setAIConfig: (config: AIConfig) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      aiConfig: {
        model: 'openai',
        apiKey: '',
      },
      setAIConfig: (config) => set({ aiConfig: config }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        aiConfig: state.aiConfig,
      }),
    }
  )
);