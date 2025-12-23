import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import matieresServices from '../services/matieresServices/matieres.service';
import { prepareChaptersForSubmission } from '../utils/subjectProgress';

/**
 * Custom hook for managing chapter and section status updates
 * Separates chapter management logic from UI components
 */
export const useSubjectChapters = (formData, setFormData, subjectId, fetchSubject, fetchRef) => {
  const [completedAtDates, setCompletedAtDates] = useState({});
  const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false);

  const toggleChapterStatus = useCallback(
    (index) => {
      setFormData((prevData) => {
        if (!prevData?.subject?.curriculum?.chapitres) {
          return prevData;
        }

        const updatedChapters = prevData.subject.curriculum.chapitres.map((chapter, i) => {
          if (i === index) {
            const newStatus = !chapter.status;
            return {
              ...chapter,
              status: newStatus,
              completedDate: newStatus ? new Date().toISOString() : null,
            };
          }
          return chapter;
        });

        return {
          ...prevData,
          subject: {
            ...prevData.subject,
            curriculum: {
              ...prevData.subject.curriculum,
              chapitres: updatedChapters,
            },
          },
        };
      });
    },
    [setFormData]
  );

  const toggleSectionStatus = useCallback(
    (chapterIndex, sectionIndex) => {
      setFormData((prevData) => {
        if (!prevData?.subject?.curriculum?.chapitres) {
          return prevData;
        }

        const updatedChapters = prevData.subject.curriculum.chapitres.map((chapter, cIndex) => {
          if (cIndex === chapterIndex) {
            const updatedSections = chapter.sections.map((section, sIndex) => {
              if (sIndex === sectionIndex) {
                const newStatus = !section.status;
                return {
                  ...section,
                  status: newStatus,
                  completedDate: newStatus ? new Date().toISOString() : null,
                };
              }
              return section;
            });
            return { ...chapter, sections: updatedSections };
          }
          return chapter;
        });

        return {
          ...prevData,
          subject: {
            ...prevData.subject,
            curriculum: {
              ...prevData.subject.curriculum,
              chapitres: updatedChapters,
            },
          },
        };
      });
    },
    [setFormData]
  );

  const handleDateChange = useCallback((key, date) => {
    setCompletedAtDates((prev) => ({
      ...prev,
      [key]: date,
    }));
  }, []);

  const handleSaveProgress = useCallback(async () => {
    setLoadingBtnSubmit(true);
    try {
      if (!formData?.subject?.curriculum?.chapitres) {
        throw new Error('No chapters to update');
      }

      const updatedChapters = prepareChaptersForSubmission(formData.subject.curriculum.chapitres, completedAtDates);

      const payload = {
        curriculum: {
          ...formData.subject.curriculum,
          chapitres: updatedChapters,
        },
        _id: subjectId,
      };

      await matieresServices.updateMatiereAvancement(payload);
      toast.success('Subject Advancements updated successfully!');
      fetchRef.current = false;
      fetchSubject();
    } catch (err) {
      const errorMessage = err.message || err || 'Failed to update subject advancement.';
      toast.error(errorMessage);
    } finally {
      setLoadingBtnSubmit(false);
    }
  }, [formData, completedAtDates, subjectId, fetchSubject, fetchRef]);

  return {
    completedAtDates,
    loadingBtnSubmit,
    toggleChapterStatus,
    toggleSectionStatus,
    handleDateChange,
    handleSaveProgress,
  };
};

