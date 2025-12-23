import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSubjectData } from '../useSubjectData';
import matieresServices from '../../services/matieresServices/matieres.service';
import { toast } from 'react-toastify';

// Mock dependencies
vi.mock('../../services/matieresServices/matieres.service');
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useSubjectData', () => {
  const mockSubjectId = '123';
  const mockSubjectData = {
    subject: {
      _id: '123',
      title: 'Test Subject',
      curriculum: {
        chapitres: [
          {
            title: 'Chapter 1',
            sections: [{ title: 'Section 1', status: false }],
            status: false,
          },
        ],
      },
    },
    archivedSubjects: [],
    archivedPagination: null,
    isArchived: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch subject data successfully', async () => {
    matieresServices.fetchMatiereById = vi.fn().mockResolvedValue(mockSubjectData);

    const { result } = renderHook(() => useSubjectData(mockSubjectId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.formData).toBeTruthy();
    expect(result.current.formData.subject.title).toBe('Test Subject');
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    const errorMessage = 'Failed to load subject data.';
    matieresServices.fetchMatiereById = vi.fn().mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useSubjectData(mockSubjectId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it('should handle invalid subject data', async () => {
    const invalidData = {
      subject: null,
      archivedSubjects: [],
    };
    matieresServices.fetchMatiereById = vi.fn().mockResolvedValue(invalidData);

    const { result } = renderHook(() => useSubjectData(mockSubjectId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(toast.error).toHaveBeenCalled();
  });
});

