import React from 'react';
import { LayoutGrid, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { getSupabaseClient } from '../lib/supabase';
import toast from 'react-hot-toast';

interface NavbarProps {
  onOpenLogin: () => void;
  onPageChange: (page: 'home' | 'pricing' | 'about') => void;
}

export function Navbar({ onOpenLogin, onPageChange }: NavbarProps) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <header className="bg-[#18191b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <LayoutGrid className="h-8 w-8 text-[#9333ea]" />
            <span className="ml-2 text-xl font-semibold">Perfect CV</span>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <button 
                  onClick={() => onPageChange('home')}
                  className="text-white hover:text-[#9333ea] transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('pricing')}
                  className="text-white hover:text-[#9333ea] transition-colors"
                >
                  Tarifs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('about')}
                  className="text-white hover:text-[#9333ea] transition-colors"
                >
                  A propos de nous
                </button>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-6">
            <div className="flex space-x-2">
              <button className="text-white hover:text-[#9333ea] transition-colors">FR</button>
              <span className="text-gray-400">|</span>
              <button className="text-gray-400 hover:text-white transition-colors">GB</button>
            </div>
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#c026d3] to-[#9333ea] hover:from-[#a21caf] hover:to-[#7e22ce] transition-all duration-300 shadow-lg shadow-[#9333ea]/25 hover:shadow-[#9333ea]/40"
              >
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#c026d3] to-[#9333ea] hover:from-[#a21caf] hover:to-[#7e22ce] transition-all duration-300 shadow-lg shadow-[#9333ea]/25 hover:shadow-[#9333ea]/40"
              >
                <User className="h-5 w-5" />
                <span>Connexion</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}