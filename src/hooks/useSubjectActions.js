import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import matieresServices from '../services/matieresServices/matieres.service';
import { RoleEnum } from '../utils/userRoles';

/**
 * Custom hook for managing subject actions (delete, update, etc.)
 * Separates business logic from UI components
 */
export const useSubjectActions = (subjectId, userRole, fetchSubject, fetchRef) => {
  const navigate = useNavigate();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [archive, setArchive] = useState(false);
  const [forced, setForced] = useState(false);

  const handleDelete = useCallback(
    async (id, { forced: forceDelete = false, archive: archiveDelete = false }) => {
      try {
        await matieresServices.deleteMatiere(id, {
          forced: forceDelete,
          archive: archiveDelete,
        });
        toast.success('Subject deleted successfully!');
        navigate('/subjects');
        return true;
      } catch (error) {
        const errorMessage = error?.message || error || 'Failed to delete subject:';
        toast.error(errorMessage);
        return false;
      }
    },
    [navigate]
  );

  const handleConfirmDelete = useCallback(async () => {
    const deleteSuccess = await handleDelete(subjectId, { forced, archive });
    if (deleteSuccess === true) {
      setIsDeletePopupOpen(false);
    }
  }, [subjectId, forced, archive, handleDelete]);

  const handleFormSubmit = useCallback(
    async (updatedData) => {
      setLoadingBtnSubmit(true);
      try {
        let data;
        if (userRole === RoleEnum.ADMIN) {
          data = await matieresServices.updateMatieres(updatedData);
        } else {
          data = await matieresServices.addUpdatePropositionMatiere(updatedData);
        }

        fetchRef.current = false;
        fetchSubject();
        toast.success(data.message || 'Proposition update for Subject have been added successfully!');
        return true;
      } catch (error) {
        toast.error('Failed to update subject: ' + error);
        return false;
      } finally {
        setLoadingBtnSubmit(false);
      }
    },
    [userRole, fetchSubject, fetchRef]
  );

  const handleSendNotif = useCallback(
    async (id) => {
      setLoadingBtn(true);
      try {
        const result = await matieresServices.sendEvaluationNotif(id);
        toast.success(result.message);
      } catch (error) {
        toast.error(error.toString());
      } finally {
        setLoadingBtn(false);
      }
    },
    []
  );

  return {
    loadingBtn,
    loadingBtnSubmit,
    isDeletePopupOpen,
    setIsDeletePopupOpen,
    archive,
    setArchive,
    forced,
    setForced,
    handleDelete,
    handleConfirmDelete,
    handleFormSubmit,
    handleSendNotif,
  };
};

