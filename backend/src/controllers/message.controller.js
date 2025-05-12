import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
  
  try {
    const loggedInUserId = req.user._id;
    // console.log(`Fetching users for sidebar, excluding logged in user: ${loggedInUserId}`);
    
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    // console.log(`Fetched ${filteredUsers.length} users`);
    
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

    // console.log(`Fetching messages for conversation between user ${currentUserId} and ${selectedUserId}`);
    
    const conversation = await Message.findOne({
      $or: [
        { "messages.senderId": currentUserId, "messages.receiverId": selectedUserId },
        { "messages.senderId": selectedUserId, "messages.receiverId": currentUserId },
      ],
    });

    if (!conversation) {
      console.log("No conversation found, returning empty array.");
      return res.status(200).json([]); // No messages yet
    }


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

    // console.log(`Sending message from ${senderId} to ${receiverId}`);

    if (files.length > 0) {
      text = ""; // If there are files, no text is sent
    }

    const newChat = {
      senderId,
      receiverId,
      text,
      messageType,
      files,
      timeStamp: new Date(),
    };

    // Find existing message doc between users (order doesn't matter)
    let existingConversation = await Message.findOne({
      $or: [
        { "messages.senderId": senderId, "messages.receiverId": receiverId },
        { "messages.senderId": receiverId, "messages.receiverId": senderId },
      ],
    });

    if (existingConversation) {
      // console.log("Found existing conversation, pushing new message");
      // Push to existing conversation
      existingConversation.messages.push(newChat);
      await existingConversation.save();
      res.status(200).json(newChat);
    } else {
      // console.log("No existing conversation found, creating new conversation");
      // Create new conversation
      const newMessageDoc = new Message({ messages: [newChat] });
      await newMessageDoc.save();
      res.status(200).json(newChat);
    }
    
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
