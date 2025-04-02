import axiosAPI from "../axiosAPI/axiosInstance";

export const getTeachers = async () => {
  try {
    const response = await axiosAPI.get(`/teachers/`);
    console.log("List of teachers retrieved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting teachers:", error.response?.data || error.message);
    throw error;
  }
};

export const insertTeacherFromExcel = async (formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    const response = await axiosAPI.post(`/teachers/upload`, formData, config);
    console.log("Teacher upload successful");
    return response.data;
  } catch (error) {
    console.error("Error uploading teachers:", error.response?.data || error.message);
    throw error;
  }
};