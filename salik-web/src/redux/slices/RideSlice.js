import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../api/apiService";

export const createRide = createAsyncThunk(
  "rideService/createRide",
  async (
    { carType, fromLocation, toLocation, totalSeats, price, date, time },
    { rejectWithValue }
  ) => {
    console.log("API Call:", {
      carType,
      fromLocation,
      toLocation,
      totalSeats,
      price,
      date,
      time,
    }); // Debugging
    try {
      const response = await apiService.create("rides", {
        carType,
        fromLocation,
        toLocation,
        totalSeats,
        price,
        date,
        time,
      });
      console.log("Response:", response); // Debugging
      return response.data;
    } catch (error) {
      console.error("Error response:", error); // Debugging
      return rejectWithValue(
        error.response?.data || "Failed to add ride service"
      );
    }
  }
);
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
      const response = await apiService.getAll(
        `rides/search?fromLocation=${fromLocation}&toLocation=${toLocation}&date=${date}&time=${time}`
      );

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

export const getRideById = createAsyncThunk(
  "ride/getRideById",
  async (rideId, { rejectWithValue }) => {
    try {
      const response = await apiService.getById("rides", rideId);
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

  async ({ rideId, formattedData }, { rejectWithValue }) => {
    try {
      const response = await apiService.update(
        `rides/${rideId}`,
        formattedData
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating ride."
      );
    }
  }
);

// Delete a ride
export const deleteRideAction = createAsyncThunk(
  "rides/deleteRide",
  async (rideId, { rejectWithValue }) => {
    try {
      const response = await apiService.delete(`rides`, rideId);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting ride."
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
      .addCase(createRide.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createRide.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.ride = action.payload;
      })
      .addCase(createRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      })

      // Deleting a ride
      .addCase(deleteRideAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRideAction.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteRideAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRideData } = rideSlice.actions;
export const rideReducer = rideSlice.reducer;
