import React from 'react';
import { useForm } from 'react-hook-form';
import { Save, X, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

// ... (keep all the existing interfaces)

export function CVPreview({ data, onClose, onSave }: CVPreviewProps) {
  const { register, handleSubmit, watch, formState: { isDirty } } = useForm<CVData>({
    defaultValues: data
  });

  const formData = watch();

  const onSubmit = (formData: CVData) => {
    onSave(formData);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl my-8 relative">
            <div className="sticky top-0 bg-white z-10 px-8 py-4 border-b border-gray-200 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#c026d3] to-[#9333ea] inline-block text-transparent bg-clip-text">
                  Aperçu et modification du CV
                </h2>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="space-y-6">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Keep all the existing form content */}
                    {/* ... */}
                  </form>
                </div>

                {/* Preview Section */}
                <div className="lg:sticky lg:top-24 self-start">
                  <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                    {/* Keep all the existing preview content */}
                    {/* ... */}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-8 py-4 border-t border-gray-200 rounded-b-2xl">
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isDirty}
                  className={cn(
                    "px-6 py-2 rounded-lg flex items-center gap-2",
                    "bg-gradient-to-r from-[#c026d3] to-[#9333ea] text-white",
                    "hover:from-[#a21caf] hover:to-[#7e22ce] transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <Save className="w-5 h-5" />
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}