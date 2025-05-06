import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUsers = createAsyncThunk(
  'userChat/getUsers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:5002/api/message/users", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'get users failed'
      );
    }
  }
);

export const getMessages = createAsyncThunk(
  'userChat/getMessages',
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5002/api/message/${userId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "get message failed"
      );
    }
  }
);

// Rename this to match the import
export const sendMessages = createAsyncThunk(
  'userChat/sendMessage',
  async ({ text, image }, thunkAPI) => {
    try {
      const response = await axios.post(
        `http://localhost:5002/api/message/send`,
        { text, image },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Send message failed"
      );
    }
  }
);
