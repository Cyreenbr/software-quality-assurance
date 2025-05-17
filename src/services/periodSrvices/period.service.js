import axiosAPI from "../axiosAPI/axiosInstance";

const periodService = {
  getPeriods: async () => {
    try {
      const response = await axiosAPI.get(`/period/open`);
      return response.data;
    } catch (error) {
      console.error("Error API (GET periods) :", error);
      return null;
    }
  },

  addPeriod: async (periodData) => {
    try {
      console.log(periodData);
      const response = await axiosAPI.post(`/period/open`, periodData);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Erreur API (POST addPeriod) :", error);
      return null;
    }
  },

  updatePeriod: async (id, updatedData) => {
    try {
      const response = await axiosAPI.patch(`/period/open/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error API (PATCH updatePeriod) :", error);
      return null;
    }
  },
};

export default periodService;
