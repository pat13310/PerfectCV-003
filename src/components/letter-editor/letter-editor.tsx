import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Image from '@tiptap/extension-image';
import { 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  List, Save, X, Undo, Redo,
  Palette, Type, Sparkles, Loader2, Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../lib/store';
import { AISettingsModal } from './ai-settings-modal';

interface LetterEditorProps {
  onClose: () => void;
  onSave: (content: string, title: string) => void;
  initialContent?: string;
  initialTitle?: string;
}

interface ToolbarButtonProps {
  icon: React.ElementType;
  isActive?: boolean;
  onClick: () => void;
  label?: string;
}

const COLORS = [
  { name: 'Noir', value: '#000000' },
  { name: 'Gris', value: '#666666' },
  { name: 'Rouge', value: '#EF4444' },
  { name: 'Vert', value: '#10B981' },
  { name: 'Bleu', value: '#3B82F6' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Rose', value: '#EC4899' },
  { name: 'Orange', value: '#F97316' },
];

const FONTS = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Garamond', value: 'Garamond, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
];

function ToolbarButton({ icon: Icon, isActive, onClick, label }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg hover:bg-gray-100 transition-colors",
        isActive && "bg-gray-100 text-[#9333ea]"
      )}
      title={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

export function LetterEditor({ onClose, onSave, initialContent = '', initialTitle = 'Nouvelle lettre' }: LetterEditorProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showFonts, setShowFonts] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const aiConfig = useAuthStore((state) => state.aiConfig);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Image,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  const enhanceContent = async () => {
    if (!editor) return;

    const content = editor.getText();
    if (!content.trim()) {
      toast.error('Veuillez d\'abord ajouter du contenu à améliorer');
      return;
    }

    if (!aiConfig.apiKey) {
      toast.error('Veuillez configurer votre clé API');
      setShowAISettings(true);
      return;
    }

    setIsEnhancing(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert en rédaction professionnelle française. Ta mission est d\'améliorer le texte fourni pour le rendre plus professionnel, persuasif et impactant.'
            },
            {
              role: 'user',
              content: `Améliore ce texte:\n\n${content}`
            }
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur OpenAI: ${errorData.error?.message || 'Erreur inconnue'}`);
      }

      const data = await response.json();
      editor.commands.setContent(data.choices[0].message.content);
      toast.success('Texte amélioré avec succès !');
    } catch (error) {
      console.error('Error enhancing content:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'amélioration du texte');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSave = () => {
    if (!editor) return;
    onSave(editor.getHTML(), title);
  };

  if (!editor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-lg flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 text-2xl font-semibold bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
              placeholder="Titre de la lettre"
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ToolbarButton
                icon={Bold}
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                label="Gras"
              />
              <ToolbarButton
                icon={Italic}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                label="Italique"
              />
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <ToolbarButton
                icon={AlignLeft}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                label="Aligner à gauche"
              />
              <ToolbarButton
                icon={AlignCenter}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                label="Centrer"
              />
              <ToolbarButton
                icon={AlignRight}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                label="Aligner à droite"
              />
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-semibold transition-colors",
                  editor.isActive('heading', { level: 1 })
                    ? "bg-[#9333ea]/10 text-[#9333ea]"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                H1
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-semibold transition-colors",
                  editor.isActive('heading', { level: 2 })
                    ? "bg-[#9333ea]/10 text-[#9333ea]"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                H2
              </button>
              <ToolbarButton
                icon={List}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                label="Liste à puces"
              />
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <div className="relative">
                <ToolbarButton
                  icon={Palette}
                  onClick={() => setShowColors(!showColors)}
                  label="Couleur du texte"
                />
                {showColors && (
                  <div className="absolute w-[190px] top-full left-0 mt-2 py-4 px-4 bg-white rounded-xl shadow-xl border border-gray-200 grid grid-cols-4 gap-2 z-10">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          editor.chain().focus().setColor(color.value).run();
                          setShowColors(false);
                        }}
                        className="w-8 h-8 rounded-xl hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md relative group"
                        style={{ 
                          backgroundColor: color.value,
                          border: color.value === '#000000' ? '1px solid #e5e7eb' : 'none'
                        }}
                        title={color.name}
                      >
                        <span className="absolute inset-0 rounded-xl ring-2 ring-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <ToolbarButton
                  icon={Type}
                  onClick={() => setShowFonts(!showFonts)}
                  label="Police de caractères"
                />
                {showFonts && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 w-48 z-10">
                    {FONTS.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => {
                          editor.chain().focus().setFontFamily(font.value).run();
                          setShowFonts(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded"
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <ToolbarButton
                icon={Undo}
                onClick={() => editor.chain().focus().undo().run()}
                label="Annuler"
              />
              <ToolbarButton
                icon={Redo}
                onClick={() => editor.chain().focus().redo().run()}
                label="Rétablir"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAISettings(true)}
                className="p-2 text-gray-600 hover:text-gray-900"
                title="Paramètres IA"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={enhanceContent}
                disabled={isEnhancing}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl text-white",
                  "bg-gradient-to-r from-[#c026d3] to-[#9333ea]",
                  "hover:from-[#a21caf] hover:to-[#7e22ce]",
                  "transition-all duration-300 transform hover:scale-105",
                  "shadow-lg shadow-[#9333ea]/25 hover:shadow-[#9333ea]/40",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                  "relative overflow-hidden group"
                )}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                {isEnhancing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 animate-pulse" />
                )}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-[#9333ea] text-white rounded-lg hover:bg-[#7e22ce] transition-colors"
              >
                <Save className="w-5 h-5" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <EditorContent editor={editor} className="min-h-[200px]" />
        </div>
      </div>

      <AISettingsModal
        isOpen={showAISettings}
        onClose={() => setShowAISettings(false)}
      />
    </div>
  );
}