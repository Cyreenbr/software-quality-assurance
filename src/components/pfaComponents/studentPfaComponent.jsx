import { FaEdit, FaTrashAlt, FaPlus, FaSearch, FaClock } from "react-icons/fa";
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
  const [acceptedTeacher, setAcceptedTeacher] = useState(false);

  const acceptTeacher = async (pfaId, acceptTeacher) => {
    const response = await pfaService.acceptTeacher(pfaId, acceptTeacher);

    console.log(response);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPfas = pfaList.filter((pfa) => {
    return (
      pfa.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pfa.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Search Bar */}
      <div className="flex justify-end mb-4">
        <div className="relative w-full sm:w-auto md:w-80">
          <input
            type="text"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaSearch size={20} />
          </div>
        </div>
      </div>

      {/* PFA Card Grid */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaTag className="text-blue-500 mr-2" size={16} />
          List of PFAs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPfas.map((pfa) => (
            <div
              key={pfa._id}
              className="border border-gray-300 p-6 shadow-sm rounded-lg hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100 transition-all duration-300 overflow-auto"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {pfa.projectTitle}
              </h3>
              <p className="text-gray-600 mt-2">{pfa.description}</p>
              <p className="text-gray-500 text-sm mt-2">
                {pfa.technologies.slice(0, 3).join(", ")}...
              </p>

              <div className="mt-4 flex justify-between items-center">
                <td className="px-6 py-4 text-center flex  gap-2 justify-center items-center">
                  {!checkUserInPfa(
                    pfa,
                    JSON.parse(localStorage.getItem("user")).id
                  ) &&
                    !checkAccepted(
                      pfa,
                      JSON.parse(localStorage.getItem("user")).id
                    ) && (
                      <button
                        onClick={() => openPopup(pfa)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-300 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Set Priority
                      </button>
                    )}

                  <div className="flex items-center space-x-4">
                    {checkAccepted(
                      pfa,
                      JSON.parse(localStorage.getItem("user")).id
                    ) ? (
                      <div>
                        {pfa.priorities.map((priority) =>
                          priority.monome.toString() === JSON.parse(localStorage.getItem("user")).id ? (
                            <div
                              key={priority._id}
                              className="flex items-center"
                            >
                              {priority.acceptTeacher && (
                                <FaCheckCircle className="text-green-700 w-6 h-6" />
                              )}
                            </div>
                          ) : null
                        )}

                        {!pfa.priorities.some(
                          (priority) =>
                            priority.monome.toString() === JSON.parse(localStorage.getItem("user")).id &&
                            priority.acceptTeacher
                        ) && (
                          <button
                            onClick={() => {
                              acceptTeacher(pfa._id, true);
                              setAcceptedTeacher(true); // Assurez-vous que cet état est défini
                            }}
                            className="text-green-700 hover:text-green-800 transition duration-200"
                            title="Accepter Teacher"
                          >
                            "Accepter Teacher"
                          </button>
                        )}
                      </div>
                    ) : checkUserInPfa(
                        pfa,
                        JSON.parse(localStorage.getItem("user")).id
                      ) ? (
                      <FaClock
                        className="text-yellow-500 w-5 h-5"
                        title="En attente"
                      />
                    ) : null}
                  </div>
                </td>
              </div>
            </div>
          ))}
        </div>

        {/* Priority Modal */}
        {selectedPfa && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-lg">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-96 max-w-lg transition-all transform scale-95 hover:scale-100">
              {/* Header with Gradient Background */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-300 px-6 py-4 rounded-t-lg shadow-md">
                <h3 className="text-xl font-semibold text-white">
                  Set Priority for {selectedPfa.projectTitle}
                </h3>
              </div>

              {/* Priority Select */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={selectedPriorities[selectedPfa._id] || ""}
                  onChange={(e) =>
                    handlePriorityChange(
                      selectedPfa._id,
                      Number(e.target.value)
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
              </div>

              {/* Binome Search (if Team Project) */}
              {selectedPfa.isTeamProject && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Binome
                  </label>
                  <input
                    type="text"
                    value={binome.name}
                    onChange={handleBinomeChange}
                    placeholder="Search for a binome"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <ul className="mt-2 border rounded-lg bg-white max-h-40 overflow-y-auto shadow-md">
                    {filteredUsers.map((user) => (
                      <li
                        key={user._id}
                        className="p-3 hover:bg-gray-100 cursor-pointer transition-all"
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

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={closePopup}
                  className="bg-blue-500 text-white px-6 py-3 rounded-l  hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  Add Priority
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPfaComponent;
