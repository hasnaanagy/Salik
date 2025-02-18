import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const fetchRideData = createAsyncThunk(
  "ride/fetchRideData",
  async ({ fromLocation, toLocation, date, time }, { rejectWithValue }) => {
    console.log("Fetching ride data for:", {
      fromLocation,
      toLocation,
      date,
      time,
    });

    try {
      const response = await axios.get(`${BASE_URL}/rides/search`, {
        params: { fromLocation, toLocation, date, time },
      });

      console.log("Ride data received:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching ride data:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ride data"
      );
    }
  }
);

const rideSlice = createSlice({
  name: "ride",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearRideData: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRideData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRideData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRideData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRideData } = rideSlice.actions;
export default rideSlice.reducer;
