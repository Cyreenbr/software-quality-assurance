import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const Pfa = () => {
  const [pfaList, setPfaList] = useState([
    {
      id: 1,
      title: "Projet React",
      description: "Description courte",
      technologies: "React, Node.js",
    },
    {
      id: 2,
      title: "Projet Node",
      description: "Autre description",
      technologies: "Node.js, Express",
    },
  ]);

  const [isEditing, setIsEditing] = useState(null);
  const [editedData, setEditedData] = useState({
    title: "",
    description: "",
    technologies: "",
  });
  const [newPfa, setNewPfa] = useState({
    title: "",
    description: "",
    technologies: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id) => {
    setPfaList(pfaList.filter((pfa) => pfa.id !== id));
  };

  const handleEdit = (pfa) => {
    setIsEditing(pfa.id);
    setEditedData({
      title: pfa.title,
      description: pfa.description,
      technologies: pfa.technologies,
    });
    setIsDialogOpen(true);
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    setPfaList(
      pfaList.map((pfa) =>
        pfa.id === isEditing ? { ...pfa, ...editedData } : pfa
      )
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
    setPfaList([...pfaList, { id: newId, ...newPfa }]);
    setNewPfa({ title: "", description: "", technologies: "" });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">Gestion des PFA</h1>

      {/* Modal de création avec animation */}
      {isDialogOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-transparent backdrop-blur-sm transition-opacity duration-500 opacity-100 ">
          <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm">
            <div className="relative flex flex-col bg-white">
              <div className="relative m-2.5 items-center flex justify-center text-white h-24 rounded-md bg-indigo-600">
                <h3 className="text-2xl">
                  {isEditing ? "Modifier un PFA" : "Créer un PFA"}
                </h3>
              </div>
              <div className="flex flex-col gap-4 p-6">
                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Titre du projet
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={isEditing ? editedData.title : newPfa.title}
                    onChange={isEditing ? handleChange : handleCreateChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Titre du projet"
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
                    placeholder="Description du projet"
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
              </div>
              <div className="p-6 pt-0 flex justify-between">
                <button
                  className="rounded-md bg-indigo-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-indigo-500 focus:shadow-none active:bg-indigo-500 hover:bg-indigo-500 active:shadow-none"
                  type="button"
                  onClick={isEditing ? handleSubmitEdit : handleSubmitCreate}
                >
                  {isEditing ? "Sauvegarder" : "Créer"}
                </button>
                <button
                  className="rounded-md bg-gray-400 py-2 px-4 text-sm text-white"
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tableau des PFA */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Liste des PFA</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Titre</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Technologies</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pfaList.map((pfa) => (
                <tr
                  key={pfa.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6 text-left">{pfa.title}</td>
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
                      onClick={() => handleDelete(pfa.id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <FaTrashAlt size={18} />
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
          Créer un PFA
        </div> */}
      </div>
    </div>
  );
};

export default Pfa;
