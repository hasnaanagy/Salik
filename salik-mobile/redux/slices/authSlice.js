import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiService from "../../api/api_service";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await apiService.create("auth/login", userData);
      await AsyncStorage.setItem("token", data.token);

      console.log("Login Response:", data);
      return data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      console.error("Full error object:", error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { confirmPassword, ...filteredData } = userData;
      console.log("Sending data to API:", filteredData); // Debugging log
      const data = await apiService.create("auth/signup", filteredData);
      console.log("API Response:", data); // Debugging log
      return data;
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      console.error("Full error response:", error);
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.getAll("auth");
      if (!data) throw new Error("User data not found");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("userType", JSON.stringify(data.user.type)); // Store user data

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiService.patch("auth/", formData);
      return response.updatedUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

export const switchRole = createAsyncThunk(
  "auth/switchRole",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 Sending request to switch role...");
      const response = await apiService.update("auth/switch-role", {}); // Ensure this endpoint is correct

      console.log("✅ Switch Role Response:", response);

      await AsyncStorage.setItem("userType", JSON.stringify(response.newRole));
      return response;
    } catch (error) {
      console.error(
        "❌ Error switching role:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to switch role"
      );
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("userType");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(switchRole.fulfilled, (state, action) => {
        console.log("🟢 Role switched successfully:", action.payload);
        if (action.payload?.newRole) {
          console.log("🔄 Updating Type in Redux:", action.payload.newRole);
          state.user = { ...state.user, type: action.payload.newRole };
        }
      });
  },
});

export const authReducer = authSlice.reducer;
