import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import matieresServices from '../services/matieresServices/matieres.service';

/**
 * Custom hook for managing subject data fetching and state
 * Separates data fetching logic from UI components
 */
export const useSubjectData = (subjectId) => {
  const [formData, setFormData] = useState(null);
  const [fetchData, setFetchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isArchived, setIsArchived] = useState(false);
  const fetchRef = useRef(false);

  const fetchSubject = useCallback(
    async (force = false) => {
      try {
        if (!force) {
          setLoading(true);
        }
        setError(null);

        if (!force && fetchRef.current && formData?.subject?._id === subjectId) {
          return;
        }

        const response = await matieresServices.fetchMatiereById(subjectId);
        const { subject, archivedSubjects, archivedPagination, isArchived: archived } = response;

        if (!subject || !subject.curriculum || !Array.isArray(subject.curriculum.chapitres)) {
          throw new Error('Invalid subject data received from the server.');
        }

        setIsArchived(archived);
        setFetchData(subject);
        setFormData({
          subject: {
            ...subject,
            curriculum: {
              ...subject.curriculum,
              chapitres: subject.curriculum.chapitres.map((chapter) => ({
                ...chapter,
                sections: Array.isArray(chapter.sections) ? chapter.sections : [],
              })),
            },
          },
          history: Array.isArray(archivedSubjects) ? archivedSubjects : [],
          historyPagination: archivedPagination || null,
        });

        fetchRef.current = true;
      } catch (err) {
        const errorMessage = err.response?.message || err.message || 'Failed to load subject data.';
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [subjectId, formData?.subject?._id]
  );

  useEffect(() => {
    fetchSubject();
  }, [fetchSubject, subjectId]);

  return {
    formData,
    fetchData,
    loading,
    error,
    isArchived,
    fetchSubject,
    setFormData,
    fetchRef,
  };
};

