import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

export function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#c026d3] to-[#9333ea] inline-block text-transparent bg-clip-text mb-6">
          Choisissez votre plan
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Des solutions adaptées à vos besoins, de la création simple de CV à la gestion complète de carrière
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Plan Gratuit */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-center text-[#9333ea] mb-2">Gratuit</h2>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">0€</span>
            <span className="text-gray-500">/mois</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>1 CV personnalisé</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Templates de base</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Export PDF</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Assistance par email</span>
            </li>
          </ul>
          <button className={cn(
            "w-full py-3 px-4 rounded-lg text-[#9333ea] border-2 border-[#9333ea]",
            "hover:bg-[#9333ea] hover:text-white transition-all duration-300"
          )}>
            Commencer Gratuitement
          </button>
        </div>

        {/* Plan Pro */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#9333ea] relative transform hover:scale-105 transition-transform duration-300">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-[#c026d3] to-[#9333ea] text-white px-4 py-1 rounded-full text-sm">
              Le plus populaire
            </span>
          </div>
          <h2 className="text-2xl font-bold text-center text-[#9333ea] mb-2">Pro</h2>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">9.99€</span>
            <span className="text-gray-500">/mois</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>CVs illimités</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Tous les templates premium</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Export multi-formats</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Analyse IA avancée</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Support prioritaire 24/7</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Suggestions IA personnalisées</span>
            </li>
          </ul>
          <button className={cn(
            "w-full py-3 px-4 rounded-lg text-white",
            "bg-gradient-to-r from-[#c026d3] to-[#9333ea]",
            "hover:from-[#a21caf] hover:to-[#7e22ce]",
            "transition-all duration-300 shadow-lg shadow-[#9333ea]/25",
            "hover:shadow-[#9333ea]/40"
          )}>
            Commencer l'essai Pro
          </button>
        </div>

        {/* Plan Entreprise */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-center text-[#9333ea] mb-2">Entreprise</h2>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">49.99€</span>
            <span className="text-gray-500">/mois</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Tout le plan Pro</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Gestion multi-utilisateurs</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>API d'intégration</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Support dédié</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Formation personnalisée</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-[#9333ea] mr-2" />
              <span>Personnalisation sur mesure</span>
            </li>
          </ul>
          <button className={cn(
            "w-full py-3 px-4 rounded-lg text-[#9333ea] border-2 border-[#9333ea]",
            "hover:bg-[#9333ea] hover:text-white transition-all duration-300"
          )}>
            Contacter les ventes
          </button>
        </div>
      </div>

      <div className="text-center mt-12 space-y-2">
        <p className="text-gray-600">Tous les prix sont en euros (EUR) et incluent la TVA.</p>
        <p className="text-gray-600">
          Besoin d'une solution personnalisée ?{' '}
          <a href="#" className="text-[#9333ea] hover:text-[#7e22ce] font-medium">
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  );
}