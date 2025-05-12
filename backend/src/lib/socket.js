import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
  },
});

// In-memory store for online users (this could also be a database or Redis in a real-world application)
let onlineUsers = new Map(); // Map to track socket IDs by user ID

io.on("connection", (socket) => {
  console.log("A user is connected", socket.id);

  // Add user to online users list
  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`${userId} is now online`);

    // Emit the updated list of online users
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });

  // When a user disconnects, remove them from the online users list
  socket.on("disconnect", () => {
    console.log("Disconnected user", socket.id);

    // Find userId associated with the socket ID and remove them from the list
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    // Emit the updated list of online users after disconnection
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

export { io, server, app };
