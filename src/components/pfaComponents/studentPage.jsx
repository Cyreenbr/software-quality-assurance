import { FaEdit, FaTrashAlt, FaPlus, FaSearch, FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";
import { FaCheckCircle, FaTimesCircle, FaPaperPlane } from "react-icons/fa";
import { FaTag } from "react-icons/fa";
import { getStudents } from "../../services/ManageUsersServices/students.service";

const StudentPage = () => {
  const [pfaList, setpfaList] = useState([]);

  const openModal = (pfa) => setSelectedPFA(pfa);
  const closeModal = () => setSelectedPFA(null);

  useEffect(() => {
    fetchPfas();
  }, []);

  function hasAcceptedPriority(pfas, currentUserId) {
    return pfas.some((pfa) =>
      pfa.priorities?.some(
        (priority) =>
          priority.acceptTeacher === true &&
          (priority.monome === currentUserId ||
            priority.binome === currentUserId)
      )
    );
  }

  ///////

  const [allPfas, setAllPfas] = useState([]);
  const [hasAcceptTeacher, setHasAcceptTeacher] = useState(false);

  // useEffect(() => {
  //   const fetchPfas = async () => {
  //     try {
  //       const response = await pfaService.getPfas();
  //       console.log("Response from getPfas:", response);

  //       // Adapter ici la clé selon la réponse, par exemple "pfas" ou "openPFA"
  //       if (!response || !Array.isArray(response.pfas)) {
  //         throw new Error("The API did not return an array of PFAs.");
  //       }

  //       setAllPfas(response.pfas);
  //     } catch (error) {
  //       console.error("Error loading PFAs:", error);
  //       setAllPfas([]); // vider si erreur
  //     }
  //   };

  //   fetchPfas();
  // }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const isStudentAffectedInAnyPfa = (userId, allPfas) => {
    if (!userId) return false;
    const affected = allPfas.some(
      (pfa) =>
        Array.isArray(pfa.affectedStudents) &&
        pfa.affectedStudents
          .map((id) => id.toString())
          .includes(userId.toString())
    );

    return affected;
  };

  const fetchPfas = async () => {
    try {
      const response = await pfaService.getPublishedPfas();

      if (!response || !Array.isArray(response.openPFA)) {
        throw new Error("The API did not return an array of PFAs.");
      }

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const currentUserId = currentUser?.id;

      if (!currentUserId) {
        throw new Error("User ID is not available. Please login first.");
      }

      console.log("Current User ID:", currentUserId);

      const filteredPfas = response.openPFA.filter((pfa) => {
        // Montrer les PFAs non assignés
        if (!pfa.assigned) return true;

        // Sinon, vérifier si l'utilisateur courant est parmi les affectés
        return (
          Array.isArray(pfa.affectedStudents) &&
          pfa.affectedStudents.some((studentId) => {
            return studentId?.toString() === currentUserId;
          })
        );
      });
      setHasAcceptTeacher(hasAcceptedPriority(filteredPfas, currentUserId));

      setpfaList(filteredPfas);
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

    const userId = JSON.parse(localStorage.getItem("user")).id;
    const students = await getStudents();

    // Exclure l'utilisateur connecté de la liste
    const filtered = students.model.filter((student) => student._id !== userId);

    setFilteredUsers(filtered);
    console.log(filtered);
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
    await fetchPfas();

    setSelectedPfa(null);
  };

  const cancelPopup = () => {
    setSelectedPfa(null); // ferme juste le popup
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

              <div className="mt-4 flex justify-between items-center px-6 py-4 text-center gap-2">
                {!checkUserInPfa(pfa, userId) &&
                  !checkAccepted(pfa, userId) &&
                  (
                    <button
                      onClick={() => openPopup(pfa)}
                      disabled={
                        checkUserInPfa(pfa, userId) ||
                        checkAccepted(pfa, userId) ||
                        isStudentAffectedInAnyPfa(userId, allPfas)
                      }
                      className={`px-6 py-3 rounded-lg shadow-lg transition-all ${
                        checkUserInPfa(pfa, userId) ||
                        checkAccepted(pfa, userId) ||
                        isStudentAffectedInAnyPfa(userId, allPfas)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-purple-300 text-white hover:scale-105 hover:from-blue-600 hover:to-indigo-700"
                      }`}
                    >
                      Set Priority
                    </button>
                  )}

                <div className="flex items-center space-x-4">
                  {checkAccepted(pfa, userId) ? (
                    <div>
                      {pfa.priorities.map((priority) =>
                        priority.monome.toString() === userId ? (
                          <div key={priority._id} className="flex items-center">
                            {priority.acceptTeacher && (
                              <FaCheckCircle className="text-green-700 w-6 h-6" />
                            )}
                          </div>
                        ) : null
                      )}

                      {!hasAcceptTeacher && (
                        <button
                          onClick={() => {
                            acceptTeacher(pfa._id, true);
                            setAcceptedTeacher(true);
                            setHasAcceptTeacher(true);
                          }}
                          disabled={isStudentAffectedInAnyPfa(userId, allPfas)}
                          className={`text-green-700 hover:text-green-800 transition duration-200 ${
                            isStudentAffectedInAnyPfa(userId, allPfas)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title="Accepter Teacher"
                        >
                          Accepter Teacher
                        </button>
                      )}
                    </div>
                  ) : checkUserInPfa(pfa, userId) ? (
                    <FaClock
                      className="text-yellow-500 w-5 h-5"
                      title="En attente"
                    />
                  ) : null}
                </div>
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
              <div className="flex justify-between mt-5">
                <button
                  onClick={cancelPopup}
                  className="bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-gray-500 transition-all duration-200 shadow"
                >
                  Cancel
                </button>
                <button
                  onClick={closePopup}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full  hover:bg-gray-500 transition-all duration-200 shadow"
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

export default StudentPage;
