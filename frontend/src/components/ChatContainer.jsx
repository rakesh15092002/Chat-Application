import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../redux/thunks/userChatThunks";
import { addReceivedMessage } from "../redux/slices/userChatSlice";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { getSocket } from "../socket/socket";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);

  const { authenticatedData: authUser } = useSelector((state) => state.user);
  const { isMessageLoading, selectedUser, messages } = useSelector((state) => state.userChat);

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessages(selectedUser._id));
    }
  }, [selectedUser, dispatch]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    const handleMessage = (message) => {
      if (
        message.senderId === selectedUser?._id ||
        message.receiverId === selectedUser?._id
      ) {
        dispatch(addReceivedMessage(message));
      }
    };

    socket?.on("receive_message", handleMessage);
    return () => socket?.off("receive_message", handleMessage);
  }, [selectedUser, dispatch]);

  if (!selectedUser?._id) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Please select a user to start chatting.
      </div>
    );
  }

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
        {messages.length === 0 && (
          <div className="text-center text-gray-500">No messages yet.</div>
        )}
        {messages.map((msg) => {
          const isOwn = msg.senderId === authUser._id;
          return (
            <div key={msg._id} className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isOwn
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(msg.timeStamp)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {msg.messageType === "file" &&
                  msg.files?.map((file, index) => (
                    <div key={index}>
                      {file.type?.startsWith("image/") ? (
                        <img src={file.url} alt={file.name} className="sm:max-w-[200px]" />
                      ) : (
                        <a href={file.url} target="_blank" className="underline text-blue-600">
                          {file.name}
                        </a>
                      )}
                      {file.caption && <p className="text-xs mt-1">{file.caption}</p>}
                    </div>
                  ))}
                {msg.text && <p>{msg.text}</p>}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
