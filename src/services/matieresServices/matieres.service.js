import axiosAPI from "../axiosAPI/axiosInstance";

const matieresServices = {
    fetchMatieres: async (page = 1, searchTerm = '', sortBy = '_id', order = 'desc', limit = 9) => {
        try {
            const response = await axiosAPI.get("/matieres", {
                params: { page, limit, searchTerm, sortBy, order }
            });
            return response.data;
        } catch (err) {
            throw err.response?.data?.message || "Failed to load subjects.";
        }
    },

    fetchMatiereById: async (id) => {
        if (!id) throw new Error("Invalid subject ID.");
        try {
            const response = await axiosAPI.get(`/matieres/${id}`);
            return response.data;
        } catch (err) {
            throw err.response?.data?.error || "Failed to fetch subject.";
        }
    },

    addMatieres: async (newSubject) => {
        try {
            const response = await axiosAPI.post("/matieres", newSubject);
            // if (response.status >= 200 && response.status < 300) {
            if (response.status === 201) {
                return {
                    data: response.data,
                    status: response.status
                };
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            // console.log(err);
            throw err.response?.data?.message || "Failed to add subject.";
        }
    },

    addMatieresById: async (id, subjectData) => {
        if (!id) throw new Error("Invalid subject ID.");
        try {
            const response = await axiosAPI.post(`/matieres/${id}`, subjectData);
            if (response.status === 201) {
                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            throw err.response?.data?.message || "Failed to add subject with ID.";
        }
    },

    updateMatieres: async (editSubject) => {
        if (!editSubject || !editSubject._id) {
            throw new Error("Invalid subject data: Missing ID.");
        }
        try {
            const response = await axiosAPI.patch(`/matieres/${editSubject._id}`, editSubject);
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            throw err.response?.data?.error || err.response?.data?.message || "Failed to update subject.";
        }
    },
    deleteMatiere: async (id, { forced = false, archive = false }) => {
        if (!id) {
            throw new Error("Invalid skill ID.");
        }
        try {
            const resonse = await axiosAPI.delete(`/matieres/${id}`, { data: { forced, archive } });
            console.log(resonse.data);

            return { message: resonse?.message ? resonse.message : archive ? "Matiere archived successfully!" : "Matiere deleted successfully!" };
        } catch (err) {
            throw err.response?.data?.error || err.response?.data?.message || "Failed to delete Matiere.";
        }
    },
    // 🔹 Publier une matière (POST /publish/:response)
    publishMatieres: async (responseValue) => {
        console.log(responseValue);

        if (!responseValue || responseValue !== "publish" && responseValue !== "masque")
            throw new Error("Invalid subject response.");
        try {
            const response = await axiosAPI.post(`/matieres/publish/${responseValue}`);
            return response.data;
        } catch (err) {
            throw err.response?.data?.error || "Failed to publish subject.";
        }
    },
    publishMatiereById: async (id, responseValue) => {
        if (!id) throw new Error("Invalid subject ID.");
        if (!responseValue || responseValue !== "publish" || responseValue !== "masque")
            throw new Error("Invalid subject response.");
        try {
            const response = await axiosAPI.post(`/matieres/publish/${id}/${responseValue}`);
            return response.data;
        } catch (err) {
            throw err.response?.data?.error || "Failed to publish subject.";
        }
    },
    evaluateMatiere: async (id, evaluationData) => {
        if (!id) throw new Error("Invalid subject ID.");
        try {
            const response = await axiosAPI.post(`/matieres/${id}/evaluation`, evaluationData);
            return response.data;
        } catch (err) {
            throw err.response?.data?.error || "Failed to evaluate subject.";
        }
    },

    fetchTeachers: async ({ page = 1, searchTerm = '', sortBy = '_id', order = 'desc', limit = 5 }) => {
        try {
            const response = await axiosAPI.get("/teachers/forForm", {
                params: { page, limit, searchTerm, sortBy, order }
            });
            return response.data;
        } catch (err) {
            throw err.response?.data?.message || "Failed to load teachers.";
        }
    },
    fetchTeacherById: async (id) => {
        try {
            const response = await axiosAPI.get(`/teachers/forForm/${id}`);
            return response.data;
        } catch (err) {
            throw err.response?.data?.message || "Failed to load teacher with id " + id;
        }
    },
};

export default matieresServices;
