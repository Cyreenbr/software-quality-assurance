import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";
import { FaCheckCircle, FaTimesCircle, FaPaperPlane } from "react-icons/fa";
import { FaTag } from "react-icons/fa";

const StudentPfaComponent = () => {
  const [pfaList, setpfaList] = useState([]);

  const openModal = (pfa) => setSelectedPFA(pfa);
  const closeModal = () => setSelectedPFA(null);

  useEffect(() => {
    fetchPfas();
  }, []);

  const fetchPfas = async () => {
    try {
      console.log("hi");
      const response = await pfaService.getPublishedPfas();
      console.log(response);
      if (!response || !Array.isArray(response.openPFA)) {
        throw new Error("The API did not return an array of periods.");
      }
      setpfaList(response.openPFA);
    } catch (error) {
      console.error("Error loading periods:", error);
      setpfaList([]);
    }
  };

  const [selectedPfa, setSelectedPfa] = useState(null);
  const [priority, setPriority] = useState({});
  const [binome, setBinome] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState({});

  const openPopup = async (pfa) => {
    setSelectedPfa(pfa);
    setBinome({});
    const students = await pfaService.getStudents();
    setFilteredUsers(students.model);
    console.log(students);
  };

  const closePopup = async () => {
    console.log({
      priority: selectedPriorities[selectedPfa._id],
      binome: binome.id,
    });
    const prio = {
      priorityLevel: selectedPriorities[selectedPfa._id],
    };

    if (selectedPfa.isTeamProject) prio.studentIds = [binome.id];
    const addpri = await pfaService.addPriority(selectedPfa._id, prio);

    console.log(addpri);

    setSelectedPfa(null);
  };

  const handlePriorityChange = (pfaId, value) => {
    setSelectedPriorities((prev) => {
      // Remove any existing selection with this priority
      const updated = Object.entries(prev).reduce((acc, [id, priority]) => {
        if (priority !== value) acc[id] = priority;
        return acc;
      }, {});
      return { ...updated, [pfaId]: value };
    });
  };

  const getAvailablePriorities = (pfaId) => {
    return [1, 2, 3];
  };

  const handleBinomeChange = (e) => {
    const input = e.target.value;
    setBinome(input);
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(input.toLowerCase())
      )
    );
  };
  const checkAccepted = (pfa, userId) => {
    if (!pfa || !pfa.priorities) return false;
    return pfa.affectedStudents.includes(userId);
  };
  const checkUserInPfa = (pfa, userId) => {
    if (!pfa || !pfa.priorities) return false;

    for (let priority of pfa.priorities) {
      if (priority.monome === userId || priority.binome === userId) {
        return true;
      }
    }

    return false;
  };

  const acceptTeacher = async (pfaId, acceptTeacher) => {
    const response = await pfaService.acceptTeacher(pfaId, acceptTeacher);

    console.log(response);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">Manage PFAs</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaTag className="text-blue-500 mr-2" size={18} /> List of PFAs
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Technologies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pfaList.map((pfa) => (
                <tr
                  key={pfa._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-left font-medium text-gray-900">
                    {pfa.projectTitle}
                  </td>
                  <td className="px-6 py-4 text-left text-gray-900">
                    {pfa.description}
                  </td>
                  <td className="px-6 py-4 text-left text-gray-500">
                    {pfa.technologies.slice(0, 3).join(", ")}
                    {pfa.technologies.length > 3 && " ..."}
                  </td>
                  <td className="px-6 py-4 text-center flex  gap-2 justify-center items-center">
                    <button
                      onClick={() => openPopup(pfa)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Set Priority
                    </button>
                    {checkUserInPfa(
                      pfa,
                      JSON.parse(localStorage.getItem("user")).id
                    ) && (
                      <div className=" w-3 aspect-square rounded-full bg-yellow-400 "></div>
                    )}
                    {checkAccepted(
                      pfa,
                      JSON.parse(localStorage.getItem("user")).id
                    ) && (
                      <button onClick={() => acceptTeacher(pfa._id, true)}>
                        <FaCheckCircle className=" w-10 text-green-700 " />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPfa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Set Priority for {selectedPfa.projectTitle}
            </h3>
            <label className="block mb-2">Priority:</label>
            <select
              value={selectedPriorities[selectedPfa._id] || ""}
              onChange={(e) =>
                handlePriorityChange(selectedPfa._id, Number(e.target.value))
              }
              className="border rounded px-2 py-1"
            >
              <option value="" disabled>
                Select priority
              </option>
              {getAvailablePriorities(selectedPfa._id).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>

            {selectedPfa.isTeamProject && (
              <div>
                <label className="block mb-2">Binome:</label>
                <input
                  type="text"
                  value={binome.name}
                  onChange={handleBinomeChange}
                  placeholder="Search for a binome"
                  className="w-full p-2 border rounded mb-2"
                />
                <ul className="border rounded bg-white max-h-32 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <li
                      key={user._id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() =>
                        setBinome({ name: user.firstName, id: user._id })
                      }
                    >
                      {user.firstName + " " + user.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={closePopup}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Add Priority
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPfaComponent;
