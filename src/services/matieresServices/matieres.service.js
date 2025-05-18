import axiosAPI from "../axiosAPI/axiosInstance";

const matieresServices = {
    fetchMatieres: async ({ page = 1, searchTerm = '', sortBy = '_id', order = 'desc', limit = 9 }) => {
        try {
            const response = await axiosAPI.get("/matieres", {
                params: { page, limit, searchTerm, sortBy, order }
            });
            return response.data;
        } catch (err) {
            throw err.response?.data?.message || "Failed to load subjects.";
        }
    },

    fetchMatiereById: async (id, page = 1, searchTerm = '', sortBy = '_id', order = 'desc', limit = 9) => {
        if (!id) throw new Error("Invalid subject ID.");
        try {
            const response = await axiosAPI.get(`/matieres/${id}`, {
                params: { page, limit, searchTerm, sortBy, order }
            });
            return response.data;
        } catch (err) {
            throw err.response?.data?.error || "Failed to fetch subject.";
        }
    },

    fetchMatiereByIdArchive: async (id, page = 1, search = '', limit = 9, teacherId = null, academicYear = null) => {
        if (!id) throw new Error("Invalid subject ID.");
        try {
            const response = await axiosAPI.get(`/matieres/${id}/getArchive`, {
                params: { page, limit, search, teacherId, academicYear }
            });
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
    addUpdatePropositionMatiere: async (editSubject) => {
        if (!editSubject || !editSubject._id) {
            throw new Error("Invalid subject data: Missing ID.");
        }
        try {
            const response = await axiosAPI.patch(`/matieres/${editSubject._id}/proposition`, editSubject);
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            throw err.response?.data?.error || err.response?.data?.message || "Failed to update subject.";
        }
    },
    fetchUpdatePropositionMatiere: async (subjectId) => {
        if (!subjectId) {
            throw new Error("Invalid subject data: Missing ID.");
        }
        try {
            const response = await axiosAPI.get(`/matieres/${subjectId}/proposition`);
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            throw err.response?.data?.error || "Failed to fetch subject.";
        }
    },
    updateMatiereAvancement: async (editSubject) => {
        if (!editSubject || !editSubject._id) {
            throw new Error("Invalid subject data: Missing ID.");
        }
        try {
            const response = await axiosAPI.patch(`/matieres/${editSubject._id}/avancement`, editSubject);
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            throw err.response?.data?.error || err.response?.data?.message || "Failed to update subject.";
        }
    },
    sendEvaluationNotif: async (subjectId = null) => {
        const data = {};
        if (subjectId) {
            data.subjectId = subjectId;
        }

        try {
            const response = await axiosAPI.post(`/matieres/evaluation`, data);
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            throw err.response?.data?.error || err.response?.data?.message || "Failed to open evaluation session.";
        }
    },
    getEvaluationsBySubject: async (subjectId = null) => {
        if (!subjectId) {
            throw new Error("Id is required.");
        }
        try {
            const response = await axiosAPI.get(`/matieres/${subjectId}/evaluation`);
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data);

                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            throw err.response?.data?.error || err.response?.data?.message || "Failed to get evaluations.";
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
    // evaluateMatiere: async (id, evaluationData) => {
    //     if (!id) throw new Error("Invalid subject ID.");
    //     try {
    //         const response = await axiosAPI.post(`/matieres/${id}/evaluation`, evaluationData);
    //         return response.data;
    //     } catch (err) {
    //         throw err.response?.data?.error || "Failed to evaluate subject.";
    //     }
    // },

    evaluateMatiere: async (subjectId = null, evaluationArray = [], additionalComment = "") => {
        if (!subjectId || !Array.isArray(evaluationArray) || evaluationArray.length === 0) {
            throw new Error("Subject ID and evaluation data are required.");
        }

        // Optional: Validate each evaluation item (if needed)
        const isValidEvaluation = evaluationArray.every(item =>
            Object.prototype.hasOwnProperty.call(item, 'description') && typeof item.description === 'string' &&
            Object.prototype.hasOwnProperty.call(item, 'rank') && typeof item.rank === 'number'
        );

        if (!isValidEvaluation) {
            throw new Error("Each evaluation item must have a description and a numeric rank.");
        }

        try {
            const data = {
                evaluation: evaluationArray,
                comment: additionalComment || undefined, // Include comment only if it's not an empty string
            };

            const response = await axiosAPI.post(`/matieres/${subjectId}/evaluation`, data);

            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            // Improved error handling to check for the response structure
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to submit evaluation.";
            throw new Error(errorMessage);
        }
    },

    checkEvaluatedStudentMatiere: async (subjectId) => {
        if (!subjectId) throw new Error("Subject ID is required.");

        try {
            const response = await axiosAPI.get(`/matieres/${subjectId}/check-evaluation`);

            if (response.status === 200) {
                return response.data; // { message: "You can evaluate this subject." }
            }

            throw new Error("Evaluation not allowed.");
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to check evaluation.";
            throw new Error(errorMessage);
        }
    },

    validatePropositionMatiere: async (id, subjectId, isApproved = false) => {
        if (!id || !subjectId) {
            throw new Error("Invalid subject data: Missing ID.");
        }
        const data = {
            subjectId,
            isApproved,
        };

        try {
            const response = await axiosAPI.patch(`/matieres/${id}/validate`, data);
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            throw err.response?.data?.error || err.response?.data?.message || "Failed to update subject.";
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
    affectTeachersToSubjects: async (assignments = []) => {
        try {
            console.log(assignments);

            const response = await axiosAPI.post("/matieres/affectTeachersToSubjects", { assignments });
            return response.data;
        } catch (err) {
            throw err.response?.data?.message || "Failed to assign teachers to subjects.";
        }
    },
    getCurrentAcademicYear: async () => {
        try {
            const response = await axiosAPI.get(`/matieres/getCurrentAcadYear`);
            return response.data;
        } catch (err) {
            throw err.response?.data?.error || "Failed to fetch Acad.";
        }
    },

};


export default matieresServices;
