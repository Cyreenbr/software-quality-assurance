export default function AddPfaPopUp({
  isEditing,
  editedData,
  newPfa,
  handleCreateChange,
  projectType,
  studentOne,
  handleSubmitCreate,
  setProjectType,
  studentTwo,
  setStudentOne,
  setStudentTwo,
  handleChange,
  setIsDialogOpen,
  handleSubmitEdit
}) {
  return (
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
                value={isEditing ? editedData.description : newPfa.description}
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
  );
}
