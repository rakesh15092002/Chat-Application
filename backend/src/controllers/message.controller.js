// controllers/message.controller.js
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from '../lib/socket.js';

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const selectedUserId = req.params.id;

    const conversation = await Message.findOne({
      $or: [
        { "messages.senderId": currentUserId, "messages.receiverId": selectedUserId },
        { "messages.senderId": selectedUserId, "messages.receiverId": currentUserId },
      ],
    });

    if (!conversation) return res.status(200).json([]);
    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    let { text, messageType } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;
    let files = req.cloudinaryFiles || [];

    if (files.length > 0) text = "";

    const newChat = {
      senderId,
      receiverId,
      text,
      messageType,
      files,
      timeStamp: new Date(),
    };

    // 🔥 Real-time message send via socket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newChat);
    }

    // Save to DB
    let existingConversation = await Message.findOne({
      $or: [
        { "messages.senderId": senderId, "messages.receiverId": receiverId },
        { "messages.senderId": receiverId, "messages.receiverId": senderId },
      ],
    });

    if (existingConversation) {
      existingConversation.messages.push(newChat);
      await existingConversation.save();
      res.status(200).json(newChat);
    } else {
      const newMessageDoc = new Message({ messages: [newChat] });
      await newMessageDoc.save();
      res.status(200).json(newChat);
    }
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
