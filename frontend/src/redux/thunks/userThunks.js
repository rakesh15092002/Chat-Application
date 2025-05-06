import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const register = createAsyncThunk(
  'user/register',
  async (userData, thunkAPI) => {
    console.log(userData)
    try {

      const response = await axios.post(
        'http://localhost:5002/api/auth/signup', // ✅ no space
        userData.formData
      );

      console.log("hii")
      console.log(userData.formData)
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
      console.log("heello");
      const response = await axios.post(
        'http://localhost:5002/api/auth/login',
        userData, // ✅ not userData.formData
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      console.log("check login");
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
      console.log("pahle")
      const response = await axios.get(
        'http://localhost:5002/api/auth/check-auth',
        {
          withCredentials: true, // Important: sends cookies for session/JWT
        }
      );
      
      return response.data; // should be the user object from req.user
    } catch (error) {
      console.log("bad me cahtch")
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
        { withCredentials: true } // include cookies for logout
      );

      return true; // return something to let extraReducer know it's done
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
