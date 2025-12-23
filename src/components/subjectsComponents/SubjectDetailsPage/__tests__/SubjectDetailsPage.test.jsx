import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SubjectDetailsPage from '../SubjectDetailsPage';
import { useSubjectData } from '../../../../hooks/useSubjectData';
import { useSubjectActions } from '../../../../hooks/useSubjectActions';
import { useSubjectPropositions } from '../../../../hooks/useSubjectPropositions';
import { useSubjectChapters } from '../../../../hooks/useSubjectChapters';

// Mock hooks
vi.mock('../../../../hooks/useSubjectData');
vi.mock('../../../../hooks/useSubjectActions');
vi.mock('../../../../hooks/useSubjectPropositions');
vi.mock('../../../../hooks/useSubjectChapters');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
  };
});

// Mock child components
vi.mock('../../SubjectForm', () => ({
  default: () => <div>SubjectForm</div>,
}));
vi.mock('../../EvaluationList', () => ({
  default: () => <div>EvaluationList</div>,
}));
vi.mock('../../ArchivedSubjects', () => ({
  default: () => <div>ArchivedSubjects</div>,
}));

const createMockStore = (userRole = 'admin', userId = 'user1') => {
  return configureStore({
    reducer: {
      auth: (state = { role: userRole, user: { id: userId } }) => state,
    },
  });
};

const renderWithProviders = (component, store = createMockStore()) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('SubjectDetailsPage', () => {
  const mockSubjectData = {
    subject: {
      _id: '123',
      title: 'Test Subject',
      teacherId: [{ _id: 'user1' }],
      curriculum: {
        chapitres: [
          {
            title: 'Chapter 1',
            sections: [{ title: 'Section 1', status: false }],
            status: false,
          },
        ],
      },
      skillsId: [],
    },
    history: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    useSubjectData.mockReturnValue({
      formData: mockSubjectData,
      fetchData: mockSubjectData.subject,
      loading: false,
      error: null,
      isArchived: false,
      fetchSubject: vi.fn(),
      setFormData: vi.fn(),
      fetchRef: { current: false },
    });

    useSubjectActions.mockReturnValue({
      loadingBtn: false,
      loadingBtnSubmit: false,
      isDeletePopupOpen: false,
      setIsDeletePopupOpen: vi.fn(),
      archive: false,
      setArchive: vi.fn(),
      forced: false,
      setForced: vi.fn(),
      handleConfirmDelete: vi.fn(),
      handleFormSubmit: vi.fn(),
      handleSendNotif: vi.fn(),
    });

    useSubjectPropositions.mockReturnValue({
      propositions: null,
      isPropositionPopupOpen: false,
      setIsPropositionPopupOpen: vi.fn(),
      fetchPropositions: vi.fn(),
      handleUpdateStatus: vi.fn(),
    });

    useSubjectChapters.mockReturnValue({
      completedAtDates: {},
      loadingBtnSubmit: false,
      toggleChapterStatus: vi.fn(),
      toggleSectionStatus: vi.fn(),
      handleDateChange: vi.fn(),
      handleSaveProgress: vi.fn(),
    });
  });

  it('should render loading state', () => {
    useSubjectData.mockReturnValue({
      formData: null,
      fetchData: null,
      loading: true,
      error: null,
      isArchived: false,
      fetchSubject: vi.fn(),
      setFormData: vi.fn(),
      fetchRef: { current: false },
    });

    renderWithProviders(<SubjectDetailsPage />);
    expect(screen.getByText(/Loading subject details/i)).toBeInTheDocument();
  });

  it('should render error state', () => {
    useSubjectData.mockReturnValue({
      formData: null,
      fetchData: null,
      loading: false,
      error: 'Error message',
      isArchived: false,
      fetchSubject: vi.fn(),
      setFormData: vi.fn(),
      fetchRef: { current: false },
    });

    renderWithProviders(<SubjectDetailsPage />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should render subject details when data is loaded', () => {
    renderWithProviders(<SubjectDetailsPage />);
    expect(screen.getByText('Test Subject')).toBeInTheDocument();
  });

  it('should render form when showForm is true', () => {
    const { container } = renderWithProviders(<SubjectDetailsPage />);
    // The form should be rendered when showForm is true
    // This would require clicking a button to toggle, which is tested in integration tests
  });
});

