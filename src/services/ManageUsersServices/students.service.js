import axiosAPI from "../axiosAPI/axiosInstance";

export const getStudents = async () => {
  try {
    const response = await axiosAPI.get(`/students/`);
    console.log("List of students retrieved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting students:", error.response?.data || error.message);
    throw error;
  }
};
export const deleteStudent = async (studentId) => {
    try {
      const response = await axiosAPI.post(`/students/archiveStudent`, {
        studentId: studentId,
        force: true
      });
      console.log("Student deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting student:", error.response?.data || error.message);
      throw error;
    }
  };

