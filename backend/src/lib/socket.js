// lib/socket.js
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

// In-memory store for online users
let onlineUsers = new Map();

export function getReceiverSocketId(userId) {
  return onlineUsers.get(userId);
}

io.on("connection", (socket) => {
  console.log("A user is connected", socket.id);

  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`${userId} is now online`);
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on('send_message', (data) => {
    const receiverSocketId = onlineUsers.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', data);
    }
  });

  socket.on('delete_message', (data) => {
    const receiverSocketId = onlineUsers.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('message_deleted', { messageId: data.messageId });
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected user", socket.id);
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

export { io, server, app };
