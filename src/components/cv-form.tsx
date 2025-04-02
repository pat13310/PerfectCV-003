import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Upload, Plus, Trash2, GripVertical, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import { ImportCVModal } from './import-cv-modal';
import { CVPreview } from './cv-preview';

// ... (keep all the existing interfaces and type definitions)

export function CVForm() {
  // ... (keep all the existing state and handlers)

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      {/* Keep all the existing content */}
      {/* ... */}

      {isPreviewOpen && (
        <CVPreview
          data={formData}
          onClose={() => setIsPreviewOpen(false)}
          onSave={(data) => {
            Object.entries(data).forEach(([key, value]) => {
              setValue(key as keyof FormData, value);
            });
            setIsPreviewOpen(false);
            toast.success('Modifications enregistrées !');
          }}
        />
      )}
    </div>
  );
}