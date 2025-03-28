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
export const fetchProviderRides = createAsyncThunk(
  "rides/fetchProviderRides",
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
export const cancelBooking = createAsyncThunk(
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
//post booking
export const bookRide = createAsyncThunk(
  "bookRide",
  async ({ rideId, counterSeats }, { rejectWithValue }) => {
    console.log(rideId, counterSeats);
    try {
      const response = await apiService.create(`rideBooking`, {
        rideId,
        bookedSeats: counterSeats,
      });
      return response; // Return the API response
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response?.data?.message || "Booking failed");
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
      .addCase(fetchProviderRides.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProviderRides.fulfilled, (state, action) => {
        state.loading = false;
        const { upcoming, completed, canceled } = action.payload || {};
        state.upcoming = upcoming || [];
        state.completed = completed || [];
        state.canceled = canceled || [];
      })
      .addCase(fetchProviderRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Booking a ride
      .addCase(bookRide.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(bookRide.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Trip booked successfully!";
      })
      .addCase(bookRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Canceling a ride
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.upcoming = state.upcoming.filter(
          (ride) => ride.id !== action.meta.arg
        );
        state.canceled.push(action.meta.arg);
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const activityReducer = activitySlice.reducer;
