import { useState } from 'react';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp, FaCalendarAlt, FaSave, FaSpinner } from 'react-icons/fa';
import Tooltip from '../../skillsComponents/tooltip';
import humanizeDate from '../../../utils/humanizeDate';
import { calculateOverallProgress, calculateChapterProgress } from '../../../utils/subjectProgress';

/**
 * ChaptersSection Component
 * Displays chapters and sections with progress tracking
 * Separated for better modularity and testability
 */

const EmptyState = ({ message }) => <p className="text-sm text-gray-500 text-center py-4">{message}</p>;

const Section = ({ title, icon, children }) => (
  <section className="p-6 border-b border-gray-200 last:border-none">
    <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4 gap-2">
      {icon && <span>{icon}</span>}
      {title}
    </h2>
    {children}
  </section>
);

export const ChaptersSection = ({
  chapters,
  canEdit,
  completedAtDates,
  onToggleChapterStatus,
  onToggleSectionStatus,
  onDateChange,
  onSaveProgress,
  loadingBtnSubmit,
}) => {
  const [expandedChapters, setExpandedChapters] = useState({});

  const toggleChapterExpand = (index) => {
    setExpandedChapters((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const overallProgress = calculateOverallProgress(chapters);

  if (!chapters || chapters.length === 0) {
    return (
      <Section title="Chapters & Sections">
        <EmptyState message="No chapters available." />
      </Section>
    );
  }

  return (
    <Section title="Chapters & Sections">
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700">Overall Progress: {overallProgress}%</label>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {chapters.map((chapter, index) => {
          const chapterKey = `chapter-${index}`;
          const isCompleted = chapter.status;
          const completedAt = chapter.completedAt || completedAtDates[chapterKey];
          const sectionCount = chapter.sections.length;
          const chapterProgress = calculateChapterProgress(chapter);

          return (
            <div
              key={index}
              className={`border rounded-2xl p-5 shadow-md transition-colors duration-200 ${
                isCompleted ? 'bg-teal-50 border-teal-400' : 'bg-red-50 border-red-300'
              }`}
            >
              {/* Chapter Header */}
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleChapterExpand(index)}>
                <h3 className={`text-xl font-semibold flex items-center gap-2 ${isCompleted ? 'text-teal-900' : 'text-red-800'}`}>
                  {chapter.title || `Chapter ${index + 1}`}
                  {isCompleted ? <FaCheck className="text-teal-700" /> : <FaTimes className="text-red-500" />}
                </h3>
                {expandedChapters[index] ? (
                  <Tooltip text="close" position="top">
                    <FaChevronUp className="text-gray-500" />
                  </Tooltip>
                ) : (
                  <Tooltip text="open" position="top" alwaysOn>
                    <FaChevronDown className="text-gray-500" />
                  </Tooltip>
                )}
              </div>

              {/* Number of Sections */}
              <div className="text-sm text-gray-600 mt-1">
                {sectionCount} {sectionCount === 1 ? 'Section' : 'Sections'}
              </div>

              {/* Chapter Checkbox */}
              {canEdit && (
                <div className="flex items-center mt-3 gap-3">
                  <input
                    type="checkbox"
                    checked={chapter.status}
                    onChange={() => onToggleChapterStatus(index)}
                    className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500 rounded"
                    aria-label={`Mark Chapter ${index + 1} as complete`}
                  />
                  <label className="text-sm text-gray-700">Mark as complete</label>
                </div>
              )}

              {/* Completed At + Input */}
              {isCompleted && (
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <span>
                      Completed :{' '}
                      {completedAt ? (
                        <span className="font-medium">{humanizeDate(completedAt)}</span>
                      ) : (
                        <span className="text-gray-400">Not yet updated</span>
                      )}
                    </span>
                  </div>

                  {canEdit && (
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600 mb-1">Completion Date:</label>
                      <input
                        type="date"
                        value={completedAtDates[chapterKey]?.split('T')[0] || new Date().toISOString().split('T')[0]}
                        onChange={(e) => onDateChange(chapterKey, e.target.value)}
                        className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Chapter Progress */}
              {chapter.sections.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600">Chapter Progress: {chapterProgress}%</label>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${chapterProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Sections */}
              {expandedChapters[index] && chapter.sections.length > 0 && (
                <ul className="mt-4 border-l-2 border-gray-300 pl-5 space-y-3">
                  {chapter.sections.map((section, sIndex) => {
                    const sectionKey = `section-${index}-${sIndex}`;
                    const sectionCompletedAt = completedAtDates[sectionKey] || section.completedAt;
                    const isSectionCompleted = section.status;

                    return (
                      <li
                        key={sIndex}
                        className={`flex justify-between items-start rounded-md p-2 transition-colors ${
                          isSectionCompleted ? 'bg-teal-100 border border-teal-400' : 'bg-red-100 border border-red-200'
                        }`}
                        title={isSectionCompleted && sectionCompletedAt ? `Completed ${humanizeDate(sectionCompletedAt)}` : undefined}
                      >
                        <div className={`flex flex-col items-start gap-1 text-base ${isSectionCompleted ? 'text-teal-900' : 'text-red-800'}`}>
                          <div className="flex items-center gap-2">
                            {sIndex + 1} - {section.title || `Section ${sIndex + 1}`}{' '}
                            {isSectionCompleted ? <FaCheck className="text-teal-700 ml-1" /> : <FaTimes className="text-red-500 ml-1" />}
                          </div>

                          {isSectionCompleted && (
                            <>
                              <div className="flex items-center text-sm text-gray-700 gap-2">
                                <FaCalendarAlt />
                                <span>
                                  Completed :{' '}
                                  {sectionCompletedAt ? (
                                    <span className="font-medium">{humanizeDate(sectionCompletedAt)}</span>
                                  ) : (
                                    <span className="text-gray-400">Not yet updated</span>
                                  )}
                                </span>
                              </div>

                              {canEdit && (
                                <div className="mt-1">
                                  <label className="block text-sm text-gray-600 mb-1">Completion Date:</label>
                                  <input
                                    type="date"
                                    value={
                                      completedAtDates[sectionKey]
                                        ? completedAtDates[sectionKey].split('T')[0]
                                        : new Date().toISOString().split('T')[0]
                                    }
                                    onChange={(e) => onDateChange(sectionKey, e.target.value)}
                                    className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {canEdit && (
                            <input
                              type="checkbox"
                              checked={isSectionCompleted}
                              onChange={() => onToggleSectionStatus(index, sIndex)}
                              className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500 rounded"
                              aria-label={`Mark Section ${sIndex + 1} as complete`}
                            />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {chapters.length > 0 && canEdit && (
        <div className="flex justify-end mt-8">
          <button
            onClick={onSaveProgress}
            disabled={loadingBtnSubmit}
            aria-label={loadingBtnSubmit ? 'Saving progress' : 'Update status'}
            className={`px-6 py-2 font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 ${
              loadingBtnSubmit ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loadingBtnSubmit ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving Progress
              </>
            ) : (
              <>
                <FaSave />
                Update Status
              </>
            )}
          </button>
        </div>
      )}
    </Section>
  );
};

