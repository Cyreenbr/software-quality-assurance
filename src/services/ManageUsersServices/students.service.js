import axiosAPI from "../axiosAPI/axiosInstance";

export const getStudents = async () => {
  try {
    const response = await axiosAPI.get(`/students/`);
    console.log("Students retrieved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const editStudent = async (_id, editedData) => {
  try {
    const response = await axiosAPI.patch(`/students/${_id}`, editedData);
    console.log("Student edited successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error editing student:", error);
    throw error;
  }
};

export const getStudentById = async (userid) => {
  try {
    const response = await axiosAPI.get(`/students/${userid}`);
    console.log("Student fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error.response?.data || error.message);
    throw error;
  }

};/*
export const deleteStudent = async (studentId, force = false) => {
  try {
    const response = await axiosAPI.post(`/students/archiveStudent`, {
      studentId: studentId,
      force: force
    });
    console.log("Sending delete with:", { studentId, force });

    console.log("Student deletion response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting student:", error.response?.data || error.message);
    throw error;
  }
};*/export const deleteStudent = async (studentId, force = false) => {
  try {
    const response = await axiosAPI.post(`/students/archiveStudent`, {
      studentId,
      force: force // Bien envoyer le paramètre force
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
};
export const editPassword = async (_id, userpass) => {
  try {
    console.log("Sending password update:", {
      _id,
      oldPassword: userpass.oldPassword,
      newPassword: userpass.newPassword,
      confirmationPassword: userpass.confirmationPassword
    });
    
    const response = await axiosAPI.patch(`/students/${_id}/password`, userpass);
    
    console.log("Student's password updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating student's password:", error);
    throw error;
  }

};
export const getStudentsforTearchers = async () => {
  try {
    const response = await axiosAPI.get(`/students/studentslist`);
    console.log("Students retrieved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};
