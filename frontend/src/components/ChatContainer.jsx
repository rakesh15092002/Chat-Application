import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../redux/thunks/userChatThunks";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);
  

  const { authenticatedData: authUser, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const { isMessageLoading, selectedUser, messages } = useSelector(
    (state) => state.userChat
  );

  console.log("hello");
  
  // Always call hooks first!
  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      dispatch(getMessages(selectedUser._id));
    }
  }, [dispatch, selectedUser]);
  

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);



  if (!selectedUser || !selectedUser._id) {
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
        {messages && messages.length === 0 && (
          <div className="text-center text-gray-500">No messages yet.</div>
        )}
        {[...messages].map((message) => {
          if (message.messageType === "text") {
            return (
              <div
                key={message._id}
                className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"
                  }`}
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
                    {formatMessageTime(message.timeStamp)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            );
          } else if (message.messageType === "file") {
            return (
              <div
                key={message._id}
                className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"
                  }`}
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
                    {formatMessageTime(message.timeStamp)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.files?.length > 0 && (
                    <div className="flex flex-col gap-2 mb-2">
                      {message.files.map((file, index) => (
                        <div key={index}>
                          {/* Show preview for images only */}
                          {file.type.startsWith("image/") ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="sm:max-w-[200px] rounded-md"
                            />
                          ) : (
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-blue-600"
                            >
                              {file.name}
                            </a>
                          )}
                          {file.caption && <p className="text-xs mt-1">{file.caption}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            )
          }
          return null;
        })}

      </div>
      <div ref={messageEndRef} />
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
