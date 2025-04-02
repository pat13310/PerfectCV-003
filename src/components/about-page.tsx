import React from 'react';
import { Sparkles, Palette, Bot } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#9333ea] to-[#c026d3] text-white py-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] mix-blend-overlay opacity-10 bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6">À Propos de PerfectCV</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Nous aidons les professionnels à créer des CV qui se démarquent et ouvrent de nouvelles opportunités.
          </p>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#c026d3] to-[#9333ea] inline-block w-full text-transparent bg-clip-text">
            Nos Avantages
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Création Simple */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#c026d3]/20 to-[#9333ea]/20 rounded-3xl flex items-center justify-center mx-auto transform group-hover:rotate-6 transition-transform duration-300">
                <Sparkles className="w-10 h-10 text-[#9333ea]" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-gray-900">Création Simple</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Créez votre CV en quelques minutes avec notre interface intuitive
              </p>
            </div>

            {/* Templates Professionnels */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#c026d3]/20 to-[#9333ea]/20 rounded-3xl flex items-center justify-center mx-auto transform group-hover:rotate-6 transition-transform duration-300">
                <Palette className="w-10 h-10 text-[#9333ea]" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-gray-900">Templates Professionnels</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Choisissez parmi une variété de modèles conçus par des experts
              </p>
            </div>

            {/* Analyse IA */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#c026d3]/20 to-[#9333ea]/20 rounded-3xl flex items-center justify-center mx-auto transform group-hover:rotate-6 transition-transform duration-300">
                <Bot className="w-10 h-10 text-[#9333ea]" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-gray-900">Analyse IA</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Optimisez votre CV avec notre technologie d'intelligence artificielle
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-[#9333ea] to-[#c026d3] py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">100K+</div>
              <div className="text-lg opacity-80">CV Créés</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-80">Templates</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-80">Satisfaction</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-80">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Notre Équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                name: "Sarah Martin",
                role: "CEO & Fondatrice",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
              },
              {
                name: "David Chen",
                role: "Directeur Technique",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
              },
              {
                name: "Emma Thompson",
                role: "Directrice Design",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-full object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 rounded-full border-4 border-[#9333ea] opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 mt-2">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}