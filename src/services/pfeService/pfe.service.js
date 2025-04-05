import axios from "axios";

// Base API URL
const API_URL = "http://localhost:3000/api/PFE"; // Ensure this URL is correct

// Auth header with token from localStorage
const authHeader = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

// 🟢 Function to create a PFE
export const createPFE = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/post`, formData, {
      headers: {
        ...authHeader,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("✅ PFE created successfully:", response.data);
    return response.data;
  } catch (error) {
    s;
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
        ...authHeader,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ PFE updated successfully:", response.data);
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
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: authHeader,
    });
    console.log("✅ Fetched PFE:", response.data);
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
    const response = await axios.get(`${API_URL}/listforteacher`, {
      headers: authHeader,
    });
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
    const response = await axios.patch(
      `${API_URL}/${id}/choice`,
      {},
      {
        headers: authHeader,
      }
    );
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
    const response = await axios.patch(
      `${API_URL}/planning/assign`,
      { pfeIds: [id], action },
      { headers: authHeader }
    );
    console.log(
      `✅ Action ${action} on PFE with ID ${id} executed successfully.`
    );
    return response.data;
  } catch (error) {
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
    const response = await axios.patch(
      `${API_URL}/${id}/planning/assign`, // ID is part of the URL
      { teacherId, force: true },
      { headers: authHeader }
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
    const response = await axios.post(
      `${API_URL}/planning/publish/${isPublished ? "hide" : "publish"}`,
      {},
      { headers: authHeader }
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
    const response = await axios.post(
      `${API_URL}/planning/send`,
      { sendType: type },
      { headers: authHeader }
    );
    console.log(`✅ ${type === "first" ? "First" : "Modified"} email sent.`);
    return response.data;
  } catch (error) {
    console.error(
      "🔴 Error sending email:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const fetchPFEChoices = async (token) => {
  try {
    const response = await axios.get("http://localhost:3000/api/pfe/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching PFE data:", error);
    throw error;
  }
};

// Fetch teachers
export const fetchTeachers = async (token) => {
  try {
    const response = await axios.get("http://localhost:3000/api/teachers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.model || [];
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};
