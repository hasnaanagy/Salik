import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api_service"; // Importing the axios instance

// Async action to post mechanic data
export const postServiceData = createAsyncThunk(
  "services/postServiceData",
  async (
    { serviceType, location, addressOnly, workingDays, workingHours },
    { rejectWithValue }
  ) => {
    console.log("API Call:", {
      serviceType,
      location,
      addressOnly,
      workingDays,
      workingHours,
    });
    try {
      const response = await api.create("service", {
        serviceType,
        location,
        addressOnly,
        workingDays,
        workingHours,
      });
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      // console.error("Error response:", error.message); // Debugging
      // console.log("Error details:", error.response?.data); // عرض تفاصيل الخطأ

      return rejectWithValue(
        error.response?.data?.message || "Failed to add  service"
      );
    }
  }
);

const addServiceSlice = createSlice({
  name: "addServices",
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
        state.mechanicInfo = action.payload;
      })
      .addCase(postServiceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetSuccess } = addServiceSlice.actions;
export const addServiceReducer = addServiceSlice.reducer;
