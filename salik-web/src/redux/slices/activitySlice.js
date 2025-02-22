import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../api/apiService";

// Fetch booked rides
export const fetchBooking = createAsyncThunk("rides/fetchBooking", async () => {
  try {
    const response = await apiService.getAll("rideBooking");
    return response;
  } catch (error) {
    throw new Error(error.message || "An error occurred while fetching rides.");
  }
});

// Fetch provided rides
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

// Cancel a ride
export const cancelRideAction = createAsyncThunk(
  "rides/cancelRide",
  async (rideId, { rejectWithValue }) => {
    try {
      const response = await apiService.patch(`rideBooking/${rideId}`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error canceling ride."
      );
    }
  }
);

// Delete a ride
export const deleteRideAction = createAsyncThunk(
  "rides/deleteRide",
  async (rideId, { rejectWithValue }) => {
    try {
      const response = await apiService.delete(`rides/${rideId}`); // Changed to DELETE request
      return { rideId }; // Returning only the ID for removal from the state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting ride."
      );
    }
  }
);

// Update a ride
export const editRideAction = createAsyncThunk(
  "rides/editRide",
  async ({ rideId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await apiService.patch(`rides/${rideId}`, updatedData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error editing ride."
      );
    }
  }
);


// Create slice
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
      // Fetching bookings
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

      // Fetching provided rides
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
      })

      // Canceling a ride
      .addCase(cancelRideAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelRideAction.fulfilled, (state, action) => {
        state.loading = false;
        state.upcoming = state.upcoming.filter(
          (ride) => ride.id !== action.meta.arg
        );
        state.canceled.push(action.meta.arg);
      })
      .addCase(cancelRideAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Deleting a ride
      .addCase(deleteRideAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRideAction.fulfilled, (state, action) => {
        state.loading = false;
        state.upcoming = state.upcoming.filter(
          (ride) => ride.id !== action.payload.rideId
        );
        state.completed = state.completed.filter(
          (ride) => ride.id !== action.payload.rideId
        );
        state.canceled = state.canceled.filter(
          (ride) => ride.id !== action.payload.rideId
        );
      })
      .addCase(deleteRideAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Editing a ride
      .addCase(editRideAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(editRideAction.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRide = action.payload;
        state.upcoming = state.upcoming.map((ride) =>
          ride._id === updatedRide._id ? updatedRide : ride
        );
      })
      .addCase(editRideAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const activityReducer = activitySlice.reducer;
