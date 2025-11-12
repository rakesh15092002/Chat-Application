import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5002';

export const getUsers = createAsyncThunk("userChat/getUsers", async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${apiUrl}/api/message/users`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "get users failed");
  }
});

export const getMessages = createAsyncThunk("userChat/getMessages", async (userId, thunkAPI) => {
  try {
    const res = await axios.get(`${apiUrl}/api/message/${userId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "get messages failed");
  }
});

export const sendMessages = createAsyncThunk(
  "userChat/sendMessage",
  async ({ receiverId, formData }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${apiUrl}/api/message/send/${receiverId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data; // This gets added to messages list by fulfilled reducer
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Send message failed");
    }
  }
);
