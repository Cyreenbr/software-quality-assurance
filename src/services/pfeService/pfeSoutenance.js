import axios from "axios";
import axiosAPI from "../axiosAPI/axiosInstance";
import { toast } from "react-toastify";
const BASE_URL = "http://localhost:3000/api/defense";

export const togglePublication = async (isPublished) => {
  try {
    console.log(isPublished ? "hide" : "publish");
    const response = await axiosAPI.post(
      `${BASE_URL}/publish/${isPublished ? "hide" : "publish"}`
    );
    toast.success(`Planning ${isPublished ? "hidden" : "published"}`);
    return response.data;
  } catch (error) {
    console.error(
      " Error toggling publication status:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getPlannings = async () => {
  const res = await axiosAPI.get(`${BASE_URL}/planning`);
  console.log(res.data);
  return res.data;
};
export const createPlanning = async (data) => {
  console.log(data);
  const res = await axiosAPI.post(`${BASE_URL}`, data);
  return res.data;
};

export const updateSoutenance = async (soutenanceId, data) => {
  const res = await axiosAPI.patch(`${BASE_URL}/${soutenanceId}`, data);
  return res.data;
};

export const sendEmail = async () => {
  try {
    const res = await axiosAPI.post(`${BASE_URL}/sendEmails`, {});
    toast.success(`📨 Email envoyé avec succès !`);
    return res.data;
  } catch (error) {
    toast.error(
      `❌ Erreur lors de l'envoi de l'email : ${
        error.response?.data?.message || error.message || "Erreur inconnue"
      }`
    );
  }
};

export const getTeacherPlannings = async () => {
  const res = await axiosAPI.get(`${BASE_URL}/me`);
  return res.data;
};

export const getStudentDefense = async () => {
  const res = await axiosAPI.get(`${BASE_URL}/student/me`);
  return res.data;
};
