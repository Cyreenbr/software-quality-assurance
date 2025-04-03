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
        console.error("Error fetching student:", error);
        throw error;
    }
};
export const editPassword = async (_id,userpass) => {
    try {
        const response = await axiosAPI.patch(`/students/${_id}/password`, userpass);

        console.log("Student's password updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating student's password:", error);
        throw error;
    }
};
