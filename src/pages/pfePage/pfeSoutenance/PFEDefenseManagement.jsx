import { useEffect, useState } from "react";
import { FaCalendarAlt, FaEdit, FaEye, FaEyeSlash, FaPaperPlane } from "react-icons/fa";
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

  useEffect(() => {
    loadData();
  }, [editingId]);

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
      setIsPublished(isPublished);
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
      setMessage(
        err.response?.data?.message || "Error saving the schedule."
      );
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

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="bg-transparent rounded-lg shadow-sm overflow-hidden">
        <div className="bg-transparent p-4 text-blue-400">
          <h1 className="text-2xl font-bold text-center">
            Defense Schedule Management
          </h1>
        </div>

        <div className="p-4 md:p-6">
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {message && (
            <div className={`mb-4 p-3 rounded-md ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              {editingId ? "Edit Defense" : "New Defense Schedule"}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thesis</label>
                <select
                  name="pfeId"
                  value={form.pfeId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a thesis</option>
                  {pfes.map((pfe) => (
                    <option key={pfe.pfeId} value={pfe.pfeId}>
                      {pfe.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <input
                  name="room"
                  value={form.room}
                  onChange={handleChange}
                  type="text"
                  placeholder="Room"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">President</label>
                <select
                  name="presidentId"
                  value={form.presidentId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a president</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.firstName} {t.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reporter</label>
                <select
                  name="reporterId"
                  value={form.reporterId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a reporter</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.firstName} {t.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  type="time"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>

          {/* Email & Publication Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 justify-end">
            <button
              onClick={handleSendEmail}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaPaperPlane className="mr-2" />
              Send Email
            </button>
            <button
              onClick={handleTogglePublish}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isPublished ? "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500" : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              }`}
            >
              {isPublished ? (
                <FaEyeSlash className="mr-2" />
              ) : (
                <FaEye className="mr-2" />
              )}
              {isPublished ? "Hide Schedule" : "Publish Schedule"}
            </button>
          </div>

          {/* Schedules List */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              Existing Schedules
            </h2>
            
            <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thesis</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">President</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(plannings) && plannings.length > 0 ? (
                    plannings.map((plan) => (
                      <tr key={plan._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{plan.pfe?.title || "N/A"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{plan.room}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {plan.date ? new Date(plan.date).toLocaleDateString("en-US") : "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatTime(plan.time)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {plan.pfe?.IsammSupervisor?.email || "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {plan.presidentId?.email || "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {plan.reporterId?.email || "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleEdit(plan)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <FaEdit className="mr-1" /> Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-4 py-4 text-center text-sm text-gray-500">
                        No schedules found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlanningPage;