import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: String,
    name: String,
    type: String,
    size: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }, { _id: false })

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageType: {
      type: String
    },
    text: {
      type: String
    },
    files: [fileSchema],
    timeStamp: {
      type: Date,
      default: Date.now,
    }
  }, { _id: false })

const messageSchema = new mongoose.Schema(
  {
    messages: [chatSchema],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;