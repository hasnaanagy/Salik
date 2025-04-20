import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api_service";

export const postServiceData = createAsyncThunk(
  "services/postServiceData",
  async (
    { serviceType, location, addressOnly, workingDays, workingHours },
    { rejectWithValue }
  ) => {

    try {
      const response = await api.create("service", {
        serviceType,
        location,
        addressOnly,
        workingDays,
        workingHours,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add service"
      );
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
    
      return response.data;
    } catch (error) {
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
      
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete service";
      return rejectWithValue(errorMessage);
    }
  }
);

const ServiceSlice = createSlice({
  name: "service",
  initialState: {
    serviceInfo: {}, // For single service
    service: null, // For list of services
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      console.log("Resetting success state");
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
      })
      .addCase(getProviderServices.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getProviderServices.fulfilled, (state, action) => {
        state.loading = false;
        state.service = action.payload;
        state.error = null;
      })
      .addCase(getProviderServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.serviceInfo = action.payload;
        state.error = null;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.serviceInfo = action.payload;
        state.error = null;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearError, resetSuccess } = ServiceSlice.actions;
export const ServiceReducer = ServiceSlice.reducer;
