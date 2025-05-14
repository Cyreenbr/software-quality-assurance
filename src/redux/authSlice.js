import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosAPI from "../services/axiosAPI/axiosInstance";
import socket from "../utils/socket";
import { SocketNames } from "../utils/socketNames";

// Async action for login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axiosAPI.post("/users/login", { email, password });

            if (response.status === 201) {
                const { user } = response.data;

                socket.emit(SocketNames.registerSocketUser, {
                    userId: user.id,
                    role: user.role,
                });
                console.log("User info Sent for Socket");

                // Store token and user in localStorage
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user with role

                // Return token, role, and user from the response
                return {
                    token: response.data.token,
                    role: response.data.user.role,
                    user: response.data.user,
                    level: response.data.level,
                };
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || "Login failed");
        }
    }
);

// Logout action
export const logoutUser = () => (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(authSlice.actions.logout());
};

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || null,
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
        level: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).level : null,
        role: localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user")).role
            : null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            state.role = null;
            state.user = null;
            state.level = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.role = action.payload.role;
                state.user = action.payload.user;
                state.level = action.payload.level;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;