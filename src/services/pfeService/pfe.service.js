import axios from "axios";
import axiosAPI from "../axiosAPI/axiosInstance";
import { toast } from "react-toastify";

const API_URL = "http://localhost:3000/api/PFE";

export const createPFE = async (formData) => {
  try {
    const response = await axiosAPI.post(`${API_URL}/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("PFE created successfully");
    return response.data;
  } catch (error) {
    console.error(
      " Error creating PFE:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updatePFE = async (id, formData) => {
  try {
    console.log(" FormData before sending:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await axios.patch(`${API_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("PFE updated successfully");
    return response.data;
  } catch (error) {
    console.error(
      " Error updating PFE:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getPFEByUser = async (userId) => {
  try {
    const response = await axiosAPI.get(`${API_URL}/user/${userId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      " Error fetching PFE:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getPfeList = async () => {
  try {
    const response = await axiosAPI.get(`${API_URL}/listforteacher`);
    console.log("PFE List Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      " Error loading PFE list:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const choosePfe = async (id) => {
  try {
    const response = await axiosAPI.patch(`${API_URL}/${id}/choice`);
    return response.data;
  } catch (error) {
    console.error(
      " Error choosing PFE:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleAction = async (id, action) => {
  try {
    const response = await axiosAPI.patch(`${API_URL}/planning/assign`, {
      pfeIds: [id],
      action,
    });
    console.log(
      ` Action ${action} on PFE with ID ${id} executed successfully.`
    );
    toast.success(`PFE ${action}`);

    return response.data;
  } catch (error) {
    toast.error(` ${error.response?.data?.message || error.message}`);
    console.error(
      ` Error handling ${action} on PFE:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const assignPFEManually = async (id, teacherId) => {
  try {
    const response = await axiosAPI.patch(`${API_URL}/${id}/planning/assign`, {
      teacherId,
      force: true,
    });
    console.log(" PFE manually assigned to teacher:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      " Error assigning PFE manually:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const togglePublication = async (isPublished) => {
  try {
    const response = await axiosAPI.post(
      `${API_URL}/planning/publish/${isPublished ? "hide" : "publish"}`
    );
    toast.success(`Planning ${isPublished ? "hidden" : "published"}`);
    return response.data;
  } catch (error) {
    console.error(
      " Error toggling publication status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const sendEmail = async (type) => {
  try {
    const response = await axiosAPI.post(`${API_URL}/planning/send`, {
      sendType: type,
    });
    toast.success(` ${type === "first" ? "First" : "Modified"} email sent.`);
    return response.data;
  } catch (error) {
    console.error(
      " Error sending email:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchPFEChoices = async () => {
  try {
    const response = await axiosAPI.get(`${API_URL}/list`);

    return response.data;
  } catch (error) {
    console.error("Error fetching PFE data:", error);
    throw error;
  }
};

export const fetchTeachers = async () => {
  try {
    const response = await axiosAPI.get("http://localhost:3000/api/teachers");
    return response.data.model || [];
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const getPlanning = async () => {
  try {
    const response = await axiosAPI.get(`${API_URL}/planning`);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("No response from server:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    throw error;
  }
};
