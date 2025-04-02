import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CVTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  features: string[];
  popular?: boolean;
}

interface CVTemplatesProps {
  onSelect: (template: CVTemplate) => void;
  onBack: () => void;
}

export function CVTemplates({ onSelect, onBack }: CVTemplatesProps) {
  const templates: CVTemplate[] = [
    {
      id: 'modern',
      name: 'Modern Professionnel',
      description: 'Un design épuré et moderne avec une mise en page équilibrée',
      preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80',
      features: [
        'En-tête minimaliste',
        'Sections bien structurées',
        'Mise en avant des compétences',
        'Parfait pour les profils tech'
      ],
      popular: true
    },
    {
      id: 'creative',
      name: 'Créatif & Dynamique',
      description: 'Un template audacieux pour les profils créatifs',
      preview: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?auto=format&fit=crop&q=80',
      features: [
        'Design unique',
        'Sections personnalisables',
        'Mise en page originale',
        'Idéal pour les créatifs'
      ]
    },
    {
      id: 'executive',
      name: 'Executive Premium',
      description: 'Un design sophistiqué pour les profils seniors et dirigeants',
      preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80',
      features: [
        'Style professionnel',
        'Mise en page classique',
        'Sections détaillées',
        'Parfait pour les cadres'
      ]
    },
    {
      id: 'minimal',
      name: 'Minimaliste',
      description: 'Simple, efficace et direct',
      preview: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?auto=format&fit=crop&q=80',
      features: [
        'Design épuré',
        'Structure claire',
        'Lecture facile',
        'Adapté à tous les profils'
      ]
    },
    {
      id: 'academic',
      name: 'Académique',
      description: 'Idéal pour les profils académiques et de recherche',
      preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80',
      features: [
        'Sections publications',
        'Mise en avant recherche',
        'Structure détaillée',
        'Format académique'
      ]
    },
    {
      id: 'startup',
      name: 'Startup Dynamic',
      description: 'Modern et impactant pour les profils startup',
      preview: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?auto=format&fit=crop&q=80',
      features: [
        'Design innovant',
        'Sections flexibles',
        'Mise en avant projets',
        'Style startup'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl my-8">
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choisissez votre template</h2>
              <p className="mt-1 text-gray-500">
                Sélectionnez un modèle professionnel pour votre CV
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {template.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#c026d3] to-[#9333ea] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Populaire
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => onSelect(template)}
                    className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    Utiliser ce template
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {template.description}
                </p>
                <ul className="space-y-2">
                  {template.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 text-[#9333ea] mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}