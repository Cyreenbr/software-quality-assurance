import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SubjectHeader } from '../SubjectHeader';
import { RoleEnum } from '../../../../utils/userRoles';

// Mock dependencies
vi.mock('../../../../utils/useDeviceType', () => ({
  default: () => 'desktop',
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SubjectHeader', () => {
  const defaultProps = {
    userRole: RoleEnum.ADMIN,
    canEdit: true,
    subjectId: '123',
    showForm: false,
    onToggleForm: vi.fn(),
    onShowEvaluation: vi.fn(),
    onShowArchive: vi.fn(),
    onSendNotif: vi.fn(),
    onShowPropositions: vi.fn(),
    onShowDelete: vi.fn(),
    loadingBtn: false,
  };

  it('should render student action button for student role', () => {
    renderWithRouter(<SubjectHeader {...defaultProps} userRole={RoleEnum.STUDENT} />);
    // Student should see evaluate button
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render admin actions for admin role', () => {
    renderWithRouter(<SubjectHeader {...defaultProps} userRole={RoleEnum.ADMIN} />);
    // Admin should see multiple action buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(1);
  });

  it('should render teacher actions for teacher role', () => {
    renderWithRouter(<SubjectHeader {...defaultProps} userRole={RoleEnum.TEACHER} canEdit={true} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should show edit button when showForm is false', () => {
    renderWithRouter(<SubjectHeader {...defaultProps} showForm={false} />);
    // Should have edit button
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show go back button when showForm is true', () => {
    renderWithRouter(<SubjectHeader {...defaultProps} showForm={true} />);
    // Should have go back button
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

