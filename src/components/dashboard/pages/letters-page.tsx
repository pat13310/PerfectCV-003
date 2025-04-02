import React, { useState, useEffect } from 'react';
import { Plus, Mail, Loader2, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { LetterEditor } from '../../letter-editor/letter-editor';
import { getSupabaseClient } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../lib/store';
import { cn } from '../../../lib/utils';

interface Letter {
  id: string;
  title: string;
  content: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  letterTitle: string;
}

function DeleteModal({ isOpen, onClose, onConfirm, letterTitle }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-4 text-red-600 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold">Supprimer la lettre</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer la lettre "{letterTitle}" ? Cette action est irréversible.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export function LettersPage() {
  const [isCreatingLetter, setIsCreatingLetter] = useState(false);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; letter: Letter | null }>({
    isOpen: false,
    letter: null
  });
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setLetters(data || []);
    } catch (error) {
      console.error('Error fetching letters:', error);
      toast.error('Erreur lors du chargement des lettres');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLetter = async (content: string, title: string) => {
    const supabase = getSupabaseClient();
    if (!supabase || !user) return;

    try {
      const letterData = {
        user_id: user.id,
        title,
        content,
        type: 'Brouillon',
      };

      if (editingLetter) {
        const { error } = await supabase
          .from('letters')
          .update({ 
            content, 
            title,
            updated_at: new Date().toISOString() 
          })
          .eq('id', editingLetter.id);

        if (error) throw error;
        toast.success('Lettre mise à jour avec succès');
      } else {
        const { error } = await supabase
          .from('letters')
          .insert([letterData]);

        if (error) throw error;
        toast.success('Lettre créée avec succès');
      }

      await fetchLetters();
      setIsCreatingLetter(false);
      setEditingLetter(null);
    } catch (error) {
      console.error('Error saving letter:', error);
      toast.error('Erreur lors de l\'enregistrement de la lettre');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.letter) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('letters')
        .delete()
        .eq('id', deleteModal.letter.id);

      if (error) throw error;

      toast.success('Lettre supprimée avec succès');
      await fetchLetters();
    } catch (error) {
      console.error('Error deleting letter:', error);
      toast.error('Erreur lors de la suppression de la lettre');
    } finally {
      setDeleteModal({ isOpen: false, letter: null });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace('à', 'à');  // Keep the French "à" for better readability
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#9333ea]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Mes lettres</h2>
        <button
          onClick={() => {
            setEditingLetter(null);
            setIsCreatingLetter(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#9333ea] text-white rounded-lg hover:bg-[#7e22ce] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nouvelle lettre</span>
        </button>
      </div>

      {letters.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-gray-900 mb-3">Aucune lettre</h3>
          <p className="text-gray-500 text-lg">Commencez par créer votre première lettre</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {letters.map((letter) => (
            <div key={letter.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:border-[#9333ea]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-[#9333ea]/10 rounded-xl">
                    <Mail className="w-6 h-6 text-[#9333ea]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-gray-700">{letter.title}</h3>
                    <p className="text-base text-gray-500">
                      Modifiée le {formatDate(letter.updated_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-3 py-1 text-base bg-blue-100 text-blue-700 rounded-lg font-medium">
                    {letter.type}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingLetter(letter);
                        setIsCreatingLetter(true);
                      }}
                      className="p-2.5 text-gray-600 hover:text-[#9333ea] hover:bg-[#9333ea]/10 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, letter })}
                      className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCreatingLetter && (
        <LetterEditor
          onClose={() => {
            setIsCreatingLetter(false);
            setEditingLetter(null);
          }}
          onSave={handleSaveLetter}
          initialContent={editingLetter?.content}
          initialTitle={editingLetter?.title}
        />
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, letter: null })}
        onConfirm={handleDelete}
        letterTitle={deleteModal.letter?.title || ''}
      />
    </div>
  );
}