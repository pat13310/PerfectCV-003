import React, { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";
import { cn } from "../lib/utils";
import { AISettingsModal } from "../ai-settings-modal"; // Update the path to the correct location
import { useAuthStore } from "../lib/store";

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
  hobbies: {
    name: string;
    description: string;
  }[];
}

interface CVEditorProps {
  initialData?: Partial<FormData>;
  onSave?: (data: FormData) => void;
  onClose?: () => void;
}

interface SortableSkillItemProps {
  id: string;
  name: string;
  level: number;
  onRemove: () => void;
  onLevelChange: (level: number) => void;
}

function SortableSkillItem({
  id,
  name,
  level,
  onRemove,
  onLevelChange,
}: SortableSkillItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <span>{name}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onLevelChange(value)}
              className={cn(
                "w-4 h-4 rounded-full",
                value <= level ? "bg-[#9333ea]" : "bg-gray-200"
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function CVEditor({ initialData, onSave, onClose }: CVEditorProps) {
  const [newSkill, setNewSkill] = useState("");
  const [showAISettings, setShowAISettings] = useState(false);
  const aiConfig = useAuthStore((state) => state.aiConfig);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title || "Nouveau CV",
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      summary: initialData?.summary || "",
      skills: initialData?.skills || [],
      experience: initialData?.experience || [
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: initialData?.education || [
        {
          school: "",
          degree: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      hobbies: initialData?.hobbies || [
        {
          name: "",
          description: "",
        },
      ],
    },
  });

  const skills = watch("skills");
  const experience = watch("experience");
  const education = watch("education");
  const hobbies = watch("hobbies");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onSubmit = (data: FormData) => {
    if (onSave) {
      onSave(data);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setValue("skills", [
        ...skills,
        {
          id: String(Date.now()),
          name: newSkill.trim(),
          level: 3,
        },
      ]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setValue(
      "skills",
      skills.filter((_, i) => i !== index)
    );
  };

  const updateSkillLevel = (index: number, level: number) => {
    const newSkills = [...skills];
    newSkills[index].level = level;
    setValue("skills", newSkills);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = skills.findIndex((skill) => skill.id === active.id);
      const newIndex = skills.findIndex((skill) => skill.id === over.id);

      setValue("skills", arrayMove(skills, oldIndex, newIndex));
    }
  };

  const addExperience = () => {
    setValue("experience", [
      ...experience,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setValue(
      "experience",
      experience.filter((_, i) => i !== index)
    );
  };

  const addEducation = () => {
    setValue("education", [
      ...education,
      {
        school: "",
        degree: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setValue(
      "education",
      education.filter((_, i) => i !== index)
    );
  };

  const addHobby = () => {
    setValue("hobbies", [
      ...hobbies,
      {
        name: "",
        description: "",
      },
    ]);
  };

  const removeHobby = (index: number) => {
    setValue(
      "hobbies",
      hobbies.filter((_, i) => i !== index)
    );
  };

  async function enhanceContent(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    const summary = watch("summary");

    if (!summary.trim()) {
      alert("Veuillez entrer un résumé avant de l'améliorer.");
      return;
    }

    if (!aiConfig.apiKey) {
      toast.error("Veuillez configurer votre clé API");
      setShowAISettings(true);
      return;
    }

    setIsEnhancing(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${aiConfig.apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "Tu es un expert en rédaction professionnelle française. Ta mission est d'améliorer le texte fourni pour le rendre plus professionnel, persuasif et impactant.",
              },
              {
                role: "user",
                content: `Améliore ce texte:\n\n${summary}`,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erreur OpenAI: ${errorData.error?.message || "Erreur inconnue"}`
        );
      }

      const data = await response.json();
      setValue("summary", data.choices[0].message.content);
      toast.success("Texte amélioré avec succès !");
    } catch (error) {
      console.error("Error enhancing content:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'amélioration du texte"
      );
    } finally {
      setIsEnhancing(false);
    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="min-h-screen w-full py-8">
        <div className="bg-white max-w-4xl mx-auto rounded-lg shadow-xl">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex-1">
              <input
                type="text"
                {...register("title")}
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
                <h2 className="text-xl font-semibold mb-4">
                  Informations personnelles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      {...register("fullName")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Adresse
                    </label>
                    <input
                      type="text"
                      {...register("address")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                      placeholder="123 rue Example, 75000 Paris"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Résumé</h2>
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
                </div>
                <textarea
                  {...register("summary")}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                  placeholder="Décrivez votre expérience et vos compétences"
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
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                    placeholder="Ajouter une compétence"
                    className="flex-1 rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-[#9333ea] text-white rounded-lg hover:bg-[#7e22ce] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={skills.map((skill) => skill.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {skills.map((skill, index) => (
                        <SortableSkillItem
                          key={skill.id}
                          id={skill.id}
                          name={skill.name}
                          level={skill.level}
                          onRemove={() => removeSkill(index)}
                          onLevelChange={(level) =>
                            updateSkillLevel(index, level)
                          }
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Expérience professionnelle
                  </h2>
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
                        <label className="block text-sm font-medium text-gray-700">
                          Entreprise
                        </label>
                        <input
                          type="text"
                          {...register(`experience.${index}.company`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                          placeholder="Nom de l'entreprise"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Poste
                        </label>
                        <input
                          type="text"
                          {...register(`experience.${index}.position`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9333ea] px-1 outline-indigo-500"
                          placeholder="Titre du poste"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date de début
                        </label>
                        <input
                          type="date"
                          {...register(`experience.${index}.startDate`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          {...register(`experience.${index}.endDate`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          {...register(`experience.${index}.description`)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
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
                        <label className="block text-sm font-medium text-gray-700">
                          École
                        </label>
                        <input
                          type="text"
                          {...register(`education.${index}.school`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                          placeholder="Nom de l'établissement"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Diplôme
                        </label>
                        <input
                          type="text"
                          {...register(`education.${index}.degree`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                          placeholder="Nom du diplôme"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date de début
                        </label>
                        <input
                          type="date"
                          {...register(`education.${index}.startDate`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          {...register(`education.${index}.endDate`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          {...register(`education.${index}.description`)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 outline-indigo-500"
                          placeholder="Décrivez votre formation et vos réalisations"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hobbies */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Centres d'intérêt</h2>
                  <button
                    type="button"
                    onClick={addHobby}
                    className="flex items-center gap-2 px-4 py-2 bg-[#9333ea] text-white rounded-lg hover:bg-[#7e22ce] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Ajouter
                  </button>
                </div>
                {hobbies.map((_, index) => (
                  <div key={index} className="mb-6 p-4 border rounded-lg group">
                    <div className="flex justify-end mb-2">
                      <button
                        type="button"
                        onClick={() => removeHobby(index)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nom
                        </label>
                        <input
                          type="text"
                          {...register(`hobbies.${index}.name`)}
                          className="mt-1 block w-full rounded-md shadow-sm px-1 outline-indigo-500"
                          placeholder="Ex: Photographie"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          {...register(`hobbies.${index}.description`)}
                          rows={3}
                          className="mt-1 block w-full rounded-md  shadow-sm px-1 outline-indigo-500"
                          placeholder="Décrivez votre centre d'intérêt"
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
      <AISettingsModal
        isOpen={showAISettings}
        onClose={() => setShowAISettings(false)}
      />
    </div>
  );
}
