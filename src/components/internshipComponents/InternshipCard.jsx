import { useState } from "react";
import { FaBuilding, FaCalendarAlt, FaCheckCircle, FaClock, FaEnvelope, FaEye, FaFileAlt, FaFolderOpen, FaUserTie, FaVideo } from "react-icons/fa";

const getDocName = (doc) => {
  if (!doc) return "unknown";
  if (typeof doc === "string") return doc;
  if (typeof doc.name === "string") return doc.name;
  return Object.keys(doc)
    .filter((key) => !isNaN(key))
    .sort((a, b) => a - b)
    .map((key) => doc[key])
    .join("");
};

const InternshipCard = ({ internship }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border border-gray-300 p-6 rounded-lg hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100 duration-300 bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaUserTie className="text-blue-600" />
            {internship.student.name}
          </h3>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <FaEnvelope className="text-yellow-500" />
            {internship.student.email}
          </p>
        </div>
        
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
        >
          <FaEye className="text-lg" />
          <span className="font-medium">{showDetails ? "Hide" : "Details"}</span>
        </button>
      </div>

      {/* Basic Info - Always visible */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-gray-700">
          <FaFileAlt className="text-blue-500 flex-shrink-0" />
          <span><span className="font-semibold">Title:</span> {internship.titre || "Not specified"}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <FaBuilding className="text-gray-500 flex-shrink-0" />
          <span><span className="font-semibold">Company:</span> {internship.company || "Not specified"}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <FaCheckCircle className="text-green-500 flex-shrink-0" />
          <span><span className="font-semibold">Status:</span> {internship.status || "Not available"}</span>
        </div>
      </div>

      {/* Detailed Info - Shown when expanded */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <FaUserTie className="text-gray-500 flex-shrink-0" />
              <span><span className="font-semibold">Supervisor:</span> {internship.teacher.name || "Not assigned"}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <FaCalendarAlt className="text-green-500 flex-shrink-0" />
              <span><span className="font-semibold">Planning:</span> {internship.planningStatus}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <FaClock className="text-red-500 flex-shrink-0" />
              <span><span className="font-semibold">Late submission:</span> 
                <span className={`ml-1 ${internship.isRetard ? 'text-red-500' : 'text-green-500'}`}>
                  {internship.isRetard ? "Yes" : "No"}
                </span>
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <FaVideo className="text-blue-500 flex-shrink-0" />
              <span>
                <span className="font-semibold">Google Meet:</span> 
                {internship.googleMeetLink ? (
                  <a href={internship.googleMeetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                    Join meeting
                  </a>
                ) : "Not available"}
              </span>
            </div>
          </div>

          {/* Documents Section */}
          <div className="mt-4">
            <div className="flex items-start gap-3 text-gray-700">
              <FaFolderOpen className="text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Documents:</p>
                {internship.documents && internship.documents.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {internship.documents.map((doc, index) => {
                      const fileName = getDocName(doc);
                      const fileURL = `http://localhost:3000/uploads/${fileName}`;

                      return (
                        <li key={index} className="flex items-center gap-2">
                          <a
                            href={fileURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={fileName}
                            className="text-blue-600 hover:underline flex items-center gap-2"
                          >
                            <FaFileAlt className="text-gray-400" />
                            {fileName}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-1 text-gray-500">No documents available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipCard;