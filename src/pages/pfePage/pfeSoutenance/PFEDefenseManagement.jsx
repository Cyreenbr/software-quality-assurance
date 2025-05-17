import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";
import {
  fetchPFEChoices,
  fetchTeachers,
} from "../../../services/pfeService/pfe.service";
import {
  createPlanning,
  getPlannings,
  sendEmail,
  togglePublication,
  updateSoutenance,
} from "../../../services/pfeService/pfeSoutenance";

const AdminPlanningPage = () => {
  const [pfes, setPfes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [plannings, setPlannings] = useState([]);
  const [filteredPlannings, setFilteredPlannings] = useState([]);
  const [form, setForm] = useState({
    pfeId: "",
    room: "",
    presidentId: "",
    reporterId: "",
    date: "",
    time: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [pfeFilter, setPfeFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    loadData();
  }, [editingId]);

  useEffect(() => {
    if (pfeFilter) {
      const filtered = plannings.filter((plan) =>
        plan.pfe?.title?.toLowerCase().includes(pfeFilter.toLowerCase())
      );
      setFilteredPlannings(filtered);
    } else {
      setFilteredPlannings(plannings);
    }
  }, [pfeFilter, plannings]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pfeRes, teacherRes, planningRes] = await Promise.all([
        fetchPFEChoices(),
        fetchTeachers(),
        getPlannings(),
      ]);

      const pfeIdsWithDefense = planningRes.defenses.map(
        (plan) => plan.pfe._id
      );
      const pfeWithoutDefense = Array.isArray(pfeRes)
        ? pfeRes.filter((pfe) => !pfeIdsWithDefense.includes(pfe.pfeId))
        : [];

      if (editingId) {
        const currentPlanning = planningRes.defenses.find(
          (plan) => plan._id === editingId
        );
        const currentPfe = pfeRes.find(
          (pfe) => pfe.pfeId === currentPlanning?.pfe?._id
        );
        if (
          currentPfe &&
          !pfeWithoutDefense.some((p) => p.pfeId === currentPfe.pfeId)
        ) {
          pfeWithoutDefense.push(currentPfe);
        }
      }

      setPfes(pfeWithoutDefense || []);
      setTeachers(teacherRes || []);
      setPlannings(planningRes.defenses || []);
      setFilteredPlannings(planningRes.defenses || []);
      setIsPublished(planningRes.defenses?.[0]?.published ?? false);
    } catch (err) {
      setMessage("Error loading data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTogglePublish = async () => {
    if (!plannings[0]) return;
    try {
      await togglePublication(isPublished);
      setIsPublished(!isPublished);
      setMessage(
        `Schedule ${!isPublished ? "published" : "hidden"} successfully.`
      );
      await loadData();
    } catch (err) {
      setMessage("Error changing publication status.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedPfe = pfes.find((p) => p.pfeId === form.pfeId);
    const supervisorId = selectedPfe?.IsammSupervisor?._id;

    if (
      form.presidentId === form.reporterId ||
      form.presidentId === supervisorId ||
      form.reporterId === supervisorId
    ) {
      setMessage(
        "The president, reporter, and supervisor must be three different people."
      );
      return;
    }
    const selectedDateTime = new Date(`${form.date}T${form.time}`);
    const now = new Date();

    if (selectedDateTime <= now) {
      setMessage("The selected date and time must be in the future.");
      return;
    }

    const selectedHour = selectedDateTime.getHours();
    if (selectedHour < 8 || selectedHour >= 16) {
      setMessage("The time must be between 08:00 and 16:00.");
      return;
    }
    try {
      if (editingId) {
        await updateSoutenance(editingId, form);
        setMessage("Schedule updated successfully.");
      } else {
        await createPlanning(form);
        setMessage("Schedule created successfully.");
      }

      setForm({
        pfeId: "",
        room: "",
        presidentId: "",
        reporterId: "",
        date: "",
        time: "",
      });
      setEditingId(null);
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving the schedule.");
    }
  };

  const formatTime = (timeInMinutes) => {
    const hours = Math.floor(timeInMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (timeInMinutes % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleEdit = (planning) => {
    setForm({
      pfeId: planning.pfe?._id || "",
      room: planning.room || "",
      presidentId: planning.presidentId?._id || "",
      reporterId: planning.reporterId?._id || "",
      date: planning.date?.split("T")[0] || "",
      time: formatTime(planning.time || 0),
    });
    setEditingId(planning._id);
  };

  const handleSendEmail = async () => {
    try {
      await sendEmail();
      setMessage("Email sent successfully.");
    } catch (err) {
      setMessage("Error sending email.");
    }
  };

  const resetFilter = () => {
    setPfeFilter("");
    setShowFilter(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header Section*/}
      <div className="bg-white/30 backdrop-blur-sm rounded-xl shadow-sm p-6 mb-6 border border-white/20">
        <h1 className="text-2xl md:text-2xl font-bold text-blue-400 mb-1">
          Defense Schedule Management
        </h1>
        <p className="text-gray-600/90 text-sm">
          Manage and organize student defense schedules
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      )}

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg backdrop-blur-sm shadow-xs text-sm ${
            message.includes("success")
              ? "bg-green-100/30 text-green-800 border border-green-200/50"
              : "bg-red-100/30 text-red-800 border border-red-200/50"
          }`}
        >
          {message}
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white/30 backdrop-blur-sm p-5 rounded-xl shadow-xs border border-white/20 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            {editingId ? "Edit Defense Schedule" : "Create New Schedule"}
          </h2>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm({
                  pfeId: "",
                  room: "",
                  presidentId: "",
                  reporterId: "",
                  date: "",
                  time: "",
                });
              }}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center transition-colors"
            >
              <FaTimes className="mr-1" /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Form fields*/}
            <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg shadow-xs border border-white/30">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                PFE Project
              </label>
              <select
                name="pfeId"
                value={form.pfeId}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-white/50 rounded-lg shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-300/50 focus:border-blue-300/50 transition duration-200 bg-white/50"
                required
              >
                <option value="">Select a PFE project</option>
                {pfes.map((pfe) => (
                  <option key={pfe.pfeId} value={pfe.pfeId}>
                    {pfe.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg shadow-xs border border-white/30">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Room
              </label>
              <input
                name="room"
                value={form.room}
                onChange={handleChange}
                type="text"
                placeholder="Enter room number"
                required
                className="w-full px-3 py-2 text-sm border border-white/50 rounded-lg shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-300/50 focus:border-blue-300/50 transition duration-200 bg-white/50"
              />
            </div>

            <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg shadow-xs border border-white/30">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                President
              </label>
              <select
                name="presidentId"
                value={form.presidentId}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-white/50 rounded-lg shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-300/50 focus:border-blue-300/50 transition duration-200 bg-white/50"
                required
              >
                <option value="">Select president</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.firstName} {t.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg shadow-xs border border-white/30">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Reporter
              </label>
              <select
                name="reporterId"
                value={form.reporterId}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-white/50 rounded-lg shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-300/50 focus:border-blue-300/50 transition duration-200 bg-white/50"
                required
              >
                <option value="">Select reporter</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.firstName} {t.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg shadow-xs border border-white/30">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Date
              </label>
              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                type="date"
                required
                className="w-full px-3 py-2 text-sm border border-white/50 rounded-lg shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-300/50 focus:border-blue-300/50 transition duration-200 bg-white/50"
              />
            </div>

            <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg shadow-xs border border-white/30">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Time
              </label>
              <input
                name="time"
                value={form.time}
                onChange={handleChange}
                type="time"
                required
                className="w-full px-3 py-2 text-sm border border-white/50 rounded-lg shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-300/50 focus:border-blue-300/50 transition duration-200 bg-white/50"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-500/90 hover:bg-blue-600/90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300/50 transition duration-200 backdrop-blur-sm"
            >
              {editingId ? "Update Schedule" : "Create Schedule"}
            </button>
          </div>
        </form>
      </div>

      {/* Action Buttons*/}
      <div className="flex flex-wrap gap-3 mb-6 justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg shadow-xs text-xs font-medium transition duration-200 backdrop-blur-sm ${
              showFilter
                ? "bg-blue-100/40 text-blue-600 border border-blue-200/50"
                : "bg-white/40 text-gray-600 border border-white/50 hover:bg-white/60"
            }`}
          >
            <FaFilter className="mr-1.5 text-xs" />
            {showFilter ? "Hide Filter" : "Filter by PFE"}
          </button>

          {showFilter && (
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by PFE title..."
                value={pfeFilter}
                onChange={(e) => setPfeFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs border border-white/50 rounded-lg shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-300/50 focus:border-blue-300/50 bg-white/50 backdrop-blur-sm"
              />
              {pfeFilter && (
                <button
                  onClick={resetFilter}
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSendEmail}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-green-500/80 hover:bg-green-600/80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-300/50 transition duration-200 backdrop-blur-sm"
          >
            <FaPaperPlane className="mr-1.5 text-xs" />
            Send Notifications
          </button>
          <button
            onClick={handleTogglePublish}
            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition duration-200 backdrop-blur-sm ${
              isPublished
                ? "bg-gray-500/80 hover:bg-gray-600/80 focus:ring-gray-300/50"
                : "bg-green-500/80 hover:bg-green-600/80 focus:ring-green-300/50"
            }`}
          >
            {isPublished ? (
              <FaEyeSlash className="mr-1.5 text-xs" />
            ) : (
              <FaEye className="mr-1.5 text-xs" />
            )}
            {isPublished ? "Hide" : "Publish"}
          </button>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white/30 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/30 flex justify-between items-center bg-white/40">
          <h2 className="text-base font-semibold text-gray-700 flex items-center">
            <FaCalendarAlt className="mr-2 text-indigo-500" />
            Defense Schedules
          </h2>
          <span className="text-xs text-indigo-600 bg-indigo-100/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {filteredPlannings.length}{" "}
            {filteredPlannings.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/30">
            <thead className="bg-white/40">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  PFE Project
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Supervisor
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  President
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/20 divide-y divide-white/30">
              {filteredPlannings.length > 0 ? (
                filteredPlannings.map((plan) => (
                  <tr
                    key={plan._id}
                    className="hover:bg-white/30 transition duration-150"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">
                        {plan.pfe?.title || "N/A"}
                      </div>
                      <div className="text-xs text-indigo-500/90">
                        {plan.pfe?.student.firstName || "Unknown student"}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-2 py-1 bg-blue-100/40 text-blue-700 rounded-full text-xs">
                        {plan.room}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                      {plan.date
                        ? new Date(plan.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-2 py-1 bg-purple-100/40 text-purple-700 rounded-full">
                        {formatTime(plan.time)}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">
                        {plan.pfe?.IsammSupervisor?.firstName}{" "}
                        {plan.pfe?.IsammSupervisor?.lastName}
                      </div>
                      <div className="text-xs text-indigo-500/90">
                        {plan.pfe?.IsammSupervisor?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">
                        {plan.presidentId?.firstName}{" "}
                        {plan.presidentId?.lastName}
                      </div>
                      <div className="text-xs text-indigo-500/90">
                        {plan.presidentId?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">
                        {plan.reporterId?.firstName} {plan.reporterId?.lastName}
                      </div>
                      <div className="text-xs text-indigo-500/90">
                        {plan.reporterId?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="text-indigo-500 hover:text-indigo-700 inline-flex items-center transition duration-200 px-2.5 py-1 rounded-lg bg-indigo-100/40 hover:bg-indigo-100/60 text-xs backdrop-blur-sm"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-8 text-center text-sm text-gray-600"
                  >
                    <div className="bg-white/40 p-4 rounded-lg inline-block backdrop-blur-sm">
                      {plannings.length === 0
                        ? "No defense schedules found. Create your first schedule above."
                        : "No matching PFE projects found. Try adjusting your filter."}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPlanningPage;
