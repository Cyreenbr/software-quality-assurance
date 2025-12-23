import { useState } from 'react';
import { FaHistory } from 'react-icons/fa';
import { FiBook, FiCalendar, FiCheckCircle, FiLayers, FiUser, FiXCircle, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { MdTitle } from 'react-icons/md';
import Popup from '../../skillsComponents/Popup';
import humanizeDate from '../../../utils/humanizeDate';

/**
 * HistorySection Component
 * Displays subject history for non-students
 * Separated for better modularity
 */

const Section = ({ title, icon, children }) => (
  <section className="p-6 border-b border-gray-200 last:border-none">
    <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4 gap-2">
      {icon && <span>{icon}</span>}
      {title}
    </h2>
    {children}
  </section>
);

const EmptyState = ({ message }) => <p className="text-sm text-gray-500 text-center py-4">{message}</p>;

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md">
    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
      {typeof label === 'string' ? <span>{label}</span> : label}
    </div>
    <div className="text-base font-normal text-gray-800">{value}</div>
  </div>
);

const Pill = ({ children, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    gray: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${colorClasses[color]}`}>
      {children}
    </span>
  );
};

export const HistorySection = ({ history }) => {
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleChapters, setVisibleChapters] = useState({});

  const toggleSectionVisibility = (chapterId) => {
    setVisibleChapters((prevState) => ({
      ...prevState,
      [chapterId]: !prevState[chapterId],
    }));
  };

  if (!history || history.length === 0) {
    return (
      <Section title="History" icon={<FaHistory className="text-gray-500" />}>
        <EmptyState message="No history available" />
      </Section>
    );
  }

  return (
    <>
      <Section title="History" icon={<FaHistory className="text-gray-500" />}>
        <ul className="list-none text-gray-700 space-y-2">
          {history.map((historyItem, index) => (
            <li
              key={index}
              onClick={() => {
                setSelectedHistory(historyItem);
                setIsModalOpen(true);
              }}
              className="cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors flex justify-between items-center"
            >
              <span className="flex items-center gap-2">
                <strong>{historyItem.title}</strong> - {new Date(historyItem.modifiedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* History Popup */}
      {isModalOpen && selectedHistory && (
        <Popup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} position="center" showCloseButton zindex="z-50">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
              <MdTitle className="text-2xl text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">History Overview</h2>
            </div>

            {/* Title */}
            <DetailRow
              label={
                <span className="flex items-center gap-2 text-gray-600 font-medium">
                  <MdTitle className="text-lg text-indigo-500" />
                  Title
                </span>
              }
              value={selectedHistory.title}
            />

            {/* Modified At */}
            <DetailRow
              label={
                <span className="flex items-center gap-2 text-gray-600 font-medium">
                  <FiCalendar className="text-lg text-indigo-500" />
                  Modified At
                </span>
              }
              value={humanizeDate(selectedHistory.modifiedAt, true)}
            />

            {/* Teachers */}
            <DetailRow
              label={
                <span className="flex items-center gap-2 text-gray-600 font-medium">
                  <FiBook className="text-lg text-indigo-500" />
                  Teacher
                </span>
              }
              value={
                selectedHistory.teacherId.length > 0
                  ? selectedHistory.teacherId.map((t) => `${t.firstName} ${t.lastName} (${t.email})`).join(', ')
                  : 'None'
              }
            />

            {/* Chapters & Sections */}
            <DetailRow
              label={
                <span className="flex items-center gap-2 text-gray-600 font-medium">
                  <FiLayers className="text-lg text-indigo-500" />
                  Chapters ({selectedHistory.curriculum.chapitres.length})
                </span>
              }
              value={
                selectedHistory.curriculum.chapitres.length > 0 ? (
                  <div className="space-y-2">
                    {selectedHistory.curriculum.chapitres.map((chapter) => {
                      const sectionsVisible = visibleChapters[chapter._id];
                      const sectionCount = chapter.sections.length;

                      return (
                        <div
                          key={chapter._id}
                          className="p-3 border rounded-md bg-gray-50 hover:bg-blue-50 cursor-pointer transition"
                          onClick={() => sectionCount > 0 && toggleSectionVisibility(chapter._id)}
                        >
                          {/* Chapter Header */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <FiBook className="text-blue-600" />
                              <span className="font-semibold text-gray-800">{chapter.title}</span>
                              <span className="text-sm text-gray-500">
                                ({sectionCount} {sectionCount === 1 ? 'section' : 'sections'})
                              </span>
                            </div>
                            {sectionCount > 0 && (
                              <span className="text-gray-500">{sectionsVisible ? <FiChevronDown /> : <FiChevronRight />}</span>
                            )}
                          </div>

                          {/* Sections */}
                          {sectionsVisible && sectionCount > 0 && (
                            <div className="ml-6 mt-2 space-y-1">
                              {chapter.sections.map((section) => (
                                <div key={section._id} className="flex items-center gap-2 text-sm text-gray-700">
                                  {section.completedAt ? (
                                    <FiCheckCircle className="text-green-500" />
                                  ) : (
                                    <FiXCircle className="text-red-400" />
                                  )}
                                  <span>{section.title}</span>
                                  {section.completedAt && (
                                    <span className="text-gray-500 text-xs">
                                      (Completed {humanizeDate(section.completedAt)})
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Empty section */}
                          {sectionsVisible && sectionCount === 0 && (
                            <div className="ml-6 text-gray-500 text-sm">No sections</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-gray-500">None</span>
                )
              }
            />

            {/* Skills */}
            <DetailRow
              label={
                <span className="flex items-center gap-2 text-gray-600 font-medium">
                  <FiCheckCircle className="text-lg text-indigo-500" />
                  Skills
                </span>
              }
              value={
                selectedHistory.skillsId.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedHistory.skillsId.map((s, idx) => {
                      const hasFamilies = s.familyId && s.familyId.length > 0;
                      const familyTitles = hasFamilies ? s.familyId.map((f) => f.title).join(', ') : '';

                      return (
                        <Pill key={idx} color={hasFamilies ? 'blue' : 'gray'}>
                          {s.title}
                          {hasFamilies && <span className="ml-1 text-xs">({familyTitles})</span>}
                        </Pill>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-gray-500">None</span>
                )
              }
            />
          </div>
        </Popup>
      )}
    </>
  );
};

