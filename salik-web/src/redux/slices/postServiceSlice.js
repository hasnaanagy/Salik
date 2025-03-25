import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/postService"; // Importing the axios instance

// Async action to post service data
export const postServiceData = createAsyncThunk(
  "Service/postServiceData",
  async (
    { serviceType, location, addressOnly, workingDays, workingHours },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/service",
        {
          serviceType,
          location,
          addressOnly,
          workingDays,
          workingHours,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error response:", error.message); // Debugging
      return rejectWithValue(
        error.response?.data?.message || "Failed to add service"
      );
    }
  }
);

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    serviceInfo: {},
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postServiceData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(postServiceData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.serviceInfo = action.payload;
      })
      .addCase(postServiceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetSuccess } = serviceSlice.actions;
export default serviceSlice.reducer;
