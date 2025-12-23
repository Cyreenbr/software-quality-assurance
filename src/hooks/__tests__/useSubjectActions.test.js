import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSubjectActions } from '../useSubjectActions';
import matieresServices from '../../services/matieresServices/matieres.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
vi.mock('../../services/matieresServices/matieres.service');
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

describe('useSubjectActions', () => {
  const mockSubjectId = '123';
  const mockUserRole = 'admin';
  const mockFetchSubject = vi.fn();
  const mockFetchRef = { current: false };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useSubjectActions(mockSubjectId, mockUserRole, mockFetchSubject, mockFetchRef)
    );

    expect(result.current.loadingBtn).toBe(false);
    expect(result.current.loadingBtnSubmit).toBe(false);
    expect(result.current.isDeletePopupOpen).toBe(false);
    expect(result.current.archive).toBe(false);
    expect(result.current.forced).toBe(false);
  });

  it('should handle delete successfully', async () => {
    matieresServices.deleteMatiere = vi.fn().mockResolvedValue({});
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    const { result } = renderHook(() =>
      useSubjectActions(mockSubjectId, mockUserRole, mockFetchSubject, mockFetchRef)
    );

    const deleteResult = await result.current.handleDelete(mockSubjectId, { forced: false, archive: false });

    expect(deleteResult).toBe(true);
    expect(toast.success).toHaveBeenCalledWith('Subject deleted successfully!');
    expect(navigate).toHaveBeenCalledWith('/subjects');
  });

  it('should handle delete error', async () => {
    const errorMessage = 'Delete failed';
    matieresServices.deleteMatiere = vi.fn().mockRejectedValue(new Error(errorMessage));
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    const { result } = renderHook(() =>
      useSubjectActions(mockSubjectId, mockUserRole, mockFetchSubject, mockFetchRef)
    );

    const deleteResult = await result.current.handleDelete(mockSubjectId, { forced: false, archive: false });

    expect(deleteResult).toBe(false);
    expect(toast.error).toHaveBeenCalled();
  });

  it('should handle form submit for admin', async () => {
    const mockData = { _id: '123', title: 'Test' };
    matieresServices.updateMatieres = vi.fn().mockResolvedValue({ message: 'Success' });

    const { result } = renderHook(() =>
      useSubjectActions(mockSubjectId, 'admin', mockFetchSubject, mockFetchRef)
    );

    await result.current.handleFormSubmit(mockData);

    expect(matieresServices.updateMatieres).toHaveBeenCalledWith(mockData);
    expect(toast.success).toHaveBeenCalled();
    expect(mockFetchSubject).toHaveBeenCalled();
  });

  it('should handle form submit for non-admin', async () => {
    const mockData = { _id: '123', title: 'Test' };
    matieresServices.addUpdatePropositionMatiere = vi.fn().mockResolvedValue({ message: 'Success' });

    const { result } = renderHook(() =>
      useSubjectActions(mockSubjectId, 'teacher', mockFetchSubject, mockFetchRef)
    );

    await result.current.handleFormSubmit(mockData);

    expect(matieresServices.addUpdatePropositionMatiere).toHaveBeenCalledWith(mockData);
    expect(toast.success).toHaveBeenCalled();
  });
});

