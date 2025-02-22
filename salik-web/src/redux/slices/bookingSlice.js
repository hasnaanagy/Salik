import apiService from "../../api/apiService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk to book a ride
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

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    rides: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookRide.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(bookRide.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = "Trip booked successfully!";
      })
      .addCase(bookRide.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const bookingReducer = bookingSlice.reducer;
