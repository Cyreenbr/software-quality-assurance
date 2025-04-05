import { FaEnvelope, FaEye, FaFileAlt, FaFolderOpen, FaUserTie } from "react-icons/fa";

const getDocName = (doc) => {
  if (!doc) return "unknown";
  if (typeof doc.name === "string") return doc.name;
  return Object.keys(doc)
    .filter((key) => !isNaN(key))
    .sort((a, b) => a - b)
    .map((key) => doc[key])
    .join("");
};

const TeacherInternshipCard = ({ internship }) => {
  return (
    <div className="border border-gray-300 p-6 shadow-sm rounded-lg hover:shadow-xl duration-300 hover:bg-gradient-to-r from-blue-50 to-purple-100">
      <table className="min-w-full table-auto">
        <tbody>
          <tr className="mb-4">
            <td className="px-4 py-3 font-semibold text-gray-800 flex items-center gap-3">
              <FaUserTie className="text-blue-600" />
              <span className="text-lg font-bold">{internship.studentId.name}</span>
            </td>
            <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
              <FaEnvelope className="text-gray-500" />
              <span className="font-bold">Email:</span> {internship.studentId.email}
            </td>
          </tr>

          <tr className="mb-4">
            <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
              <FaFileAlt className="text-gray-500" />
              <span className="font-bold">Title:</span> {internship.titre}
            </td>
          </tr>

          <tr className="mb-4">
            <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
              <FaFileAlt className="text-gray-500" />
              <span className="font-bold">PV:</span> {internship.pv || "No PV available"}
            </td>
          </tr>
          <tr className="mb-4">
            <td className="px-4 py-3 text-gray-600 flex items-start gap-3">
              <FaFolderOpen className="text-gray-500 mt-1" size={20} />
              <div>
                <span className="font-bold">Documents:</span>
                {internship.documents && internship.documents.length > 0 ? (
                  <div className="space-y-4 mt-2">
                    {internship.documents.map((doc, index) => {
                      const fileName = getDocName(doc);
                      const fileURL = `http://localhost:3000/uploads/${fileName}`;

                      return (
                        <div key={index}>
                          <div className="flex items-center gap-2">
                            <FaEye className="text-pink-500 text-xl" />
                            <span className="font-semibold">Consulter</span>
                          <a
                            href={fileURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={fileName}
                            className="text-blue-600 hover:underline mt-1 block"
                          >
                            {fileName}
                          </a></div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-2">No documents available</div>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TeacherInternshipCard;
