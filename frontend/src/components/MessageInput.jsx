import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessages } from "../redux/thunks/userChatThunks";
import { Image, Send, X } from "lucide-react";
import { getSocket } from "../socket/socket";

const MessageInput = () => {
  const { selectedUser, isSendingMessage } = useSelector((state) => state.userChat);
  const [text, setText] = useState("");
  const [filePreviews, setFilePreviews] = useState([]);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && filePreviews.length === 0) return;

    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());
    formData.append("messageType", filePreviews.length ? "file" : "text");

    filePreviews.forEach(({ file }) => {
      formData.append("files", file);
    });

    try {
      const result = await dispatch(
        sendMessages({ receiverId: selectedUser._id, formData })
      );

      const messageData = result.payload;
      const socket = getSocket();
      if (socket && messageData) {
        socket.emit("send_message", {
          ...messageData,
          receiverId: selectedUser._id,
          senderId: messageData.senderId,
        });
      }

      setText("");
      setFilePreviews([]);
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Send message failed:", error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setFilePreviews((prev) => [...prev, ...previews]);
  };

  const removeFile = (index) => {
    const updated = [...filePreviews];
    updated.splice(index, 1);
    setFilePreviews(updated);
  };

  return (
    <div className="p-4 w-full">
      {filePreviews.length > 0 && (
        <div className="mb-3 flex gap-2 flex-wrap">
          {filePreviews.map((preview, idx) => (
            <div key={idx} className="relative">
              <img src={preview.url} className="w-20 h-20 object-cover rounded" />
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute top-0 right-0 p-1 bg-white rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="input input-bordered w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-circle"
        >
          <Image size={20} />
        </button>
        <button
          type="submit"
          className="btn btn-circle"
          disabled={(!text.trim() && filePreviews.length === 0) || isSendingMessage}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
