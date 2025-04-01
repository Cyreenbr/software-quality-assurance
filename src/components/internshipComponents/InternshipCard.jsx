import { FaCalendarAlt, FaCheckCircle, FaClock, FaEnvelope, FaFileAlt, FaUserTie, FaVideo } from "react-icons/fa";

const InternshipCard = ({ internship }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow border border-gray-200">
      <table className="min-w-full table-auto">
        <tbody>
          <tr className="mb-4">
            <td className="px-4 py-3 font-semibold text-gray-800 flex items-center gap-3">
              <FaUserTie className="text-blue-600" /> 
              <span className="text-lg font-bold">{internship.student.name}</span>
            </td>
            <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
              <FaEnvelope className="text-gray-500" />
              <span className="font-bold">Email:</span> {internship.student.email}
            </td>
          </tr>
          <tr className="mb-4">
            <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
              <FaClock className="text-gray-500" />
              <span className="font-bold">Late Submission:</span>
              <span className={`${internship.isRetard ? 'text-red-500' : 'text-green-500'}`}>
                {internship.isRetard ? "Yes" : "No"}
              </span>
            </td>
            <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
              <FaCheckCircle className="text-green-500" />
              <span className="font-bold">Submitted:</span> {internship.deposited ? "Yes" : "No"}
            </td>
          </tr>
          <tr className="mb-4">
            <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
              <FaUserTie className="text-gray-500" />
              <span className="font-bold">Supervisor:</span> {internship.teacher.name || "Not Assigned"}
            </td>
            <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
              <FaCalendarAlt className="text-gray-500" />
              <span className="font-bold">Planning:</span> {internship.planningStatus}
            </td>
          </tr>
          <tr className="mb-4">
            <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
              <FaVideo className="text-blue-500" />
              <span className="font-bold">Google Meet:</span>
              {internship.googleMeetLink ? (
                <a href={internship.googleMeetLink} target="_blank" rel="noopener noreferrer">{internship.googleMeetLink}</a>
              ) : "Not Available"}
            </td>
            <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
              <FaFileAlt className="text-gray-500" />
              <span className="font-bold">PV:</span> {internship.pvDetails || "Not Available"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InternshipCard;
