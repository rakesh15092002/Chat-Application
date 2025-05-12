import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessages } from "../redux/thunks/userChatThunks";
import { Image, Send, X } from "lucide-react";

const MessageInput = () => {
  const { selectedUser } = useSelector((state) => state.userChat);
  const [text, setText] = useState("");
  const [filePreviews, setFilePreviews] = useState([]);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setFilePreviews((prev) => [...prev, ...previews]);
  };

  const removeFile = (indexToRemove) => {
    setFilePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
    if (fileInputRef.current && filePreviews.length === 1) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && filePreviews.length === 0) return;

    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());

    formData.append("messageType", filePreviews.length > 0 ? "file" : "text");

    filePreviews.forEach(({ file }) => {
      formData.append("files", file);
    });

    try {
      await dispatch(sendMessages({ receiverId: selectedUser._id, formData }));
      setText("");
      setFilePreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Send message failed:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {filePreviews.length > 0 && (
        <div className="mb-3 flex gap-2 flex-wrap">
          {filePreviews.map((preview, idx) => (
            <div key={idx} className="relative">
              <img
                src={preview.url}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={() => removeFile(idx)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                type="button"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${filePreviews.length ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && filePreviews.length === 0}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
