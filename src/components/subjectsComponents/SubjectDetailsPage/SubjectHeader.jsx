import { FaArchive, FaEdit, FaArrowLeft, FaStar, FaTrash, FaEye } from 'react-icons/fa';
import { FiBell } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../../skillsComponents/tooltip';
import { RoleEnum } from '../../../utils/userRoles';
import useDeviceType from '../../../utils/useDeviceType';

/**
 * SubjectHeader Component
 * Displays action buttons based on user role
 * Separated from main component for better modularity
 */
export const SubjectHeader = ({
  userRole,
  canEdit,
  subjectId,
  showForm,
  onToggleForm,
  onShowEvaluation,
  onShowArchive,
  onSendNotif,
  onShowPropositions,
  onShowDelete,
  loadingBtn,
}) => {
  const navigate = useNavigate();
  const deviceType = useDeviceType();
  const positionTooltip = deviceType !== 'mobile' ? 'bottom' : 'left';

  if (userRole === RoleEnum.STUDENT) {
    return (
      <Tooltip text="Evaluate Subject" position={positionTooltip}>
        <button
          onClick={() => navigate(`/subjects/${subjectId}/evaluation`)}
          className="flex justify-center items-center bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition duration-200 sm:w-auto w-full mb-2 sm:mb-0"
        >
          <FaStar className="mr-2" />
        </button>
      </Tooltip>
    );
  }

  if (userRole === RoleEnum.ADMIN || canEdit) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
        {userRole === RoleEnum.TEACHER && (
          <Tooltip text="View Evaluations" position={positionTooltip}>
            <button
              onClick={onShowEvaluation}
              className="flex items-center justify-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium shadow hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 sm:w-auto w-full"
            >
              <FaStar className="mr-2" />
            </button>
          </Tooltip>
        )}

        {userRole === RoleEnum.ADMIN && (
          <>
            <Tooltip text="Send Evaluation Notif to Students" position={positionTooltip}>
              <button
                onClick={() => onSendNotif(subjectId)}
                className="flex items-center justify-center gap-2 bg-gray-500 text-white px-5 py-2.5 rounded-xl font-medium shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 sm:w-auto w-full"
              >
                {loadingBtn ? <ClipLoader color="#ffffff" size={20} /> : <FiBell className="text-lg" />}
              </button>
            </Tooltip>

            <Tooltip text="Proposed Modifications" position={positionTooltip}>
              <button
                onClick={onShowPropositions}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium shadow hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 sm:w-auto w-full"
              >
                <FaEye className="text-lg" />
              </button>
            </Tooltip>

            <Tooltip text="Delete" position={positionTooltip}>
              <button
                onClick={onShowDelete}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium shadow hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200 sm:w-auto w-full"
              >
                <FaTrash className="text-lg" />
              </button>
            </Tooltip>

            <Tooltip text="View Evaluations" position={positionTooltip}>
              <button
                onClick={onShowEvaluation}
                className="flex items-center justify-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium shadow hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 sm:w-auto w-full"
              >
                <FaStar className="mr-2" />
              </button>
            </Tooltip>

            <Tooltip text="View Archive" position={positionTooltip}>
              <button
                onClick={onShowArchive}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-5 py-2.5 rounded-xl font-medium shadow hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 sm:w-auto w-full"
              >
                <FaArchive className="mr-2" />
              </button>
            </Tooltip>
          </>
        )}

        {showForm ? (
          <Tooltip text="Go Back" position={positionTooltip}>
            <button
              onClick={onToggleForm}
              className="flex justify-center items-center bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition duration-200 sm:w-auto w-full mb-2 sm:mb-0"
            >
              <FaArrowLeft className="mr-2" />
            </button>
          </Tooltip>
        ) : (
          <Tooltip text={userRole === RoleEnum.ADMIN ? 'Edit' : 'Propose an Edit'} position={positionTooltip}>
            <button
              onClick={onToggleForm}
              className="flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-medium shadow hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200 sm:w-auto w-full"
            >
              <FaEdit className="mr-2" />
            </button>
          </Tooltip>
        )}
      </div>
    );
  }

  return null;
};

