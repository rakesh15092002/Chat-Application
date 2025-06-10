import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUsers = createAsyncThunk("userChat/getUsers", async (_, thunkAPI) => {
  try {
    const res = await axios.get("http://localhost:5002/api/message/users", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "get users failed");
  }
});

export const getMessages = createAsyncThunk("userChat/getMessages", async (userId, thunkAPI) => {
  try {
    const res = await axios.get(`http://localhost:5002/api/message/${userId}`, {
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
        `http://localhost:5002/api/message/send/${receiverId}`,
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
