import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageApi } from "../../api/uploadLicenceService";

// Async thunk for uploading images
export const uploadImage = createAsyncThunk(
    "image/upload",
    async ({ file, type }, { rejectWithValue }) => {
        try {
            const response = await uploadImageApi(file, type);
            return { type, url: response.url }; // Save image URL with type
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const imageSlice = createSlice({
    name: "images",
    initialState: {
        profilePhoto: null,
        licensePhoto: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadImage.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.type === "profilePhoto") {
                    state.profilePhoto = action.payload.url;
                } else {
                    state.licensePhoto = action.payload.url;
                }
            })
            .addCase(uploadImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default imageSlice.reducer;