import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageApi } from "../../api/uploadLicenceService";
import apiService from "../../api/apiService";

// Async thunk for uploading images
export const uploadImages = createAsyncThunk(
    "image/upload",
    async ({ nationalIdImage, licenseImage }, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            if (nationalIdImage) {
                formData.append("nationalIdImage", nationalIdImage);
            }
            if (licenseImage) {
                formData.append("licenseImage", licenseImage);
            }

            const response = await apiService.patch("auth", formData);
            
            return {
                nationalIdImage: response.data.updatedUser.nationalIdImage,
                licenseImage: response.data.updatedUser.licenseImage,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const imageSlice = createSlice({
    name: "images",
    initialState: {
        nationalIdImage: null,
        licenseImage: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadImages.fulfilled, (state, action) => {
                state.loading = false;
                state.nationalIdImage = action.payload.nationalIdImage || state.nationalIdImage;
                state.licenseImage = action.payload.licenseImage || state.licenseImage;
            })
            .addCase(uploadImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default imageSlice.reducer;
