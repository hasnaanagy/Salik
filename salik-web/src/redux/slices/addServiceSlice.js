import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/postService";

// Async action to post ride data
export const postRideData = createAsyncThunk("ride/postRideData", async (rideData, { rejectWithValue }) => {
    try {
        const response = await api.post("/rides", rideData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "An error occurred.");
    }
});

const addServiceSlice = createSlice({
    name: "ride",
    initialState: {
        rideInfo: {},
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(postRideData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postRideData.fulfilled, (state, action) => {
                state.loading = false;
                state.rideInfo = action.payload;
            })
            .addCase(postRideData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = addServiceSlice.actions;
export default addServiceSlice.reducer;
