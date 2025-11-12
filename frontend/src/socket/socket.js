import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL; // ✅ Use env variable

let socket = null;

export const connectSocket = (userId) => {
  if (socket || !userId) return;

  socket = io(BASE_URL); // Connects to deployed backend

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    socket.emit("register", userId); // Send userId to server
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
