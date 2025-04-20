import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiService"; // Importing the axios instance

// Async action to post mechanic data
export const createService = createAsyncThunk(
  "Service/createServiceData",
  async (
    { serviceType, location, addressOnly, workingDays, workingHours },
    { rejectWithValue }
  ) => {
    try {
      console.log("API Call:", {
        serviceType,
        location,
        addressOnly,
        workingDays,
        workingHours,
      });
      const response = await api.create("service", {
        serviceType,
        location,
        addressOnly,
        workingDays,
        workingHours,
      });
      console.log("Response data:", response);
      return response.data;
    } catch (error) {
      console.error("Error response:", error.response); // Debugging
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add mechanic service";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getProviderServices = createAsyncThunk(
  "Service/getProviderServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAll("service");
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to get services";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateService = createAsyncThunk(
  "Service/updateService",
  async (
    {
      serviceId,
      serviceType,
      location,
      addressOnly,
      workingDays,
      workingHours,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.update(`service/${serviceId}`, {
        serviceType,
        location,
        addressOnly,
        workingDays,
        workingHours,
      });
      console.log("API Call:", {
        serviceId,
        serviceType,
        location,
        addressOnly,
        workingDays,
        workingHours,
      });
      console.log("Response data:", response);
      return response.data;
    } catch (error) {
      console.error("Error response:", error.response); // Debugging
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update service";
      return rejectWithValue(errorMessage);
    }
  }
);
export const deleteService = createAsyncThunk(
  "Service/deleteService",
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`service/`, `${serviceId}`);
      console.log("API Call:", serviceId);
      console.log("Response data:", response);
      return response.data;
    } catch (error) {
      console.error("Error response:", error.response); // Debugging
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete service";
      return rejectWithValue(errorMessage);
    }
  }
);
const serviceSlice = createSlice({
  name: "Service",
  initialState: {
    service: {},
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
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.service = action.payload;
        state.error = null; // Clear error on success
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Use payload from rejectWithValue
        state.success = false;
      })
      // Get provider services
      .addCase(getProviderServices.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getProviderServices.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.service = action.payload;
        state.error = null; // Clear error on success
      })
      .addCase(getProviderServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Use payload from rejectWithValue
        state.success = false;
      })
      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.service = action.payload;
        state.error = null; // Clear error on success
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Use payload from rejectWithValue
        state.success = false;
      })
      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.service = action.payload;
        state.error = null; // Clear error on success
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Use payload from rejectWithValue
        state.success = false;
      });
  },
});

export const { clearError, resetSuccess } = serviceSlice.actions;
export const ServiceReducer = serviceSlice.reducer;
