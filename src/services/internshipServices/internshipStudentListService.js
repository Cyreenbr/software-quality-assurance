import axios from "axios";

const API_URL = "http://localhost:3000/api/internship/stage/getList";

const internshipService = {

 getInternships : async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "multipart/form-data",
      ...(token && { "Authorization": `Bearer ${token}` })
    };  
    const response = await axios.get(API_URL, { headers });
    return response.data;
  } catch (error) {
    console.error("Error while fetching infos", error);
    return [];
  }
},
};

export default internshipService;
