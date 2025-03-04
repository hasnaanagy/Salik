import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../api/apiService";

export const uploadImages = createAsyncThunk(
  "image/upload",
  async ({ nationalIdImage, licenseImage }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (nationalIdImage) formData.append("nationalIdImage", nationalIdImage);
      if (licenseImage) formData.append("licenseImage", licenseImage);

      console.log(
        "🔥 Sending FormData:",
        Object.fromEntries(formData.entries())
      );

      // إرسال البيانات إلى الخادم
      const response = await apiService.patch("auth", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("🔥 Full API Response:", response.updatedUser);

      // التحقق مما إذا كانت البيانات موجودة في الاستجابة
      if (!response.updatedUser) {
        throw new Error("❌ Server response is empty or undefined.");
      }

      console.log("🔥 API Data:", response.updatedUser);

      // استخراج البيانات بأمان
      const updatedUser = response.updatedUser;

      if (!updatedUser) {
        throw new Error("❌ Invalid server response: Missing updatedUser.");
      }

      return {
        nationalIdImage: updatedUser.nationalIdImage || null,
        licenseImage: updatedUser.licenseImage || null,
      };
    } catch (error) {
      console.error("❌ Upload failed:", error);

      // التأكد من إرجاع رسالة خطأ واضحة
      return rejectWithValue(
        error.response?.data?.message || "Upload failed. Please try again."
      );
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
  reducers: {
    setImage: (state, action) => {
      state[action.payload.type] = {
        url: action.payload.url, // تخزين الرابط فقط
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.loading = false;
        state.nationalIdImage =
          action.payload.nationalIdImage || state.nationalIdImage;
        state.licenseImage = action.payload.licenseImage || state.licenseImage;
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setImage } = imageSlice.actions;
export default imageSlice.reducer;
