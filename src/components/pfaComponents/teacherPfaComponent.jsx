import { FaEdit, FaTrashAlt, FaPlus, FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";
import AddPfaPopUp from "./addPfaPopUp";
import AcceptPfaPopUp from "./acceptPfaPopUp";

const TeacherPfaComponent = () => {
  const [pfaList, setpfaList] = useState([]);
  const [selectedPfa, setSelectedPfa] = useState({});
  const [projectType, setProjectType] = useState("monome");
  const [studentOne, setStudentOne] = useState("");
  const [studentTwo, setStudentTwo] = useState("");

  useEffect(() => {
    fetchPfas();
  }, []);

  const fetchPfas = async () => {
    try {
      const response = await pfaService.getTeacherPfas();
      console.log(response);
      if (!response || !Array.isArray(response)) {
        throw new Error("The API did not return an array of periods.");
      }
      setpfaList(response);
    } catch (error) {
      console.error("Error loading periods:", error);
      setpfaList([]);
    }
  };

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

  const handleDelete = (id) => {
    console.log(id);
    setpfaList(pfaList.filter((pfa) => pfa._id !== id));
    pfaService.deletePfa(id);
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



  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">PFA Management </h1>

      {/* Modal de création avec animation */}
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
          isAcceptPfaDialogOpen={true}
          // Passer la fonction de fermeture ici
      />
      )}

      {/* Tableau des PFA */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">List of PFAs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Technologies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pfaList.map((pfa) => (
                <tr
                  key={pfa.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6 text-left">{pfa.projectTitle}</td>
                  <td className="py-3 px-6 text-left">{pfa.description}</td>
                  <td className="py-3 px-6 text-left">{pfa.technologies}</td>
                  <td className="py-3 px-6 text-center flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(pfa)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(pfa._id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setIsAcceptPfaDialogOpen(true);
                        setSelectedPfa(pfa);
                        console.log(pfa._id);
                      }}
                      className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                    >
                      <FaEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bouton flottant pour ouvrir le modal */}
      <div className="relative group">
        <button
          className="fixed bottom-6 right-6 rounded-full bg-indigo-600 p-4 text-white shadow-lg hover:shadow-xl focus:ring-2 focus:ring-indigo-500"
          type="button"
          onClick={() => setIsDialogOpen(true)} // Ouvrir le modal
        >
          <FaPlus size={24} />
        </button>
        {/* Tooltip affiché lorsque vous survolez sous le bouton */}
        {/* <div className="absolute bottom-10 right-6 text-sm text-white bg-indigo-600 py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Create PFA
        </div> */}
      </div>
    </div>
  );
};

export default TeacherPfaComponent;