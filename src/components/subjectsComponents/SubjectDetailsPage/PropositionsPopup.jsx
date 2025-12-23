import { FiFileText, FiCheckCircle, FiXCircle, FiClock, FiUser, FiCalendar } from 'react-icons/fi';
import Popup from '../../skillsComponents/Popup';
import humanizeDate from '../../../utils/humanizeDate';
import { CurriculumChapters } from '../CurriculumChapters';
import { SkillList } from '../SkillList';

/**
 * PropositionsPopup Component
 * Displays curriculum change proposals for admin review
 * Separated for better modularity and testability
 */
export const PropositionsPopup = ({ isOpen, onClose, propositions, onUpdateStatus }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Popup isOpen={isOpen} onClose={onClose} position="center" size="lg" showCloseButton>
      <div className="max-w-3xl mx-auto text-left">
        <h2 className="text-2xl font-bold text-blue-800 mb-8 text-center flex items-center justify-center gap-2">
          <FiFileText className="text-2xl" /> Curriculum Change Proposals
        </h2>

        {propositions === null ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : Array.isArray(propositions) && propositions.length === 0 ? (
          <p className="text-gray-500 text-center">No proposals available.</p>
        ) : (
          <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2">
            {propositions.map((p) => (
              <div key={p._id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm relative">
                {/* Status */}
                <div className="absolute top-4 right-4 text-sm space-y-1 text-right">
                  {p.isApproved === true ? (
                    <div className="text-green-600 space-y-1">
                      <div className="flex items-center justify-end gap-1 font-semibold">
                        <FiCheckCircle />
                        <span>Approved</span>
                      </div>
                      <div className="flex items-center justify-end gap-1 text-xs text-gray-600">
                        <FiUser /> <span><b>{`${p.reviewer?.firstName} ${p.reviewer?.lastName}`}</b></span>
                      </div>
                      {p.reviewDate && (
                        <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                          <FiCalendar />
                          <span>
                            on <b>{humanizeDate(p.reviewDate, true)}</b>
                          </span>
                        </div>
                      )}
                    </div>
                  ) : p.isApproved === false ? (
                    <div className="text-red-600 space-y-1">
                      <div className="flex items-center justify-end gap-1 font-semibold">
                        <FiXCircle />
                        <span>Declined</span>
                      </div>
                      <div className="flex items-center justify-end gap-1 text-xs text-gray-600">
                        <FiUser /> <span><b>{`${p.reviewer?.firstName} ${p.reviewer?.lastName}`}</b></span>
                      </div>
                      {p.reviewDate && (
                        <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                          <FiCalendar />
                          <span>
                            on <b>{humanizeDate(p.reviewDate, true)}</b>
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-yellow-600">
                      <div className="flex items-center justify-end gap-1 font-semibold">
                        <FiClock />
                        <span>Pending</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Header */}
                <div className="mb-2">
                  <p className="text-base font-semibold text-gray-700">
                    📚 Proposed by <span className="text-blue-600">{`${p.teacherId[0].firstName} ${p.teacherId[0].lastName}`}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <FiCalendar className="text-sm" />
                    {humanizeDate(p.createdAt, true)}
                  </p>
                </div>

                {/* Reason */}
                <div className="mb-1 mt-5 bg-gray-50 border rounded-md p-2">
                  <p className="text-sm text-gray-700">
                    <strong>📝 Reason:</strong> {p.reason}
                  </p>
                </div>

                {/* Curriculum details */}
                <div className="bg-gray-50 border rounded-lg p-4 text-sm space-y-2">
                  <p className="text-center">
                    <strong>Proposed Curriculum </strong>
                  </p>
                  <p>
                    <strong>🗓️ Semester:</strong> {p.curriculum?.semestre}
                  </p>
                  <p>
                    <strong>🌐 Language:</strong> {p.curriculum?.langue}
                  </p>
                  <p>
                    <strong>⏱️ Total Hours:</strong> {p.curriculum?.volume_horaire_total}
                  </p>
                  <p>
                    <strong>📖 Teaching Type:</strong> {p.curriculum?.type_enseignement}
                  </p>

                  {Array.isArray(p.curriculum?.prerequis_recommandes) && p.curriculum.prerequis_recommandes.length > 0 && (
                    <p>
                      <strong>✅ Prerequisites:</strong> {p.curriculum.prerequis_recommandes.join(', ')}
                    </p>
                  )}

                  {Array.isArray(p.curriculum?.chapitres) && p.curriculum.chapitres.length > 0 && (
                    <CurriculumChapters curriculum={p.curriculum} />
                  )}

                  <div>
                    <strong>💡 Skills:</strong>
                    <SkillList skills={p.skillsId} />
                  </div>
                </div>

                {/* Buttons */}
                {p.isApproved === null && (
                  <div className="flex justify-end gap-3 mt-5">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-800 text-sm transition"
                      onClick={() => onUpdateStatus(p._id, true)}
                    >
                      <FiCheckCircle /> Approve
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 text-sm transition"
                      onClick={() => onUpdateStatus(p._id, false)}
                    >
                      <FiXCircle /> Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Popup>
  );
};

