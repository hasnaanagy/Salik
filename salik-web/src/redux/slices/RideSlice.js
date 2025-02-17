import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRideData = createAsyncThunk(
  "ride/fetchRideData",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.get("", {
        params: formData,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch ride data");
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
