import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5002";

let socket = null;

export const connectSocket = (userId) => {
  if (socket || !userId) return;

  socket = io(BASE_URL); // No need for query

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    socket.emit("register", userId); // ✅ Send userId to server
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
