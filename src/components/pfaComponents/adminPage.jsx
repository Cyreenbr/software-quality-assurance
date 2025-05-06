import { FaEdit, FaTrashAlt, FaPlus, FaCheckCircle, FaTimesCircle, FaPaperPlane, FaClipboard, FaCode, FaUsers, FaRegLightbulb, FaHourglassHalf, FaSearch, FaTag } from "react-icons/fa";
import { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";
import { Toaster, toast } from "react-hot-toast";  // Importer 'toast'

const AdminPage = () => {
  const [pfaList, setpfaList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false); // pour gérer l'affichage du popup

  const openEmailPopup = () => setIsEmailPopupOpen(true);
  const closeEmailPopup = () => setIsEmailPopupOpen(false);

  useEffect(() => {
    fetchPfas();
  }, []);

  const fetchPfas = async () => {
    try {
      const response = await pfaService.getPfas();
      if (!response || !Array.isArray(response.pfas)) {
        throw new Error("The API did not return an array of PFAs.");
      }
      setpfaList(response.pfas);
    } catch (error) {
      console.error("Error loading PFAs:", error);
      setpfaList([]);
    }
  };

  const handleReject = (id) => {
    setpfaList(
      pfaList.map((pfa) =>
        pfa._id === id ? { ...pfa, status: "rejected" } : pfa
      )
    );
    pfaService.rejectPfa(id);
  };

  const handlePublish = (id) => {
    setpfaList(
      pfaList.map((pfa) =>
        pfa._id === id ? { ...pfa, status: "published" } : pfa
      )
    );
    pfaService.publishPfa(id);
  };

  const handleMailSending = async () => {
    try {
      await pfaService.sendEmail();  // Logique pour envoyer l'email
      toast.success("Email sent successfully!"); // Affiche un toast de succès
      closeEmailPopup(); // Ferme le popup après l'envoi
    } catch (error) {
      toast.error("Failed to send email!"); // Affiche un toast d'erreur en cas de problème
    }
  };

  const filteredPfas = pfaList.filter(
    (pfa) =>
      pfa.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pfa.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <Toaster position="top-right" reverseOrder={false} />  {/* Affichage des toasts */}

      {/* Barre de recherche */}
      <div className="flex justify-end mb-4">
        <div className="relative w-full sm:w-auto md:w-80">
          <input
            type="text"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaSearch size={20} />
          </div>
        </div>
      </div>

      {/* Liste des PFAs */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaTag className="text-blue-500 mr-2" size={16} />
          List of PFAs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPfas.map((pfa) => (
            <div
              key={pfa.id}
              className="border border-gray-300 p-6 shadow-sm rounded-lg hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100 transition-all duration-300 overflow-auto"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {pfa.projectTitle}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{pfa.description}</p>
              <p className="text-xs text-gray-500 mb-4">
                {pfa.technologies?.join(", ")}
              </p>

              {/* Actions pour gérer les statuts */}
              <div className="flex justify-end gap-2">
                {pfa.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleReject(pfa._id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      title="Reject this PFA"
                    >
                      <FaTimesCircle size={18} />
                    </button>
                    <button
                      onClick={() => handlePublish(pfa._id)}
                      className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                      title="Publish this PFA"
                    >
                      <FaCheckCircle size={18} />
                    </button>
                  </>
                )}

                {pfa.status === "rejected" && (
                  <span
                    className="text-red-500 flex items-center hover:scale-120"
                    title="This PFA is rejected"
                  >
                    <FaTimesCircle size={18} className="mr-1" />
                  </span>
                )}

                {pfa.status === "published" && (
                  <span
                    className="text-green-500 hover:scale-120 flex items-center"
                    title="This PFA is published"
                  >
                    <FaCheckCircle size={18} className="mr-1" />
                  </span>
                )}
              </div>
            </div>
          ))}
          {filteredPfas.length === 0 && (
            <p className="text-center text-gray-500 col-span-4">
              No PFAs found.
            </p>
          )}
        </div>
      </div>

      {/* Bouton pour envoyer l'email des PFAs publiés */}
      <button
        onClick={openEmailPopup} // Ouvrir le popup de confirmation
        className="hover:scale-108 bg-blue-500 text-white py-2 px-4 rounded flex items-center space-x-2 hover:bg-blue-700 shadow-md transition-all duration-300"
      >
        <FaPaperPlane className="text-white" />
        <span>Send Mail of the Published PFAs</span>
      </button>

      {/* Popup de confirmation pour l'envoi de l'email */}
      {isEmailPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-300 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Confirm Email Sending</h3>
            </div>
            <div className="bg-white px-6 py-4">
              <p className="text-gray-700 mb-4">Are you sure you want to send this email?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeEmailPopup}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMailSending}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
