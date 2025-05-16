import axiosAPI from "../axiosAPI/axiosInstance";

const notifServices = {
    // Fetch notifications of a user with optional search term
    fetchUserNotifications: async (page = 1, limit = 9, searchTerm = "") => {
        try {
            const response = await axiosAPI.get("/notifications/", {
                params: { page, limit, searchTerm }, // Add searchTerm to the params
            });
            return response.data;
        } catch (err) {
            throw err.response?.data?.message || "Failed to fetch notifications.";
        }
    },

    // Mark all notifications as read for a user
    markAllNotificationsAsRead: async () => {
        try {
            const response = await axiosAPI.patch(`/notifications/mark-all-read`);
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            throw err.response?.data?.message || "Failed to mark notifications as read.";
        }
    },
    // Mark a specific notification as clicked
    markNotificationAsClicked: async (id) => {
        try {
            const response = await axiosAPI.patch(`/notifications/${id}/clicked`);
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (err) {
            throw err.response?.data?.message || "Failed to mark notification as clicked.";
        }
    },

};


export default notifServices;
