import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiService from "../../api/apiService";

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

export const getRideById = createAsyncThunk(
  "ride/getRideById",
  async (rideId , { rejectWithValue }) => {
    try {
      const response = await apiService.getById("rides",rideId);
      console.log("Ride data received:", response);
      return response;
    } catch (error) {
      console.error("Error fetching ride data:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ride data"
      );
    }
  }
);

export const updateRideAction = createAsyncThunk(
  "ride/updateRideAction",
  async (rideId,newRide , { rejectWithValue }) => {
    try {
      console.log("Ride data received:", newRide);
      console.log("rideId",rideId)
      const response = await apiService.update(`rides/${rideId}`,newRide);
      console.log("updated data received:", response);
      return response;
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
    ride: null,
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
      })
      .addCase(getRideById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRideById.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = action.payload.ride;
      })
      .addCase(getRideById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRideAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRideAction.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = action.payload.ride;
      })
      .addCase(updateRideAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRideData } = rideSlice.actions;
export const rideReducer = rideSlice.reducer;
