import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/postService"; // Importing the axios instance

// Async action to post mechanic data
export const postMechanicData = createAsyncThunk(
    "mechanicService/postMechanicData",
    async (mechanicData, { rejectWithValue }) => {
        try {
            // Making the API request using axios instance from api
            const response = await api.post("/mechanics", mechanicData); // Use your correct API endpoint
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add mechanic service");
        }
    }
);

const mechanicSlice = createSlice({
    name: "mechanicService",
    initialState: {
        mechanicInfo: {},
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
            .addCase(postMechanicData.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(postMechanicData.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.mechanicInfo = action.payload;
            })
            .addCase(postMechanicData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, resetSuccess } = mechanicSlice.actions;
export default mechanicSlice.reducer;