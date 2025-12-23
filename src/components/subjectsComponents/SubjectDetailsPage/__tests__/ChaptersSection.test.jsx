import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChaptersSection } from '../ChaptersSection';

describe('ChaptersSection', () => {
  const mockChapters = [
    {
      title: 'Chapter 1',
      status: true,
      completedAt: '2024-01-01',
      sections: [
        { title: 'Section 1', status: true, completedAt: '2024-01-01' },
        { title: 'Section 2', status: false },
      ],
    },
    {
      title: 'Chapter 2',
      status: false,
      sections: [{ title: 'Section 1', status: false }],
    },
  ];

  const defaultProps = {
    chapters: mockChapters,
    canEdit: true,
    completedAtDates: {},
    onToggleChapterStatus: vi.fn(),
    onToggleSectionStatus: vi.fn(),
    onDateChange: vi.fn(),
    onSaveProgress: vi.fn(),
    loadingBtnSubmit: false,
  };

  it('should render empty state when no chapters', () => {
    render(<ChaptersSection {...defaultProps} chapters={[]} />);
    expect(screen.getByText(/No chapters available/i)).toBeInTheDocument();
  });

  it('should render chapters list', () => {
    render(<ChaptersSection {...defaultProps} />);
    expect(screen.getByText('Chapter 1')).toBeInTheDocument();
    expect(screen.getByText('Chapter 2')).toBeInTheDocument();
  });

  it('should display overall progress', () => {
    render(<ChaptersSection {...defaultProps} />);
    // 1 out of 2 chapters completed = 50%
    expect(screen.getByText(/Overall Progress: 50%/i)).toBeInTheDocument();
  });

  it('should call onToggleChapterStatus when checkbox is clicked', () => {
    render(<ChaptersSection {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(defaultProps.onToggleChapterStatus).toHaveBeenCalledWith(0);
  });

  it('should expand chapter when header is clicked', () => {
    render(<ChaptersSection {...defaultProps} />);
    const chapterHeader = screen.getByText('Chapter 1').closest('div');
    fireEvent.click(chapterHeader);
    // Chapter should expand showing sections
    expect(screen.getByText('Section 1')).toBeInTheDocument();
  });

  it('should show save button when canEdit is true', () => {
    render(<ChaptersSection {...defaultProps} canEdit={true} />);
    expect(screen.getByText(/Update Status/i)).toBeInTheDocument();
  });

  it('should not show save button when canEdit is false', () => {
    render(<ChaptersSection {...defaultProps} canEdit={false} />);
    expect(screen.queryByText(/Update Status/i)).not.toBeInTheDocument();
  });

  it('should disable save button when loading', () => {
    render(<ChaptersSection {...defaultProps} loadingBtnSubmit={true} />);
    const button = screen.getByText(/Saving Progress/i);
    expect(button).toBeDisabled();
  });
});

