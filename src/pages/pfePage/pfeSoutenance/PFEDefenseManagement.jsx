import React, { useEffect, useState } from "react";
import {
  getPlannings,
  createPlanning,
  updateSoutenance,
  sendEmail,
  togglePublication,
} from "../../../services/pfeService/pfeSoutenance";
import {
  fetchPFEChoices,
  fetchTeachers,
} from "../../../services/pfeService/pfe.service";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
      console.log(teacherRes);
      const pfeIdsWithDefense = planningRes.defenses.map(
        (plan) => plan.pfe._id
      );
      const pfeWithoutDefense = Array.isArray(pfeRes)
        ? pfeRes.filter((pfe) => !pfeIdsWithDefense.includes(pfe.pfeId))
        : [];
      console.log(pfeRes);
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
      setMessage("Erreur lors du chargement des données.");
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
      //const newStatus = !isPublished;
      await togglePublication(isPublished);
      setIsPublished(isPublished); // <- update the UI state

      await loadData();
    } catch (err) {
      setMessage("Erreur lors du changement de statut de publication.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedPfe = pfes.find((p) => p.pfeId === form.pfeId);
    const encadrantId = selectedPfe?.IsammSupervisor?._id;

    if (
      form.presidentId === form.reporterId ||
      form.presidentId === encadrantId ||
      form.reporterId === encadrantId
    ) {
      setMessage(
        "Le président, le rapporteur et l'encadrant doivent être trois personnes différentes."
      );
      return;
    }

    try {
      if (editingId) {
        await updateSoutenance(editingId, form);
        setMessage("Planning mis à jour avec succès.");
      } else {
        await createPlanning(form);
        setMessage("Planning créé avec succès.");
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
        err.response?.data?.message || "Erreur lors de l'enregistrement."
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
    console.log(planning._id);
    setEditingId(planning._id);
  };

  const handleSendEmail = async () => {
    try {
      await sendEmail();
      setMessage("Email envoyé avec succès.");
    } catch (err) {
      setMessage("Erreur lors de l'envoi de l'email.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Gestion des Plannings de Soutenance
      </h1>

      {loading && (
        <p className="text-blue-500 mb-4 text-center">Chargement en cours...</p>
      )}
      {message && (
        <div className="mb-4 px-4 py-2 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-700">
          {editingId ? "Modifier" : "Créer"} une soutenance
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <select
            name="pfeId"
            value={form.pfeId}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">-- Choisir un PFE --</option>
            {pfes.map((pfe) => (
              <option key={pfe.pfeId} value={pfe.pfeId}>
                {pfe.title}
              </option>
            ))}
          </select>

          <input
            name="room"
            value={form.room}
            onChange={handleChange}
            type="text"
            placeholder="Salle"
            required
            className="border p-2 rounded w-full"
          />

          <select
            name="presidentId"
            value={form.presidentId}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">-- Président du jury --</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.firstName}
              </option>
            ))}
          </select>

          <select
            name="reporterId"
            value={form.reporterId}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">-- Rapporteur --</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.firstName}
              </option>
            ))}
          </select>

          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            type="date"
            required
            className="border p-2 rounded w-full"
          />
          <input
            name="time"
            value={form.time}
            onChange={handleChange}
            type="time"
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition duration-200"
          >
            {editingId ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </form>

      {/* Boutons Email & Publication */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSendEmail}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition"
        >
          📧 Envoyer Email
        </button>
        <button
          onClick={handleTogglePublish}
          className={`py-2 px-4 rounded ${
            isPublished ? "bg-gray-500" : "bg-green-500"
          } text-white`}
        >
          {isPublished ? (
            <FaEyeSlash className="inline mr-2" />
          ) : (
            <FaEye className="inline mr-2" />
          )}
          {isPublished ? "Hide Planning" : "Publish Planning"}
        </button>
      </div>

      {/* Liste des plannings */}
      <div className="mt-10 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Plannings existants
        </h2>
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2 border">PFE</th>
              <th className="p-2 border">Salle</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Heure</th>
              <th className="p-2 border">Encadrant</th>
              <th className="p-2 border">Président</th>
              <th className="p-2 border">Rapporteur</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(plannings) && plannings.length > 0 ? (
              plannings.map((plan, index) => (
                <tr
                  key={plan._id || index}
                  className="odd:bg-white even:bg-gray-50"
                >
                  <td className="p-2 border">{plan.pfe?.title || "N/A"}</td>
                  <td className="p-2 border">{plan.room}</td>
                  <td className="p-2 border">
                    {new Date(plan.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-2 border">{formatTime(plan.time)}</td>
                  <td className="p-2 border">
                    {plan.pfe?.IsammSupervisor?.email || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {plan.presidentId?.email || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {plan.reporterId?.email || "N/A"}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      ✏️ Modifier
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  Aucun planning trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPlanningPage;
