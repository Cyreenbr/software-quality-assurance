import { CgEye } from 'react-icons/cg';
import { FiArchive, FiEyeOff } from 'react-icons/fi';
import { FaClock, FaCalendarPlus } from 'react-icons/fa';
import humanizeDate from '../../../utils/humanizeDate';
import { RoleEnum } from '../../../utils/userRoles';

/**
 * SubjectStatusHeader Component
 * Displays subject status information for admins
 * Separated for better modularity
 */
export const SubjectStatusHeader = ({ subject, isArchived, userRole }) => {
  if (userRole !== RoleEnum.ADMIN || !subject) {
    return null;
  }

  return (
    <header className="bg-gray-50 p-4 rounded-lg shadow-md text-center mb-8 space-y-3">
      {/* Archived Status */}
      {isArchived && (
        <div className="flex items-center justify-center text-yellow-700 space-x-2">
          <FiArchive className="text-xl" />
          <span className="font-medium">Archived</span>
        </div>
      )}

      {/* Publication Status */}
      <div className={`flex items-center justify-center space-x-2 ${subject.isPublish ? 'text-green-700' : 'text-red-600'}`}>
        {subject.isPublish ? (
          <>
            <CgEye className="text-xl" />
            <span className="font-medium">Published</span>
          </>
        ) : (
          <>
            <FiEyeOff className="text-xl" />
            <span className="font-medium">Hidden</span>
          </>
        )}
      </div>

      {/* Timestamps */}
      <div className="flex flex-col items-center space-y-1 text-gray-600 text-sm">
        <div className="flex items-center space-x-2">
          <FaClock className="text-base" />
          <span>Last update: {humanizeDate(subject.updatedAt, true)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaCalendarPlus className="text-base" />
          <span>Created: {humanizeDate(subject.createdAt, true)}</span>
        </div>
      </div>
    </header>
  );
};

