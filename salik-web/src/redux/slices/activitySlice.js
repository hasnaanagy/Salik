import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRides } from "../../api/activity"; // Import the API function

export const fetchRides = createAsyncThunk("rides/myrides", async (_, { rejectWithValue }) => {
    try {
        const data = await getRides(); // Get upcoming and completed rides
        return {
            upcoming: data.upcoming || [],
            completed: data.completed || [],
        };
    } catch (error) {
        return rejectWithValue(error.message || "Failed to fetch rides");
    }
});

const rideActivitySlice = createSlice({
    name: "rides",
    initialState: {
        upcoming: [],
        completed: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRides.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRides.fulfilled, (state, action) => {
                state.loading = false;
                state.upcoming = action.payload.upcoming;
                state.completed = action.payload.completed;
            })
            .addCase(fetchRides.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch rides";
            });
    },
});

export default rideActivitySlice.reducer;