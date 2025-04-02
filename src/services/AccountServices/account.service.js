import axiosAPI from "../axiosAPI/axiosInstance";

export const registerUser = async (userData) => {
    try {
        const response = await axiosAPI.post(`/users/register`, userData);
        console.log("User added with success:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding user:", error.response?.data || error.message);
        throw error;
    }

};/*
export const login = async (credentials) => {
    const result = await axios.post(
      "http://localhost:3000/api/users/login",
      credentials
    )
    return result.data.token
  }
*/

export const insertStudentsFromExcel = async (userData) => {
    const response = await axiosAPI.post(`/students/upload`, userData);
    console.log("yesssssss")
    return response.data;
};