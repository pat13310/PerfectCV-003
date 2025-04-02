import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, File, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import { CVEditor } from './cv-editor';

interface ImportCVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CVData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
}

const emptyCV: CVData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
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
};

export function ImportCVModal({ isOpen, onClose }: ImportCVModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [importedData, setImportedData] = useState<CVData | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    message: string;
    type: 'error' | 'success' | 'info' | 'warning' | null;
  }>({ message: '', type: null });

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      let errorMessage = 'Erreur lors du chargement du fichier';
      
      if (error.code === 'file-too-large') {
        errorMessage = 'Le fichier est trop volumineux. Taille maximum : 5MB';
      } else if (error.code === 'file-invalid-type') {
        errorMessage = 'Format de fichier non supporté. Utilisez PDF, DOC ou DOCX';
      }

      setUploadStatus({
        message: errorMessage,
        type: 'error'
      });
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus({
        message: 'Fichier sélectionné avec succès',
        type: 'success'
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  const handleImport = async () => {
    if (!selectedFile) {
      setUploadStatus({
        message: 'Veuillez sélectionner un fichier',
        type: 'warning'
      });
      return;
    }

    setLoading(true);
    setUploadStatus({
      message: 'Analyse du CV en cours...',
      type: 'info'
    });

    const formData = new FormData();
    formData.append('fichier', selectedFile);

    try {
      const response = await fetch('https://n8n.srv760758.hstgr.cloud/webhook-test/OCR', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = await response.json();

      if (!data) {
        throw new Error('Aucune donnée reçue du serveur');
      }

      // Transform the response into our CVData format
      const parsedData: CVData = {
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        skills: Array.isArray(data.skills) ? data.skills.map((skill: any) => 
          typeof skill === 'string' ? skill : skill.name || ''
        ).filter(Boolean) : [],
        experience: Array.isArray(data.experience) ? data.experience.map((exp: any) => ({
          company: exp.company || '',
          position: exp.position || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || ''
        })) : [emptyCV.experience[0]],
        education: Array.isArray(data.education) ? data.education.map((edu: any) => ({
          school: edu.school || '',
          degree: edu.degree || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          description: edu.description || ''
        })) : [emptyCV.education[0]]
      };

      setImportedData(parsedData);
      setUploadStatus({
        message: 'CV importé avec succès !',
        type: 'success'
      });
      toast.success('CV importé avec succès !');

    } catch (error) {
      console.error('Erreur d\'import:', error);
      
      let errorMessage = 'Une erreur est survenue lors de l\'import';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setUploadStatus({
        message: errorMessage,
        type: 'error'
      });
      toast.error(errorMessage);
      setImportedData(emptyCV);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (importedData) {
    return (
      <CVEditor
        initialData={importedData}
        onSave={(data) => {
          console.log('Saving CV data:', data);
          toast.success('CV enregistré avec succès !');
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-[#c026d3] to-[#9333ea] inline-block w-full text-transparent bg-clip-text">
          Importer un CV
        </h2>

        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-[#9333ea] bg-[#9333ea]/5" : "border-gray-300 hover:border-[#9333ea]"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <Upload className={cn(
                "w-12 h-12 mb-2 transition-colors",
                isDragActive ? "text-[#9333ea]" : "text-gray-400"
              )} />
              {selectedFile ? (
                <div className="flex items-center gap-2 text-[#9333ea]">
                  <File className="w-5 h-5" />
                  <span>{selectedFile.name}</span>
                </div>
              ) : (
                <>
                  <p className="text-lg font-medium text-gray-700">
                    Glissez votre CV ici
                  </p>
                  <p className="text-sm text-gray-500">
                    ou cliquez pour sélectionner un fichier
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Formats acceptés : PDF, DOC, DOCX (max 5MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {uploadStatus.message && (
            <div className={cn(
              "flex items-center gap-2 p-4 rounded-lg",
              uploadStatus.type === 'error' && "bg-red-50 text-red-700",
              uploadStatus.type === 'success' && "bg-green-50 text-green-700",
              uploadStatus.type === 'info' && "bg-blue-50 text-blue-700",
              uploadStatus.type === 'warning' && "bg-yellow-50 text-yellow-700"
            )}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{uploadStatus.message}</p>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={loading || !selectedFile}
            className={cn(
              "w-full py-3 px-4 bg-gradient-to-r from-[#c026d3] to-[#9333ea] text-white rounded-lg",
              "hover:from-[#a21caf] hover:to-[#7e22ce] transition-all duration-300",
              "shadow-lg shadow-[#9333ea]/25 hover:shadow-[#9333ea]/40",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Import en cours...
              </>
            ) : (
              'Importer le CV'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}