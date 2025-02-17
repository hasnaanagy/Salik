import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import uploadService from "../../api/uploadLicenceService";

export const uploadImage = createAsyncThunk(
    "images/uploadImage",
    async ({ file, type }) => {
        const response = await uploadService.uploadImage(file);
        return { type, url: response.url };
    }
);

const imageSlice = createSlice({
    name: "images",
    initialState: {
        profilePhoto: null,
        licensePhoto: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(uploadImage.fulfilled, (state, action) => {
            state[action.payload.type] = action.payload.url;
        });
    },
});

export default imageSlice.reducer;
