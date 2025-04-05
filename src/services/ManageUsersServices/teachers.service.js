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

export const deleteTeacher = async (teacherId) => {
  try {
    const response = await axiosAPI.post(`/teachers/archiveTeacher`, {
      teacherId: teacherId,  // Changé de studentId à teacherId
      force: true
    });
    console.log("Teacher deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting Teacher:", error.response?.data || error.message);
    throw error;
  }
};

export const editTeacher = async (_id, editedData) => {
  try {
    const response = await axiosAPI.patch(`/teachers/${_id}`, editedData);
    console.log("teacher edited successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error editing teacher:", error);
    throw error;
  }
};


export const editPasswordTeacher = async (_id, userpass) => {
  try {
    console.log("Sending password update:", {
      _id,
      oldPassword: userpass.oldPassword,
      newPassword: userpass.newPassword,
      confirmationPassword: userpass.confirmationPassword
    });
    
    const response = await axiosAPI.patch(`/teachers/${_id}/password`, userpass);
    
    console.log("teacher's password updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating teacher's password:", error);
    throw error;
  }
};