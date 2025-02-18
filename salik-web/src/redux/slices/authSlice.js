// redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../api/apiService";

// Signup action (same as you already have)
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.create("auth/signup", userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Login action
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await apiService.create("auth/login", loginData);
      console.log("Login response:", response);
      return response; // User data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    token: localStorage.getItem("token") || null, // Load token from localStorage
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      // Clear token on logout
      localStorage.removeItem("authToken");
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Signup reducers (existing)
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login reducers
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("token", action.payload.token); // Save token to localStorage
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
