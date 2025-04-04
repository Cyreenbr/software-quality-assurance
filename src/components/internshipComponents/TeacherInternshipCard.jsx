import { FaEnvelope, FaFolderOpen, FaUserTie } from "react-icons/fa";

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
  <td className="px-4 py-3 text-gray-600 flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <FaFolderOpen className="text-gray-500" />
      <span className="font-bold">Documents:</span>
    </div>

    {internship.documents && internship.documents.length > 0 ? (
      internship.documents.map((doc, index) => (
        <div key={index} className="mt-2">
          <iframe
            src={doc.link}
            title={doc.name}
            className="w-full h-64 rounded border"
          />
          <div className="mt-2">
            <a
              href={doc.link}
              target="_blank"
              rel="noopener noreferrer"
              download={doc.name}
              className="text-blue-600 hover:underline"
            >
              Télécharger {doc.name}
            </a>
          </div>
        </div>
      ))
    ) : (
      <span>Aucun document disponible</span>
    )}
  </td>
</tr>

        </tbody>
      </table>
    </div>
  );
};

export default TeacherInternshipCard;
