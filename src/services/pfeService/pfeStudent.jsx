import axios from "axios";

const API_URL = "http://localhost:3000/api/PFE"; // Ensure this is correct

// 🟢 Function to create a PFE
export const createPFE = async (formData) => {
  console.log("🟢 Debugging FormData before sending to backend (Create PFE):");

  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const response = await axios.post(`${API_URL}/post`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ PFE created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "🔴 Error creating PFE:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// 🟢 Function to update a PFE
export const updatePFE = async (id, formData) => {
  console.log("🟢 Debugging FormData before sending to backend (Update PFE):");

  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  console.log("before sending to backend");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  try {
    const response = await axios.patch(`${API_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ PFE updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "🔴 Error updating PFE:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// 🟢 Function to get PFE by user
export const getPFEByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    console.log("✅ Fetched PFE:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "🔴 Error fetching PFE:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
