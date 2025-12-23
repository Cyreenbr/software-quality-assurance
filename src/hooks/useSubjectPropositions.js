import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import matieresServices from '../services/matieresServices/matieres.service';
import { RoleEnum } from '../utils/userRoles';

/**
 * Custom hook for managing subject propositions
 * Separates proposition logic from UI components
 */
export const useSubjectPropositions = (subjectId, userRole, formData) => {
  const [propositions, setPropositions] = useState(null);
  const [isPropositionPopupOpen, setIsPropositionPopupOpen] = useState(false);

  const fetchPropositions = useCallback(async () => {
    if (userRole !== RoleEnum.ADMIN) {
      return;
    }

    try {
      setPropositions(null);
      const response = await matieresServices.fetchUpdatePropositionMatiere(subjectId);
      const hasChanged = JSON.stringify(response) !== JSON.stringify(propositions);

      if (hasChanged) {
        setPropositions(response || []);
      }
    } catch (err) {
      const errorMessage = err.response?.message || err.message || 'Failed to load subject data.';
      toast.error(errorMessage);
    }
  }, [subjectId, userRole, propositions]);

  useEffect(() => {
    if (formData?.subject?._id && userRole === RoleEnum.ADMIN) {
      fetchPropositions();
    }
  }, [formData?.subject?._id, subjectId, userRole, fetchPropositions]);

  const handleUpdateStatus = useCallback(
    async (propositionId, newStatus, fetchSubject) => {
      try {
        await matieresServices.validatePropositionMatiere(subjectId, propositionId, newStatus);
        toast.success(`Proposition ${newStatus ? 'approuvée' : 'refusée'} avec succès.`, {
          position: 'top-right',
        });

        setPropositions((prev) =>
          prev?.map((p) => (p._id === propositionId ? { ...p, isApproved: newStatus } : p))
        );
        fetchSubject(true);
        fetchPropositions();
      } catch (error) {
        toast.error(`Erreur : ${error}`, { position: 'top-right' });
      }
    },
    [subjectId, fetchPropositions]
  );

  return {
    propositions,
    isPropositionPopupOpen,
    setIsPropositionPopupOpen,
    fetchPropositions,
    handleUpdateStatus,
  };
};

