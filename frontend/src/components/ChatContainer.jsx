import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../redux/thunks/userChatThunks"; // Assuming this gets messages
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { setSelectedUser } from "../redux/slices/userChatSlice";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);

  // Access authUser from Redux state
  const { authenticatedData: authUser, isAuthenticated } = useSelector((state) => state.user);

  // Access selected user and messages from Redux state
  const { isMessageLoading, selectedUser, messages } = useSelector((state) => state.userChat);

  // Get messages when selectedUser changes
  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      dispatch(getMessages(selectedUser._id));
    } else {
      console.error("Selected user is invalid:", selectedUser);
    }
  }, [dispatch, selectedUser]);

  // Scroll to the newest message when messages change
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages && messages.length === 0 && (
          <div className="text-center text-gray-500">No messages yet.</div>
        )}
        {messages?.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <div ref={messageEndRef} /> {/* This is the end for scrolling */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
