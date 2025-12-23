import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBookOpen, FaHistory } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { useSubjectData } from '../../../hooks/useSubjectData';
import { useSubjectActions } from '../../../hooks/useSubjectActions';
import { useSubjectPropositions } from '../../../hooks/useSubjectPropositions';
import { useSubjectChapters } from '../../../hooks/useSubjectChapters';
import { RoleEnum } from '../../../utils/userRoles';
import PageLayout from '../../skillsComponents/PageLayout';
import Popup from '../../skillsComponents/Popup';
import SubjectForm from '../SubjectForm';
import EvaluationList from '../EvaluationList';
import ArchivedSubjects from '../ArchivedSubjects';
import { CurriculumChapters } from '../CurriculumChapters';
import { SkillList } from '../SkillList';
import { SubjectHeader } from './SubjectHeader';
import { SubjectStatusHeader } from './SubjectStatusHeader';
import { SubjectOverview } from './SubjectOverview';
import { ChaptersSection } from './ChaptersSection';
import { SkillsSection } from './SkillsSection';
import { DeleteConfirmationPopup } from './DeleteConfirmationPopup';
import { PropositionsPopup } from './PropositionsPopup';
import { HistorySection } from './HistorySection';

/**
 * SubjectDetailsPage - Refactored Component
 * Main component for displaying and managing subject details
 * 
 * Improvements:
 * - Separated data fetching into useSubjectData hook
 * - Separated actions into useSubjectActions hook
 * - Separated propositions into useSubjectPropositions hook
 * - Separated chapters management into useSubjectChapters hook
 * - Split UI into smaller, testable components
 * - Reduced complexity from 1408 lines to ~200 lines
 * - Better separation of concerns (SRP)
 * - Improved testability
 */

const ErrorState = ({ message }) => (
  <p className="text-red-600 text-center py-4">{message}</p>
);

const LoadingState = () => (
  <div className="flex justify-center items-center h-screen text-center">
    <div>
      <ClipLoader size={50} color="#3B82F6" />
      <p className="mt-4 font-bold text-gray-700">Loading subject details...</p>
    </div>
  </div>
);

const Section = ({ title, icon, children }) => (
  <section className="p-6 border-b border-gray-200 last:border-none">
    <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4 gap-2">
      {icon && <span>{icon}</span>}
      {title}
    </h2>
    {children}
  </section>
);

const SubjectDetailsPage = () => {
  const { id } = useParams();
  const userRole = useSelector((state) => state.auth.role);
  const userId = useSelector((state) => state.auth.user.id);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  // Data hooks
  const { formData, fetchData, loading, error, isArchived, fetchSubject, setFormData, fetchRef } = useSubjectData(id);

  // Actions hook
  const {
    loadingBtn,
    loadingBtnSubmit: actionsLoadingBtnSubmit,
    isDeletePopupOpen,
    setIsDeletePopupOpen,
    archive,
    setArchive,
    forced,
    setForced,
    handleConfirmDelete,
    handleFormSubmit,
    handleSendNotif,
  } = useSubjectActions(id, userRole, fetchSubject, fetchRef);

  // Propositions hook
  const {
    propositions,
    isPropositionPopupOpen,
    setIsPropositionPopupOpen,
    fetchPropositions,
    handleUpdateStatus,
  } = useSubjectPropositions(id, userRole, formData);

  // Chapters hook
  const {
    completedAtDates,
    loadingBtnSubmit: chaptersLoadingBtnSubmit,
    toggleChapterStatus,
    toggleSectionStatus,
    handleDateChange,
    handleSaveProgress,
  } = useSubjectChapters(formData, setFormData, id, fetchSubject, fetchRef);

  const canEdit = userId === formData?.subject?.teacherId[0]?._id;
  const confirmDeleteMessage = 'Are you sure you want to delete this subject?';
  const loadingBtnSubmit = actionsLoadingBtnSubmit || chaptersLoadingBtnSubmit;

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState message={error} />;
  }

  // Invalid data state
  if (!formData) {
    return <ErrorState message="Invalid subject data." />;
  }

  // Action handlers
  const toggleForm = () => setShowForm((prev) => !prev);

  const actionHeaders = (
    <SubjectHeader
      userRole={userRole}
      canEdit={canEdit}
      subjectId={id}
      showForm={showForm}
      onToggleForm={toggleForm}
      onShowEvaluation={() => setShowEvaluation(true)}
      onShowArchive={() => setShowArchive(true)}
      onSendNotif={handleSendNotif}
      onShowPropositions={() => {
        setIsPropositionPopupOpen(true);
        fetchPropositions();
      }}
      onShowDelete={() => setIsDeletePopupOpen(true)}
      loadingBtn={loadingBtn}
    />
  );

  return (
    <PageLayout title={formData.subject.title} headerActions={actionHeaders} icon={FaBookOpen}>
      {showForm ? (
        <SubjectForm
          initialData={fetchData}
          onSubmit={handleFormSubmit}
          onCancel={toggleForm}
          proposeEdit={canEdit}
        />
      ) : (
        <div className="w-full max-w-6xl mx-auto bg-white">
          {/* Status Header (Admin only) */}
          <SubjectStatusHeader subject={formData.subject} isArchived={isArchived} userRole={userRole} />

          {/* Overview Section */}
          <SubjectOverview subject={formData.subject} />

          {/* Chapters & Sections */}
          <ChaptersSection
            chapters={formData.subject.curriculum?.chapitres || []}
            canEdit={canEdit}
            completedAtDates={completedAtDates}
            onToggleChapterStatus={toggleChapterStatus}
            onToggleSectionStatus={toggleSectionStatus}
            onDateChange={handleDateChange}
            onSaveProgress={handleSaveProgress}
            loadingBtnSubmit={chaptersLoadingBtnSubmit}
          />

          {/* Skills Section */}
          <SkillsSection skills={formData.subject.skillsId || []} />

          {/* History Section (Non-students only) */}
          {userRole !== RoleEnum.STUDENT && (
            <HistorySection history={formData.history || []} />
          )}

          {/* Evaluation Popup */}
          <Popup
            isOpen={showEvaluation}
            onClose={() => setShowEvaluation(false)}
            position="center"
            size="lg"
            showCloseButton
          >
            <div className="max-w-3xl mx-auto text-left">
              <EvaluationList subjectId={fetchData._id} showHeader />
            </div>
          </Popup>

          {/* Archive Popup */}
          <Popup
            isOpen={showArchive}
            onClose={() => setShowArchive(false)}
            position="center"
            size="xl"
            showCloseButton
          >
            <div className="mx-auto text-left p-4">
              <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center flex items-center justify-center gap-2">
                <FaHistory className="text-3xl text-green-600" />
                Archive of this Subject
              </h3>
              <ArchivedSubjects subjectId={fetchData?._id} />
            </div>
          </Popup>

          {/* Propositions Popup */}
          <PropositionsPopup
            isOpen={isPropositionPopupOpen}
            onClose={() => setIsPropositionPopupOpen(false)}
            propositions={propositions}
            onUpdateStatus={(propositionId, newStatus) => handleUpdateStatus(propositionId, newStatus, fetchSubject)}
          />

          {/* Delete Confirmation Popup */}
          <DeleteConfirmationPopup
            isOpen={isDeletePopupOpen}
            onClose={() => setIsDeletePopupOpen(false)}
            onConfirm={handleConfirmDelete}
            archive={archive}
            setArchive={setArchive}
            forced={forced}
            setForced={setForced}
            confirmDeleteMessage={confirmDeleteMessage}
          />
        </div>
      )}
    </PageLayout>
  );
};

export default SubjectDetailsPage;

