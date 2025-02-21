import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../api/apiService";

export const fetchBooking = createAsyncThunk("rides/fetchBooking", async () => {
  try {
    const response = await apiService.getAll("rideBooking");
    console.log(response);
    return response;
  } catch (error) {
    throw new Error(error.message || "An error occurred while fetching rides.");
  }
});
//=========================================================
export const fetchProvidedRides = createAsyncThunk(
  "rides/fetchProvidedRides",
  async () => {
    try {
      const response = await apiService.getAll("rides/myrides");
      return response;
    } catch (error) {
      throw new Error(
        error.message || "An error occurred while fetching rides."
      );
    }
  }
);
//=========================================================
export const cancelRideAction = createAsyncThunk(
  "rides/cancelRide",
  async (rideId, { rejectWithValue }) => {
    try {
      const response = await apiService.patch(`rideBooking/${rideId}`);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error canceling ride."
      );
    }
  }
);

const activitySlice = createSlice({
  name: "myrides",
  initialState: {
    upcoming: [],
    completed: [],
    canceled: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.loading = false;
        const { upcomingRides, completedRides, cancelledRides } =
          action.payload || {};
        state.upcoming = upcomingRides || [];
        state.completed = completedRides || [];
        state.canceled = cancelledRides || [];
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProvidedRides.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProvidedRides.fulfilled, (state, action) => {
        state.loading = false;
        const { upcoming, completed, canceled } = action.payload || {};
        state.upcoming = upcoming || [];
        state.completed = completed || [];
        state.canceled = canceled || [];
      })
      .addCase(fetchProvidedRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const activityReducer = activitySlice.reducer;
