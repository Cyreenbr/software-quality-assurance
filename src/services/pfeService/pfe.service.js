import axios from "axios";
import axiosAPI from "../axiosAPI/axiosInstance";
import { toast } from "react-toastify";

// Base API URL
const API_URL = "http://localhost:3000/api/PFE"; // Ensure this URL is correct

// 🟢 Function to create a PFE
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
      "🔴 Error creating PFE:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🟢 Function to update a PFE
export const updatePFE = async (id, formData) => {
  try {
    console.log("📦 FormData before sending:");
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
      "🔴 Error updating PFE:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🟢 Function to get PFE by user
export const getPFEByUser = async (userId) => {
  try {
    const response = await axiosAPI.get(`${API_URL}/user/${userId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "🔴 Error fetching PFE:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Function to get PFE list
export const getPfeList = async () => {
  try {
    const response = await axiosAPI.get(`${API_URL}/listforteacher`);
    console.log("PFE List Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "🔴 Error loading PFE list:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Function to choose a PFE
export const choosePfe = async (id) => {
  try {
    const response = await axiosAPI.patch(`${API_URL}/${id}/choice`);
    return response.data;
  } catch (error) {
    console.error(
      "🔴 Error choosing PFE:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🟢 Function to approve or reject a PFE
export const handleAction = async (id, action) => {
  try {
    const response = await axiosAPI.patch(`${API_URL}/planning/assign`, {
      pfeIds: [id],
      action,
    });
    console.log(
      `✅ Action ${action} on PFE with ID ${id} executed successfully.`
    );
    toast.success(`PFE ${action}`);

    return response.data;
  } catch (error) {
    toast.error(`🔴 ${error.response?.data?.message || error.message}`);
    console.error(
      `🔴 Error handling ${action} on PFE:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🟢 Function to assign a PFE manually to a teacher
export const assignPFEManually = async (id, teacherId) => {
  try {
    const response = await axiosAPI.patch(
      `${API_URL}/${id}/planning/assign`, // ID is part of the URL
      { teacherId, force: true }
    );
    console.log("✅ PFE manually assigned to teacher:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "🔴 Error assigning PFE manually:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🟢 Function to toggle the publication status (Publish/Hide PFE)
export const togglePublication = async (isPublished) => {
  try {
    const response = await axiosAPI.post(
      `${API_URL}/planning/publish/${isPublished ? "hide" : "publish"}`
    );
    console.log(`✅ Planning ${isPublished ? "hidden" : "published"}`);
    return response.data;
  } catch (error) {
    console.error(
      "🔴 Error toggling publication status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🟢 Function to send an email (First or Modified)
export const sendEmail = async (type) => {
  try {
    const response = await axiosAPI.post(`${API_URL}/planning/send`, {
      sendType: type,
    });
    toast.success(` ${type === "first" ? "First" : "Modified"} email sent.`);
    return response.data;
  } catch (error) {
    console.error(
      "🔴 Error sending email:",
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

// Fetch teachers
export const fetchTeachers = async () => {
  try {
    const response = await axiosAPI.get("http://localhost:3000/api/teachers");
    return response.data.model || [];
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

// Assuming API_URL is declared elsewhere, like in an environment file or constants.
export const getPlanning = async () => {
  try {
    const response = await axiosAPI.get(`${API_URL}/planning`);

    return response.data; // Return the fetched data
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
