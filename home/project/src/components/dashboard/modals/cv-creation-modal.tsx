import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { X, Upload, File, Copy } from 'lucide-react';
import { CVEditor } from '../../cv-editor';
import { ImportCVModal } from '../../import-cv-modal';
import { CVTemplates } from '../../templates/cv-templates';
import { getSupabaseClient } from '../../../lib/supabase';
import { useAuthStore } from '../../../lib/store';
import toast from 'react-hot-toast';

interface CVCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCVCreated?: () => void;
}

export function CVCreationModal({ isOpen, onClose, onCVCreated }: CVCreationModalProps) {
  const [selectedOption, setSelectedOption] = useState<'blank' | 'import' | 'template' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const user = useAuthStore((state) => state.user);

  if (!isOpen) return null;

  const handleSaveCV = async (data: any) => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer un CV');
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      toast.error('Erreur de configuration Supabase');
      return;
    }

    try {
      // First, create the CV
      const { data: cvData, error: cvError } = await supabase
        .from('cvs')
        .insert([
          {
            user_id: user.id,
            title: data.title || 'Nouveau CV',
            content: data,
            status: 'Brouillon',
            summary: data.summary || null
          }
        ])
        .select()
        .single();

      if (cvError) throw cvError;

      // Then, update or create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: data.fullName,
          email: data.email,
          phone: data.phone || null,
          address: data.address || null,
          summary: data.summary || null
        }, {
          onConflict: 'id'
        });

      if (profileError) throw profileError;

      // Save experiences if they exist
      if (data.experience && data.experience.length > 0 && cvData) {
        const experiences = data.experience.map((exp: any) => ({
          cv_id: cvData.id, // Use the newly created CV's ID
          company: exp.company,
          position: exp.position,
          start_date: exp.startDate,
          end_date: exp.endDate,
          description: exp.description
        }));

        const { error: experiencesError } = await supabase
          .from('experiences')
          .insert(experiences);

        if (experiencesError) throw experiencesError;
      }

      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: data.fullName
        }
      });

      toast.success('CV créé avec succès !');
      onCVCreated?.();
      onClose();
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error('Erreur lors de la création du CV');
    }
  };

  if (selectedOption === 'blank') {
    return (
      <CVEditor
        initialData={{
          title: 'Nouveau CV',
          fullName: '',
          email: '',
          phone: '',
          address: '',
          summary: '',
          skills: [],
          experience: [{
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: ''
          }],
          education: [{
            school: '',
            degree: '',
            startDate: '',
            endDate: '',
            description: ''
          }]
        }}
        onSave={handleSaveCV}
        onClose={() => {
          setSelectedOption(null);
          onClose();
        }}
      />
    );
  }

  if (selectedOption === 'import') {
    return (
      <ImportCVModal
        isOpen={true}
        onClose={() => {
          setSelectedOption(null);
          onClose();
        }}
        onSave={handleSaveCV}
      />
    );
  }

  if (selectedOption === 'template') {
    if (selectedTemplate) {
      return (
        <CVEditor
          initialData={{
            title: selectedTemplate.name,
            template: selectedTemplate.id,
            ...selectedTemplate.defaultData
          }}
          onSave={handleSaveCV}
          onClose={() => {
            setSelectedTemplate(null);
            setSelectedOption(null);
            onClose();
          }}
        />
      );
    }

    return (
      <CVTemplates
        onSelect={(template) => setSelectedTemplate(template)}
        onBack={() => setSelectedOption(null)}
      />
    );
  }

  const creationTypes = [
    {
      id: 'blank',
      title: 'Partir de zéro',
      description: 'Créez votre CV étape par étape avec notre assistant',
      icon: File,
      color: 'bg-blue-500',
    },
    {
      id: 'import',
      title: 'Importer un CV',
      description: 'Importez un CV existant et modifiez-le',
      icon: Upload,
      color: 'bg-green-500',
    },
    {
      id: 'template',
      title: 'Utiliser un modèle',
      description: 'Choisissez parmi nos modèles professionnels',
      icon: Copy,
      color: 'bg-purple-500',
    },
  ];

  const handleCreationTypeSelect = (type: string) => {
    setSelectedOption(type as 'blank' | 'import' | 'template');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={() => {
            setSelectedOption(null);
            setSelectedTemplate(null);
            onClose();
          }}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-8">
          Comment souhaitez-vous créer votre CV ?
        </h2>

        <div className="grid gap-4">
          {creationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleCreationTypeSelect(type.id)}
                className={cn(
                  "flex items-center gap-4 p-6 rounded-xl border-2 border-transparent",
                  "hover:border-[#9333ea] transition-all duration-300",
                  "text-left group"
                )}
              >
                <div className={cn(
                  "p-4 rounded-xl text-white",
                  type.color,
                  "group-hover:scale-110 transition-transform duration-300"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                  <p className="text-gray-500 text-sm">{type.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}