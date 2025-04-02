import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const InternshipPage = () => {
  const [internshipList, setInternshipList] = useState([
    {
      id: 1,
      title: "React Internship",
      description: "Internship with React & Node.js",
      technologies: "React, Node.js",
    },
    {
      id: 2,
      title: "Backend Internship",
      description: "Internship with Node.js & Express",
      technologies: "Node.js, Express",
    },
  ]);

  const [isEditing, setIsEditing] = useState(null);
  const [editedData, setEditedData] = useState({
    title: "",
    description: "",
    technologies: "",
  });
  const [newInternship, setNewInternship] = useState({
    title: "",
    description: "",
    technologies: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id) => {
    setInternshipList(
      internshipList.filter((internship) => internship.id !== id)
    );
  };

  const handleEdit = (internship) => {
    setIsEditing(internship.id);
    setEditedData({
      title: internship.title,
      description: internship.description,
      technologies: internship.technologies,
    });
    setIsDialogOpen(true);
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    setInternshipList(
      internshipList.map((internship) =>
        internship.id === isEditing
          ? { ...internship, ...editedData }
          : internship
      )
    );
    setIsEditing(null);
    setIsDialogOpen(false);
  };

  const handleCreateChange = (e) => {
    setNewInternship({ ...newInternship, [e.target.name]: e.target.value });
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const newId = internshipList.length
      ? Math.max(...internshipList.map((internship) => internship.id)) + 1
      : 1;
    setInternshipList([...internshipList, { id: newId, ...newInternship }]);
    setNewInternship({ title: "", description: "", technologies: "" });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">Internship Management</h1>

      {/* Modal for Create/Edit Internship */}
      {isDialogOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-transparent backdrop-blur-sm transition-opacity duration-500 opacity-100 ">
          <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm">
            <div className="relative flex flex-col bg-white">
              <div className="relative m-2 items-center flex justify-center text-white h-12 rounded-md bg-indigo-600 px-4">
                <h3 className="text-lg font-semibold">
                  {isEditing ? "Update Internship" : "Create Internship"}
                </h3>
              </div>

              <div className="flex flex-col gap-4 p-6">
                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">
                    Title of the Internship
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={isEditing ? editedData.title : newInternship.title}
                    onChange={isEditing ? handleChange : handleCreateChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Title of the internship"
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
                      isEditing
                        ? editedData.description
                        : newInternship.description
                    }
                    onChange={isEditing ? handleChange : handleCreateChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Description of the internship"
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
                      isEditing
                        ? editedData.technologies
                        : newInternship.technologies
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

      {/* Internship Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">List of Internships</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Technologies</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {internshipList.map((internship) => (
                <tr
                  key={internship.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6 text-left">{internship.title}</td>
                  <td className="py-3 px-6 text-left">
                    {internship.description}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {internship.technologies}
                  </td>
                  <td className="py-3 px-6 text-center flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(internship)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(internship.id)}
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

      {/* Floating Button to Open Modal */}
      <div className="relative group">
        <button
          className="fixed bottom-6 right-6 rounded-full bg-indigo-600 p-4 text-white shadow-lg hover:shadow-xl focus:ring-2 focus:ring-indigo-500"
          type="button"
          onClick={() => setIsDialogOpen(true)} // Open Modal
        >
          <FaPlus size={24} />
        </button>
      </div>
    </div>
  );
};

export default InternshipPage;
