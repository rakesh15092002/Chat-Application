import { createSlice } from "@reduxjs/toolkit";
import { getMessages, getUsers, sendMessages } from "../thunks/userChatThunks";

const initialState = {
  users: [],
  messages: [],
  selectedUserId: null,
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isSendingMessage: false,
  error: null,
};

const userChatSlice = createSlice({
  name: "userChat",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUserId = action.payload?._id || null;
      state.selectedUser = action.payload || null;
    },
    addReceivedMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isUserLoading = false;
      })
      .addCase(getUsers.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.payload;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isMessageLoading = false;
      })
      .addCase(getMessages.pending, (state) => {
        state.isMessageLoading = true;
        state.error = null;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isMessageLoading = false;
        state.error = action.payload;
      })
      .addCase(sendMessages.pending, (state) => {
        state.isSendingMessage = true;
      })
      .addCase(sendMessages.fulfilled, (state, action) => {
        if (action.payload) {
          state.messages.push(action.payload);
        }
        state.isSendingMessage = false;
      })
      .addCase(sendMessages.rejected, (state, action) => {
        state.isSendingMessage = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedUser, addReceivedMessage } = userChatSlice.actions;
export default userChatSlice.reducer;
