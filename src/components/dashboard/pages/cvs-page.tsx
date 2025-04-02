import React, { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  Loader2,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { CVCreationModal } from "../modals/cv-creation-modal";
import { CVEditor } from "../../cv-editor";
import { getSupabaseClient } from "../../../lib/supabase";
import { useAuthStore } from "../../../lib/store";
import { cn } from "../../../lib/utils";
import toast from "react-hot-toast";

interface CV {
  id: string;
  user_id: string;
  title: string;
  content: any;
  status: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cvTitle: string;
}

function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  cvTitle,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-4 text-red-600 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold">Supprimer le CV</h3>
        </div>

        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer le CV "{cvTitle}" ? Cette action
          est irréversible.
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

/**
 * Supprime des enregistrements liés à un CV dans une table spécifique.
 * @param supabase - Instance du client Supabase.
 * @param tableName - Nom de la table dans la base de données.
 * @param cvId - ID du CV lié aux enregistrements à supprimer.
 * @param columnName - Nom de la colonne contenant l'ID du CV (par défaut "cv_id").
 */
const deleteCVRelatedItems = async (
  supabase: any,
  tableName: string,
  cvId: string,
  columnName: string = "cv_id"
): Promise<void> => {
  try {
    // Vérifier les paramètres essentiels
    if (!tableName || !cvId) {
      console.warn("Nom de table ou ID de CV manquant.");
      return;
    }

    // Supprimer les enregistrements liés au CV
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq(columnName, cvId);

    return new Promise((resolve, reject) => {
      if (error) {
        console.error(
          `Erreur lors de la suppression des éléments de ${tableName}:`,
          error
        );
        reject(error);
      } else {
        console.log(`Éléments de ${tableName} supprimés avec succès.`);
        resolve();
      }
    });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression des éléments:",
      error
    );
  }
};

