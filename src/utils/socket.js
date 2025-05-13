// src/socket.js
// import { io } from "socket.io-client";
// export const socket = io("http://localhost:3000"); // ou URL de ton backend
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    transports: ["websocket"],
});

export default socket;
