import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../api/apiService";

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await apiService.create("auth/login", userData);
      localStorage.setItem("token", data.token);
      return data;
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
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);

export const updateUser = createAsyncThunk("auth/updateUser", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.put("/user/update", formData); // Adjust API call if needed
    return response.data.updatedUser; // ✅ Ensure correct data is returned
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Update failed");
  }
});


export const switchRole = createAsyncThunk(
  "auth/switchRole",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.update("auth/switch-role", {}); 
      
      console.log("🔄 Full API Response:", response); // Debugging Log

      if (!response || !response.newRole) {
        throw new Error("Invalid API response format");
      }

      return response; // ✅ Ensure the response is returned properly
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
        state.user = action.payload.user;
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
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(switchRole.fulfilled, (state, action) => {
        console.log("🎭 Switched Role Data:", action.payload); // Debugging Log
      
        if (action.payload?.newRole) {
          state.user = { ...state.user, role: action.payload.newRole }; // ✅ Ensure user role updates
        }
      })
  
    .addCase(switchRole.rejected, (state, action) => {
        state.error = action.payload;
    })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload; // ✅ Update Redux state with new user data
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })
  
  
    
      
      
      
  },
});

export const  authReducer = authSlice.reducer;

