import axiosAPI from "../axiosAPI/axiosInstance";

const competenceServices = {
    fetchCompetences: async (page = 1, searchTerm = '', sortBy = '_id', order = 'desc', limit = 10) => {
        try {
            const response = await axiosAPI.get("/competences", {
                params: {
                    page,
                    limit,
                    searchTerm,
                    sortBy,
                    order,
                }
            });
            return response.data;
        } catch (err) {
            throw err.response?.data?.error || "Failed to load skills.";
        }
    },
    addCompetence: async (newSkill) => {
        try {
            const response = await axiosAPI.post("/competences", newSkill);
            if (response.status === 201) {
                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            throw err.response?.data?.message || "Failed to add skill.";
        }
    },
    updateCompetence: async (editSkill) => {
        if (!editSkill || !editSkill._id) {
            throw new Error("Invalid skill data: Missing ID.");
        }
        try {
            const response = await axiosAPI.patch(`/competences/${editSkill._id}`, editSkill);
            if (response.status === 201) {
                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            throw err.response?.data?.error || err.response?.data?.message || "Failed to update skill.";
        }
    },
    deleteCompetence: async (id, forced = false) => {
        if (!id) {
            throw new Error("Invalid skill ID.");
        }
        try {
            await axiosAPI.delete(`/competences/${id}`, { data: { forced } });
            return { message: "Competence deleted successfully!" };
        } catch (err) {
            throw err.response?.data?.error || err.response?.data?.message || "Failed to delete skill.";
        }
    },
    fetchFamilies: async () => {
        try {
            const response = await axiosAPI.get("/family/");
            return response.data;
        } catch (err) {
            throw err.response?.data?.message || "Failed to load families.";
        }
    }
};

export default competenceServices;
