import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { connectSocket ,disconnectSocket} from "../../socket/socket";
import { setOnlineUsers } from "../slices/userSlice";


export const register = createAsyncThunk(
  'user/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:5002/api/auth/signup',
        userData.formData,
        { withCredentials: true }
      );

      // ✅ connect to socket
      const socket = connectSocket(response.data._id);

      // ✅ listen for online users
      socket?.on('getOnlineUsers', (userIds) => {
        thunkAPI.dispatch(setOnlineUsers(userIds));
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Register failed'
      );
    }
  }
);


export const login = createAsyncThunk(
  'user/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:5002/api/auth/login',
        userData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const socket = connectSocket(response.data._id);

      socket?.on('getOnlineUsers', (userIds) => {
        thunkAPI.dispatch(setOnlineUsers(userIds));
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'login failed'
      );
    }
  }
);



export const authUser = createAsyncThunk(
  'user/authUser',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        'http://localhost:5002/api/auth/check-auth',
        { withCredentials: true }
      );

      const socket = connectSocket(response.data._id);

      socket?.on('getOnlineUsers', (userIds) => {
        thunkAPI.dispatch(setOnlineUsers(userIds));
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Authentication failed'
      );
    }
  }
);


export const logout = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      await axios.post(
        'http://localhost:5002/api/auth/logout',
        {},
        { withCredentials: true }
      );

      disconnectSocket();

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);


export const updateProfile = createAsyncThunk(
  'user/profile',
  async (profilePic, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:5002/api/auth/update-profile',
        profilePic,
        {
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
          withCredentials: true, // 👈 This sends the cookie (including JWT)
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
