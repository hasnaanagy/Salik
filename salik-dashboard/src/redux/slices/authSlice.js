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


export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await apiService.delete(`auth/users`, userId);
      console.log( data);
      return data; 
    } catch (error) {
      console.log(error.response?.data?.message)
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);

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
          type: action.payload.userType,
        };
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
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
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const authReducer = authSlice.reducer;