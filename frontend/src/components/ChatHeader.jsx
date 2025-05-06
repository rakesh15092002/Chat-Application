import { X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from "../redux/slices/userChatSlice";

const ChatHeader = () => {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.userChat);
  const { onlineUsers } = useSelector((state) => state.user);

  // Close the current chat by setting selectedUser to null
  const handleClick = () => {
    dispatch(setSelectedUser(null)); // Pass null instead of false
  };

  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={handleClick} className="p-1 rounded hover:bg-base-200">
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
