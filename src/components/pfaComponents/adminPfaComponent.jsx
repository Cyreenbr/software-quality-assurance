import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";

const AdminPfaComponent = () => {
  const [pfaList, setpfaList] = useState([]);
  const [projectType, setProjectType] = useState("monome");
  const [studentOne, setStudentOne] = useState("");
  const [studentTwo, setStudentTwo] = useState("");

  useEffect(() => {
    fetchPfas();
  }, []);

  const fetchPfas = async () => {
    try {
      const response = await pfaService.getPfas();
      console.log(response);
      if (!response || !Array.isArray(response.pfas)) {
        throw new Error("The API did not return an array of periods.");
      }
      setpfaList(response.pfas);
    } catch (error) {
      console.error("Error loading periods:", error);
      setpfaList([]);
    }
  };

  // const [pfaList, pfaList] = useState([
  //   {
  //     id: 1,
  //     title: "Projet React",
  //     description: "Description courte",
  //     technologies: "React, Node.js",
  //   },
  //   {
  //     id: 2,
  //     title: "Projet Node",
  //     description: "Autre description",
  //     technologies: "Node.js, Express",
  //   },
  // ]);

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

  const handleDelete = (id) => {
    console.log(id);
    setpfaList(
      pfaList.map((pfa) =>
        pfa._id === id ? { ...pfa, status: "rejected" } : pfa
      )
    );
    pfaService.rejectPfa(id);
  };
  const handlePublish = (id) => {
    console.log(id);
    setpfaList(
      pfaList.map((pfa) =>
        pfa._id === id ? { ...pfa, status: "published" } : pfa
      )
    );
    pfaService.publishPfa(id);
  };

  const handleMailSending = () => {
    pfaService.sendEmail();
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
        <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-transparent backdrop-blur-sm transition-opacity duration-500 opacity-100">
          <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm">
            <div className="relative flex flex-col bg-white">
              <div className="relative m-2 items-center flex justify-center text-white h-12 rounded-md bg-indigo-600 px-4">
                <h3 className="text-lg font-semibold">
                  {isEditing ? "Update PFA" : "Create PFA"}
                </h3>
              </div>

              <div className="flex flex-col gap-4 p-6">
                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Title of The Project
                  </label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={
                      isEditing ? editedData.projectTitle : newPfa.projectTitle
                    }
                    onChange={isEditing ? handleChange : handleCreateChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Title of the project"
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={
                      isEditing ? editedData.description : newPfa.description
                    }
                    onChange={isEditing ? handleChange : handleCreateChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Description of the project"
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Technologies
                  </label>
                  <input
                    type="text"
                    name="technologies"
                    value={
                      isEditing ? editedData.technologies : newPfa.technologies
                    }
                    onChange={isEditing ? handleChange : handleCreateChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Technologies"
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Project Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="projectType"
                        value="monome"
                        checked={projectType === "monome"}
                        onChange={() => setProjectType("monome")}
                      />
                      Monome
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="projectType"
                        value="binome"
                        checked={projectType === "binome"}
                        onChange={() => setProjectType("binome")}
                      />
                      Binome
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Student One Name"
                    value={studentOne}
                    onChange={(e) => setStudentOne(e.target.value)}
                    className="w-full mt-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    required
                  />
                  {projectType === "binome" && (
                    <input
                      type="text"
                      placeholder="Enter Student Two Name"
                      value={studentTwo}
                      onChange={(e) => setStudentTwo(e.target.value)}
                      className="w-full mt-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                      required
                    />
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex justify-between">
                <button
                  className="rounded-md bg-indigo-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-indigo-500 focus:shadow-none active:bg-indigo-500 hover:bg-indigo-500 active:shadow-none"
                  type="button"
                  onClick={isEditing ? handleSubmitEdit : handleSubmitCreate}
                >
                  {isEditing ? "Save" : "Create"}
                </button>
                <button
                  className="rounded-md bg-gray-400 py-2 px-4 text-sm text-white"
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tableau des PFA */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">List of PFAs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Technologies</th>
                <th className="py-3 px-6 text-center">Status</th>
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
                    {pfa.status}
                    <button
                      onClick={() => handleDelete(pfa._id)}
                      className="bg-red-500 text-white ml-2 p-2 rounded-full hover:bg-red-600"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                    <button
                      onClick={() => handlePublish(pfa._id)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                    >
                      <FaEdit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        onClick={() => handleMailSending()}
        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
      >
        Send Published PFA Mail
      </button>
      {/* Bouton flottant pour ouvrir le modal */}
    </div>
  );
};

export default AdminPfaComponent;
