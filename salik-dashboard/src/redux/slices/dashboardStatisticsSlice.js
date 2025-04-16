import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../api/apiService";

export const getDashboardStatisticsAction = createAsyncThunk(
  "dashboardStatistics/getDashboardStatisticsAction",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.getAll(`admin/dashboard-stats`)
      console.log(data)
      return data.stats; 
    } catch (error) {
        console.log(error.response?.data?.message)
      return rejectWithValue(error.response?.data?.message || "Filtering users failed");
    }
  }
);




const dashboardStatisticsSlice = createSlice({
  name: "dashboardStatistics",
  initialState: {
    stats:{},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStatisticsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStatisticsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.stats=action.payload
      })
      .addCase(getDashboardStatisticsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
   

  },
});

export const dashboardStatisticsReducer = dashboardStatisticsSlice.reducer;