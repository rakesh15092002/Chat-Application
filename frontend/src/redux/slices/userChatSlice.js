import { createSlice } from "@reduxjs/toolkit";
import { getMessages, getUsers, sendMessages } from "../thunks/userChatThunks";

const initialState = {
  users: [],
  messages: [],
  selectedUserId: null,
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isSendingMessage: false,  // added for send message loading state
  error: null,
};

const userChatSlice = createSlice({
  name: "userChat",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      if (action.payload === null) {
        state.selectedUserId = null;
        state.selectedUser = null;
      } else if (action.payload && action.payload._id) {
        state.selectedUserId = action.payload._id;
        state.selectedUser = action.payload;
      } else {
        console.error("Invalid payload in setSelectedUser:", action.payload);
      }
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isUserLoading = false;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(getMessages.pending, (state) => {
        state.isMessageLoading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        // console.log("Fetched messages:", action.payload); // debug line
        state.messages = action.payload;
        state.isMessageLoading = false;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isMessageLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(sendMessages.pending, (state) => {
        state.isSendingMessage = true; // set sending message state to true
      })
      .addCase(sendMessages.fulfilled, (state, action) => {
        if (action.payload) {
          state.messages.push(action.payload); // append new message
        }
        state.isSendingMessage = false;
      })
      .addCase(sendMessages.rejected, (state, action) => {
        state.isSendingMessage = false; // reset sending message state
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setSelectedUser } = userChatSlice.actions;
export default userChatSlice.reducer;
