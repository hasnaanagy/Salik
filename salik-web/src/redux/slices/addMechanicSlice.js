import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/postService"; // Importing the axios instance

// Async action to post mechanic data
export const postMechanicData = createAsyncThunk(
    "Service/postServiceData",
    async ({ serviceType, location, addressOnly, workingDays, workingHours }, { rejectWithValue }) => {
        try {
            const response = await api.post("/service",
                {
                    serviceType,
                    location,
                    addressOnly,
                    workingDays,
                    workingHours,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I0NTQwYjVmM2Y5YmJkNDk2MjkwYTEiLCJ0eXBlIjoiY3VzdG9tZXIiLCJpYXQiOjE3Mzk4NzEyODYsImV4cCI6MTczOTg3NDg4Nn0.kVohPNZcoZQmktnSDSHs-DsWN-FsuBzWFvpQ_9FRxxM`,
                    },
                }
            );
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