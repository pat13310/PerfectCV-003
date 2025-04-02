import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Trash2, GripVertical, Save, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface FormData {
  title: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  skills: {
    id: string;
    name: string;
    level: number;
  }[];
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
}

interface CVEditorProps {
  initialData?: Partial<FormData>;
  onSave?: (data: FormData) => void;
  onClose?: () => void;
}

export function CVEditor({ initialData, onSave, onClose }: CVEditorProps) {
  const [newSkill, setNewSkill] = useState('');
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title || 'Nouveau CV',
      fullName: initialData?.fullName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      summary: initialData?.summary || '',
      skills: initialData?.skills || [],
      experience: initialData?.experience || [{
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      }],
      education: initialData?.education || [{
        school: '',
        degree: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }
  });

  const skills = watch('skills');
  const experience = watch('experience');
  const education = watch('education');

  const onSubmit = (data: FormData) => {
    if (onSave) {
      onSave(data);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setValue('skills', [...skills, {
        id: String(Date.now()),
        name: newSkill.trim(),
        level: 3
      }]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setValue('skills', skills.filter((_, i) => i !== index));
  };

  const updateSkillLevel = (index: number, level: number) => {
    const newSkills = [...skills];
    newSkills[index].level = level;
    setValue('skills', newSkills);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(skills);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setValue('skills', items);
  };

  const addExperience = () => {
    setValue('experience', [...experience, {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  };

  const removeExperience = (index: number) => {
    setValue('experience', experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setValue('education', [...education, {
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  };

  const removeEducation = (index: number) => {
    setValue('education', education.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="min-h-screen w-full py-8">
        <div className="bg-white max-w-4xl mx-auto rounded-lg shadow-xl">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex-1">
              <input
                type="text"
                {...register('title')}
                className="text-3xl font-bold bg-transparent border-0 focus:ring-0 focus:outline-none w-full"
                placeholder="Titre du CV"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleSubmit(onSubmit)}
                className="flex items-center gap-2 px-4 py-2 bg-[#9333ea] text-white rounded-lg hover:bg-[#7e22ce] transition-colors"
              >
                <Save className="w-5 h-5" />
                Enregistrer
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          <div className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                    <input
                      type="text"
                      {...register('fullName')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Adresse</label>
                    <input
                      type="text"
                      {...register('address')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                      placeholder="123 rue Example, 75000 Paris"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Résumé professionnel</h2>
                <textarea
                  {...register('summary')}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                  placeholder="Décrivez brièvement votre profil et vos objectifs professionnels"
                />
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Compétences</h2>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Ajouter une compétence"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-[#9333ea] text-white rounded-lg hover:bg-[#7e22ce] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="skills">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {skills.map((skill, index) => (
                          <Draggable 
                            key={skill.id} 
                            draggableId={String(skill.id)} 
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <span>{skill.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                      <button
                                        key={level}
                                        type="button"
                                        onClick={() => updateSkillLevel(index, level)}
                                        className={cn(
                                          "w-4 h-4 rounded-full",
                                          level <= skill.level ? "bg-[#9333ea]" : "bg-gray-200"
                                        )}
                                      />
                                    ))}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeSkill(index)}
                                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Expérience professionnelle</h2>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="flex items-center gap-2 px-4 py-2 bg-[#9333ea] text-white rounded-lg hover:bg-[#7e22ce] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Ajouter
                  </button>
                </div>
                {experience.map((_, index) => (
                  <div key={index} className="mb-6 p-4 border rounded-lg group">
                    <div className="flex justify-end mb-2">
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Entreprise</label>
                        <input
                          type="text"
                          {...register(`experience.${index}.company`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                          placeholder="Nom de l'entreprise"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Poste</label>
                        <input
                          type="text"
                          {...register(`experience.${index}.position`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                          placeholder="Titre du poste"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date de début</label>
                        <input
                          type="date"
                          {...register(`experience.${index}.startDate`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                        <input
                          type="date"
                          {...register(`experience.${index}.endDate`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          {...register(`experience.${index}.description`)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                          placeholder="Décrivez vos responsabilités et réalisations"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Formation</h2>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="flex items-center gap-2 px-4 py-2 bg-[#9333ea] text-white rounded-lg hover:bg-[#7e22ce] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Ajouter
                  </button>
                </div>
                {education.map((_, index) => (
                  <div key={index} className="mb-6 p-4 border rounded-lg group">
                    <div className="flex justify-end mb-2">
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">École</label>
                        <input
                          type="text"
                          {...register(`education.${index}.school`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                          placeholder="Nom de l'établissement"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Diplôme</label>
                        <input
                          type="text"
                          {...register(`education.${index}.degree`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                          placeholder="Nom du diplôme"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date de début</label>
                        <input
                          type="date"
                          {...register(`education.${index}.startDate`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                        <input
                          type="date"
                          {...register(`education.${index}.endDate`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          {...register(`education.${index}.description`)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] focus:ring-[#9333ea]"
                          placeholder="Décrivez votre formation et vos réalisations"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}