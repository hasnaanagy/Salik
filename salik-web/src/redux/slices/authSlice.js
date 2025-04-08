import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../api/apiService";

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await apiService.create("auth/login", userData);
      localStorage.setItem("token", data.token);
      return data; // { status, message, token, userType }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Signup User
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await apiService.create("auth/signup", userData);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// Get User Data
export const getUser = createAsyncThunk(
  "auth/getuser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.getAll("auth");
      if (!data) throw new Error("User data not found");
      return data; // Expect { user: { fullName, phone, nationalIdImage, licenseImage, ... } }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);

// Update User (includes image uploads)
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiService.patch("auth/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("🔄 API Response:", response);
      if (!response.updatedUser) {
        throw new Error("Invalid server response: Missing updatedUser.");
      }
      return response.updatedUser; // Full user object with updated fields
    } catch (error) {
      console.error("❌ Update failed:", error);
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

// Switch Role
export const switchRole = createAsyncThunk(
  "auth/switchRole",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.update("auth/switch-role", {});
      console.log("🔄 Full API Response:", response);
      if (!response || !response.newRole) {
        throw new Error("Invalid API response format");
      }
      localStorage.setItem("userRole", response.newRole);
      return response;
    } catch (error) {
      console.error("❌ Error switching role:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to switch role");
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  return null;
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          userId: action.payload.userId,
          type: action.payload.userType,
        };
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Full user object
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update with full user object
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(switchRole.fulfilled, (state, action) => {
        console.log("🎭 Switched Role Data:", action.payload);
        if (action.payload?.newRole) {
          state.user = { ...state.user, role: action.payload.newRole };
        }
      })
      .addCase(switchRole.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const authReducer = authSlice.reducer;