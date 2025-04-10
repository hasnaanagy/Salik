import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "images",
  initialState: {
    nationalIdImage: null, // Temporary preview URL (e.g., from URL.createObjectURL)
    licenseImage: null,
    loading: false,
    error: null,
  },
  reducers: {
    setImage: (state, action) => {
      state[action.payload.type] = action.payload.url; // Store preview URL
    },
    clearImages: (state) => {
      state.nationalIdImage = null;
      state.licenseImage = null;
    },
  },
});

export const { setImage, clearImages } = imageSlice.actions;
export default imageSlice.reducer;