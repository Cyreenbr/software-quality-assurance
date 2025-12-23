import { FiAlertTriangle, FiArchive, FiCheck, FiCheckCircle, FiX } from 'react-icons/fi';
import Popup from '../../skillsComponents/Popup';
import Tooltip from '../../skillsComponents/tooltip';

/**
 * DeleteConfirmationPopup Component
 * Handles subject deletion with archive/force options
 * Separated for better modularity and testability
 */
export const DeleteConfirmationPopup = ({
  isOpen,
  onClose,
  onConfirm,
  archive,
  setArchive,
  forced,
  setForced,
  confirmDeleteMessage,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Popup isOpen={isOpen} onClose={onClose} position="center">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">{confirmDeleteMessage}</h2>
        <div className="flex justify-center gap-4 mb-6">
          {/* Archive Toggle Button */}
          <Tooltip text={archive ? 'Archive Enabled' : 'Enable Archive'} position="bottom">
            <button
              onClick={() => setArchive(!archive)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md ${
                archive ? 'bg-black text-white hover:bg-gray-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {archive ? <FiAlertTriangle className="text-white text-lg" /> : <FiArchive className="text-gray-700 text-lg" />}
              {archive ? 'Enabled' : 'Archive'}
            </button>
          </Tooltip>

          {/* Force Delete Toggle Button */}
          <Tooltip text={forced ? 'Force Delete Enabled' : 'Enable Force Delete'} position="bottom">
            <button
              onClick={() => setForced(!forced)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md ${
                forced ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {forced ? <FiCheckCircle className="text-white text-lg" /> : <FiAlertTriangle className="text-gray-700 text-lg" />}
              {forced ? 'Enabled' : 'Force Delete'}
            </button>
          </Tooltip>
        </div>

        {/* Confirm and Cancel Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          {[
            {
              label: 'Confirm',
              action: onConfirm,
              bgColor: 'bg-red-600 hover:bg-red-700',
              icon: <FiCheck className="text-lg" />,
            },
            {
              label: 'Cancel',
              action: onClose,
              bgColor: 'bg-gray-400 hover:bg-gray-500',
              icon: <FiX className="text-lg" />,
            },
          ].map(({ label, action, bgColor, icon }) => (
            <button
              key={label}
              onClick={action}
              className={`${bgColor} text-white px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 w-full`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </Popup>
  );
};

