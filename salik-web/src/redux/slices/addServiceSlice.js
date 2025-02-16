import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/postService"; // Import the api instance

export const postRideData = createAsyncThunk(
    "rideService/postRideData",
    async (rideData, { rejectWithValue }) => {
        try {
            const response = await api.post("/rides", rideData); // Call the postRideData API endpoint
            return response.data;
        } catch (error) {
            return rejectWithValue(error || "Failed to add ride service");
        }
    }
);

const addRideSlice = createSlice({
    name: "rideService",
    initialState: {
        rideInfo: {},  //store the data after a successful submission
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(postRideData.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(postRideData.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.rideInfo = action.payload;
            })
            .addCase(postRideData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, resetSuccess } = addRideSlice.actions;
export default addRideSlice.reducer;