export function CVsPage() {
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cvs, setCVs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCV, setCurrentCV] = useState<CV | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    cv: CV | null;
  }>({
    isOpen: false,
    cv: null,
  });
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("cvs")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setCVs(data || []);
    } catch (error) {
      console.error("Error fetching CVs:", error);
      toast.error("Erreur lors du chargement des CVs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.cv) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from("cvs")
        .delete()
        .eq("id", deleteModal.cv.id);

      if (error) throw error;

      toast.success("CV supprimé avec succès");
      await fetchCVs();
    } catch (error) {
      console.error("Error deleting CV:", error);
      toast.error("Erreur lors de la suppression du CV");
    } finally {
      setDeleteModal({ isOpen: false, cv: null });
    }
  };

  const handleSaveCV = async (data: any) => {
    const supabase = getSupabaseClient();
    if (!supabase || !user) return;

    try {
      if (currentCV) {
        // Mise à jour du CV existant
        const { error: updateError } = await supabase
          .from("cvs")
          .update({
            title: data.title,
            content: data,
            summary: data.summary,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentCV.id);

        if (updateError) throw updateError;

        await deleteCVRelatedItems(supabase, "skills", currentCV.id);
        await deleteCVRelatedItems(supabase, "experiences", currentCV.id);
        await deleteCVRelatedItems(supabase, "educations", currentCV.id);
        await deleteCVRelatedItems(supabase, "hobbies", currentCV.id);

        // Insérer les nouvelles compétences
        const skillsPromises = data.skills.map(async (skill: any) => {
          const { error: skillError } = await supabase.from("skills").insert({
            name: skill.name,
            level: skill.level,
            cv_id: currentCV.id,
          });

          if (skillError) throw skillError;
        });

        // Insérer les nouvelles expériences
        const experiencesPromises = data.experience.map(
          async (experience: any) => {
            if (!experience.company || !experience.position) {
              console.warn("Expérience invalide : ", experience);
              return;
            }

            const { error: experienceError } = await supabase
              .from("experiences")
              .insert({
                cv_id: currentCV.id,
                company: experience.company,
                position: experience.position,
                start_date: experience.startDate || null,
                end_date: experience.endDate || null,
                description: experience.description || null,
              });

            if (experienceError) throw experienceError;
          }
        );

        // Insérer les nouvelles formations
        const educationsPromises = data.education.map(
          async (education: any) => {
            if (!education.school || !education.degree) {
              console.warn("Formation invalide : ", education);
              return;
            }
            const { error: educationError } = await supabase
              .from("educations")
              .insert({
                cv_id: currentCV.id,
                school: education.school,
                degree: education.degree,
                start_date: education.startDate || null,
                end_date: education.endDate || null,
                description: education.description || null,
              });
            if (educationError) throw educationError;
          }
        );

        // Insérer les nouveaux loisirs
        const hobbiesPromises = data.hobbies.map(
          async (hobby: any) => {
            if (!hobby.name) {
              console.warn("hobby invalide : ", hobby);
              return;
            }
            const { error: educationError } = await supabase
              .from("hobbies")
              .insert({
                cv_id: currentCV.id,
                name: hobby.name,
                description: hobby.description||null,
                  });
            if (educationError) throw educationError;
          }
        );

        await Promise.all([
          ...skillsPromises,
          ...experiencesPromises,
          ...educationsPromises,
          ...hobbiesPromises,
        ]);
        toast.success("CV mis à jour avec succès");
      } else {
        // Création d'un nouveau CV
        const { error: insertError, data: newCV } = await supabase
          .from("cvs")
          .insert([
            {
              user_id: user.id,
              title: data.title,
              content: data,
              status: "Brouillon",
              summary: data.summary,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        // Insérer les nouvelles compétences
        const skillsPromises = data.skills.map(async (skill: any) => {
          const { error: skillError } = await supabase.from("skills").insert({
            name: skill.name,
            level: skill.level,
            cv_id: newCV.id,
          });

          if (skillError) throw skillError;
        });

        // Insérer les nouvelles expériences
        const experiencesPromises = data.experience.map(
          async (experience: any) => {
            if (!experience.company || !experience.position) {
              console.warn("Expérience invalide : ", experience);
              return;
            }

            const { error: experienceError } = await supabase
              .from("experiences")
              .insert({
                cv_id: newCV.id,
                company: experience.company,
                position: experience.position,
                start_date: experience.startDate || null,
                end_date: experience.endDate || null,
                description: experience.description || null,
              });

            if (experienceError) throw experienceError;
          }
        );

        // Insérer les nouvelles formations
        const educationsPromises = data.educations.map(
          async (education: any) => {
            if (!education.school || !education.degree) {
              console.warn("Formation invalide : ", education);
              return;
            }

            const { error: educationError } = await supabase
              .from("educations")
              .insert({
                cv_id: newCV.id,
                school: education.school,
                degree: education.degree,
                start_date: education.startDate || null,
                end_date: education.endDate || null,
                description: education.description || null,
              });

            if (educationError) throw educationError;
          }
        );
        // Insérer les nouveaux loisirs
        const hobbiesPromises = data.hobbies.map(async (hobby: any) => {
          if (!hobby.name) {
            console.warn("hobby invalide : ", hobby);
            return;
          }
          const { error: educationError } = await supabase
            .from("hobbies")
            .insert({
              cv_id: newCV.id,
              name: hobby.name,
              description: hobby.description || null,
            });
          if (educationError) throw educationError;
        });

        await Promise.all([
          ...skillsPromises,
          ...experiencesPromises,
          ...educationsPromises,
          ...hobbiesPromises
        ]);
        
        // Envoi d'une notification de succès
        toast.success("CV créé avec succès");
      }

      // Mise à jour du profil utilisateur
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: data.fullName,
          email: data.email,
          phone: data.phone || null,
          address: data.address || null,
          summary: data.summary || null,
        },
        {
          onConflict: "id",
        }
      );

      if (profileError) throw profileError;

      await fetchCVs();
      setIsEditing(false);
      setCurrentCV(null);
      setIsCreationModalOpen(false);
    } catch (error) {
      console.error("Error saving CV:", error);
      toast.error("Erreur lors de l'enregistrement du CV");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date)
      .toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace("à", "à");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#9333ea]" />
      </div>
    );
  }

  if (isEditing && currentCV) {
    return (
      <CVEditor
        initialData={{
          title: currentCV.title,
          ...currentCV.content,
        }}
        onSave={handleSaveCV}
        onClose={() => {
          setIsEditing(false);
          setCurrentCV(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Mes CVs</h2>
        <button
          onClick={() => setIsCreationModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#9333ea] text-white rounded-lg hover:bg-[#7e22ce] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nouveau CV</span>
        </button>
      </div>

      {cvs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-gray-900 mb-3">Aucun CV</h3>
          <p className="text-gray-500 text-lg">
            Commencez par créer votre premier CV
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {cvs.map((cv) => (
            <div
              key={cv.id}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:border-[#9333ea]/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-[#9333ea]/10 rounded-xl">
                    <FileText className="w-6 h-6 text-[#9333ea]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-gray-700">
                      {cv.title}
                    </h3>
                    <p className="text-base text-gray-500">
                      Modifié le {formatDate(cv.updated_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span
                    className={cn(
                      "px-3 py-1 text-base rounded-lg font-medium",
                      cv.status === "Publié"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    )}
                  >
                    {cv.status}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setCurrentCV(cv);
                        setIsEditing(true);
                      }}
                      className="p-2.5 text-gray-600 hover:text-[#9333ea] hover:bg-[#9333ea]/10 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, cv })}
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

      <CVCreationModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        onCVCreated={fetchCVs}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, cv: null })}
        onConfirm={handleDelete}
        cvTitle={deleteModal.cv?.title || ""}
      />
    </div>
  );
}
