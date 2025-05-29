import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaEye,
  FaTag,
  FaSearch,
} from "react-icons/fa";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";
import AddPfaPopUp from "./addPfaPopUp";
import AcceptPfaPopUp from "./acceptPfaPopUp";
import { Toaster, toast } from "react-hot-toast";

const TeacherPage = () => {
  const [pfaList, setpfaList] = useState([]);
  const [selectedPfa, setSelectedPfa] = useState({});
  const [projectType, setProjectType] = useState("monome");
  const [studentOne, setStudentOne] = useState("");
  const [studentTwo, setStudentTwo] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editedData, setEditedData] = useState({
    projectTitle: "",
    description: "",
    technologies: "",
  });
  const [newPfa, setNewPfa] = useState({
    projectTitle: "",
    description: "",
    technologies: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAcceptPfaDialogOpen, setIsAcceptPfaDialogOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Added search term state

  useEffect(() => {
    fetchPfas();
  }, []);

  const fetchPfas = async () => {
    try {
      const response = await pfaService.getTeacherPfas();
      console.log(response);
      if (!response || !Array.isArray(response)) {
        throw new Error("The API did not return an array of PFAs.");
      }
      setpfaList(response);
    } catch (error) {
      console.error("Error loading PFAs:", error);
      setpfaList([]);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await pfaService.deletePfa(deleteCandidate);
      setpfaList(pfaList.filter((pfa) => pfa._id !== deleteCandidate));
      setDeleteCandidate(null);
      toast.error("PFA deleted successfully", {
        style: {
          background: "#fee2e2",
          color: "#b91c1c",
        },
        iconTheme: {
          primary: "#b91c1c",
          secondary: "#fee2e2",
        },
      });
    } catch (error) {
      toast.error("Failed to delete PFA");
      console.error("Error deleting PFA:", error);
    }
  };

  const handleEdit = (pfa) => {
    console.log(pfa);
    setIsEditing(pfa._id);

    setEditedData({
      projectTitle: pfa.projectTitle,
      description: pfa.description,
      technologies: pfa.technologies,
    });
    setStudentOne(pfa.studentNames[0]);
    setStudentTwo(pfa.studentNames[1]);
    setProjectType(pfa.isTeamProject ? "binome" : "monome");
    setIsDialogOpen(true);
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    setpfaList(
      pfaList.map((pfa) =>
        pfa._id === isEditing ? { ...pfa, ...editedData } : pfa
      )
    );

    const isTeamProject = projectType === "binome";
    const studentNames = isTeamProject
      ? [studentOne, studentTwo]
      : [studentOne];
    console.log({ ...editedData, studentOne, studentTwo, projectType });
    pfaService.updatePfa(
      { ...editedData, studentNames, isTeamProject },
      isEditing
    );
    setIsEditing(null);
    setIsDialogOpen(false);
  };

  const handleCreateChange = (e) => {
    setNewPfa({ ...newPfa, [e.target.name]: e.target.value });
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();

    const newId = pfaList.length
      ? Math.max(...pfaList.map((pfa) => pfa.id)) + 1
      : 1;

    const isTeamProject = projectType === "binome";
    const studentNames = isTeamProject
      ? [studentOne, studentTwo]
      : [studentOne];
    const technologies = newPfa.technologies.split(",");
    setpfaList([
      ...pfaList,
      { id: newId, ...newPfa, technologies, isTeamProject, studentNames },
    ]);
    pfaService.createPfa({
      ...newPfa,
      technologies,
      isTeamProject,
      studentNames,
    });
    console.log({
      id: newId,
      ...newPfa,
      technologies,
      isTeamProject,
      studentNames,
    });
    console.log(projectType);

    setNewPfa({
      projectTitle: "",
      description: "",
      technologies: "",
      studentOne: "",
      studentTwo: "",
    });
    setIsDialogOpen(false);
  };

  // Filter PFAs based on search term
  const filteredPfas = pfaList.filter(
    (pfa) =>
      pfa.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pfa.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Search Bar */}
      <div className="flex justify-end mb-4">
        <div className="relative w-full sm:w-auto md:w-80">
          <input
            type="text"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaSearch size={20} />
          </div>
        </div>
      </div>

      {/* Modal de création/édition */}
      {isDialogOpen && (
        <AddPfaPopUp
          isEditing={isEditing}
          editedData={editedData}
          newPfa={newPfa}
          handleCreateChange={handleCreateChange}
          studentOne={studentOne}
          projectType={projectType}
          handleSubmitCreate={handleSubmitCreate}
          setProjectType={setProjectType}
          studentTwo={studentTwo}
          setStudentOne={setStudentOne}
          setStudentTwo={setStudentTwo}
          handleChange={handleChange}
          setIsDialogOpen={setIsDialogOpen}
          handleSubmitEdit={handleSubmitEdit}
        />
      )}
      {isAcceptPfaDialogOpen && (
        <AcceptPfaPopUp
          pfaPriority={selectedPfa.priorities}
          pfaId={selectedPfa._id}
          setIsAcceptPfaDialogOpen={setIsAcceptPfaDialogOpen}
        />
      )}

      {/* Grid Layout for PFAs */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaTag className="text-blue-500 mr-2" size={16} />
          List of PFAs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                {pfa.technologies.join(", ")}
              </p>
              <div className="flex gap-x-2 ml-20">
                <button
                  onClick={() => handleEdit(pfa)}
                  className="group relative inline-flex items-center justify-center p-2 bg-white border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-200"
                  title="Modifier le PFA"
                >
                  <HiOutlinePencilAlt
                    size={18}
                    className="pointer-events-none"
                  />
                </button>

                <button
                  onClick={() => setDeleteCandidate(pfa._id)}
                  className="group relative inline-flex items-center justify-center p-2 bg-white border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200"
                  title="Delete PFA"
                >
                  <FaTrashAlt size={14} />
                </button>
                <button
                  onClick={() => {
                    setIsAcceptPfaDialogOpen(true);
                    setSelectedPfa(pfa);
                  }}
                  className="group relative inline-flex items-center justify-center p-2 bg-white border border-green-500 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition-colors duration-200"
                  title="View to Accept"
                >
                  <FaEye size={14} />
                </button>
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

      {/* Bouton flottant pour ouvrir le modal */}
      <button
        className="fixed bottom-6 right-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-300 p-3 text-white shadow-lg hover:shadow-xl transition-transform duration-200 hover:scale-110 focus:ring-2 focus:ring-indigo-800"
        type="button"
        title="Add PFA"
        onClick={() => setIsDialogOpen(true)}
      >
        <FaPlus size={20} />
      </button>

      {/* Modal de confirmation pour la suppression */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl shadow-lg overflow-hidden">
            {/* Header en dégradé */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-300 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Confirm Deletion</h3>
            </div>
            {/* Contenu du dialog */}
            <div className="bg-white px-6 py-4">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this PFA?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteCandidate(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
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

export default TeacherPage;
