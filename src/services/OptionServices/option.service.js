import axiosAPI from "../axiosAPI/axiosInstance";
export const chooseOption = async (optionData) => {
    try {
        console.log("Sending option data...");
        const response = await axiosAPI.post('/options', optionData);

        console.log("Option choice successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error choosing option:", error.response?.data || error.message);
        throw error;
    }
};
export const getQuota = async (response) => {
    try {
        const res = await axiosAPI.get(`/options/quota`);
        console.log("Option quota retrieved successfully:", res.data);
        return res.data;
    } catch (error) {
        console.error(
            "Error getting quota options:",
            error.response?.data || error.message
        );
        throw error;
    }
};
export const editquota = async (response) => {
    try {
        const res = await axiosAPI.post(`/options/quota`, response);
        console.log("Quota updated successfully:", res.data);
        return res.data;
    } catch (error) {
        console.error(
            "Error updating quota:",
            error.response?.data || error.message
        );
        throw error;
    }
};
export const getOptions = async () => {
    try {
        console.log("Fetching options list data...");
        const response = await axiosAPI.get('/options/students');

        console.log("Options retrieved successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching option list:", error.response?.data || error.message);
        throw error;
    }
};
export const deleteOption = async () => {
    try {
        console.log("Fetching options list data...");
        const response = await axiosAPI.get('/options/students');

        console.log("Options retrieved successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching option list:", error.response?.data || error.message);
        throw error;
    }
};
export const editOption = async (userId, data) => {
    try {
        console.log("Updating option data...", data);
        const response = await axiosAPI.patch(`/options/${userId}/update`, data);
        console.log("Option updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating option:", error.response?.data || error.message);
        throw error;
    }
};

export const checkOptionperiod = async () => {
    try {
        console.log("checking option period...");
        const response = await axiosAPI.get("/period/checkoptionperiod");

        console.log("Option period retrieved successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Error checking eligibility::",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const checkOptionstudent = async (userId) => {
    try {
        console.log("checking option for user...");
        const response = await axiosAPI.get(`/options/optionstudent/${userId}`);
        console.log("Option retrieved successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Error checking option:",
            error.response?.data || error.message
        );
        throw error;
    }
};
export const computeOption = async () => {
    try {
        const response = await axiosAPI.patch(`/options/compute`);
        console.log("Option calculation commputed successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Error computing options:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const publishStudentsOptions = async (response) => {
    try {
        console.log(`Publishing students options with response: ${response}`);
        const res = await axiosAPI.post(`/options/publish/${response}`);
        console.log("Option list updated successfully:", res.data);
        return res.data;
    } catch (error) {
        console.error(
            "Error publishing students options:",
            error.response?.data || error.message
        );
        throw error;
    }
};
export const ListIsPublished = async () => {
    try {
        // Use GET request since we're retrieving data, not creating/updating
        const response = await axiosAPI.get(`/options/listoption`);
        console.log("Option list publication status:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Error checking publication status:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const notifyStudentsOfOptions = async (params) => {
    try {
        // Change to POST and pass the parameters
        const response = await axiosAPI.post(`/options/send`, params);
        console.log("Option list publication status:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Error checking publication status:",
            error.response?.data || error.message
        );
        throw error;
    }
};
export const validatestudentsOptions = async () => {
    try {
        const response = await axiosAPI.patch(`/options/validate`);
        console.log("Option list publication status:", response.data.message);
        return response.data;
    } catch (error) {
        console.error(
            "Error checking publication status:",
            error.response?.data || error.message
        );
        throw error;
    }
}
