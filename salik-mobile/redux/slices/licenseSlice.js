import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api_service";

// ✅ Function to upload a file to Cloudinary
const uploadToCloudinary = async (uri) => {
  if (!uri) return null;

  const formData = new FormData();
  formData.append("file", {
    uri,
    name: "upload.jpg", // اسم افتراضي للصورة
    type: "image/jpeg", // نوع الملف
  });
  formData.append("upload_preset", "salik-preset"); // ✅ استبدل بـ preset الصحيح من Cloudinary

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dfouknww9/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (!data.secure_url) throw new Error("❌ Failed to upload to Cloudinary.");

    return data.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    return null;
  }
};

// ✅ Redux Thunk to upload images
export const uploadImages = createAsyncThunk(
  "image/upload",
  async ({ nationalIdImage, licenseImage }, { rejectWithValue }) => {
    try {
      console.log("🔥 Received Images:", { nationalIdImage, licenseImage });

      // ✅ رفع الصور إلى Cloudinary
      const nationalIdUrl = await uploadToCloudinary(nationalIdImage);
      const licenseUrl = await uploadToCloudinary(licenseImage);

      if (!nationalIdUrl || !licenseUrl) {
        throw new Error("❌ Upload to Cloudinary failed.");
      }

      // ✅ إرسال الصور إلى الـ API
      const response = await api.patch(
        "auth",
        { nationalIdImage: nationalIdUrl, licenseImage: licenseUrl }, // إرسال الروابط فقط
        { headers: { "Content-Type": "application/json" } } // ✅ تحسين الـ Headers
      );

      console.log("🔥 API Response:", response.updatedUser);

      if (!response.updatedUser) {
        throw new Error("❌ Server response is empty or undefined.");
      }

      return {
        nationalIdImage: response.updatedUser.nationalIdImage || null,
        licenseImage: response.updatedUser.licenseImage || null,
      };
    } catch (error) {
      console.error("❌ Upload failed:", error);
      console.error("❌ API Response:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Upload failed. Please try again."
      );
    }
  }
);

// ✅ Redux Slice
const imageSlice = createSlice({
  name: "images", // ✅ تأكد من أنه متطابق مع `store.js`
  initialState: {
    nationalIdImage: null,
    licenseImage: null,
    loading: false,
    error: null,
  },
  reducers: {
    setImage: (state, action) => {
      state[action.payload.type] = action.payload.uri; // ✅ تخزين `uri` فقط
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
        state.nationalIdImage = action.payload.nationalIdImage;
        state.licenseImage = action.payload.licenseImage;
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setImage } = imageSlice.actions;
export const licenseReducer = imageSlice.reducer;
