import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/postService"; // Import the api instance

// Async action to post fuel data
export const postFuelData = createAsyncThunk(
    "fuelService/postFuelData",
    async (fuelData, { rejectWithValue }) => {
        try {
            const response = await api.post("/fuel", fuelData); // Call the postFuelData API endpoint
            return response.data;
        } catch (error) {
            return rejectWithValue(error || "Failed to add fuel service");
        }
    }
);

const addFuelSlice = createSlice({
    name: "fuelService",
    initialState: {
        fuelInfo: {},  //store the data after a successful submission
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
            .addCase(postFuelData.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(postFuelData.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.fuelInfo = action.payload;
            })
            .addCase(postFuelData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, resetSuccess } = addFuelSlice.actions;
export default addFuelSlice.reducer;