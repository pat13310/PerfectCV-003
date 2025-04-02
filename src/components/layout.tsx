import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { LoginModal } from './auth/login-modal';
import { SignupModal } from './auth/signup-modal';
import { ForgotPasswordModal } from './auth/forgot-password-modal';
import { isSupabaseConfigured } from '../lib/supabase';
import { Footer } from './footer';
import { Navbar } from './navbar';

interface LayoutProps {
  children: React.ReactNode;
  onPageChange: (page: 'home' | 'pricing' | 'about') => void;
}

export function Layout({ children, onPageChange }: LayoutProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const openLogin = () => {
    setIsSignupOpen(false);
    setIsForgotPasswordOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setIsLoginOpen(false);
    setIsForgotPasswordOpen(false);
    setIsSignupOpen(true);
  };

  const openForgotPassword = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
    setIsForgotPasswordOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!isSupabaseConfigured() && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <p className="ml-3 text-sm text-yellow-700">
                  Configuration Supabase manquante. Veuillez cliquer sur "Connect to Supabase" pour configurer votre projet.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar onOpenLogin={openLogin} onPageChange={onPageChange} />

      <main className="flex-grow bg-gradient-to-b from-white to-[#f3f0ff]">
        {children}
      </main>

      <Footer />

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={openSignup}
        onForgotPassword={openForgotPassword}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={openLogin}
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onSwitchToLogin={openLogin}
      />
    </div>
  );
}