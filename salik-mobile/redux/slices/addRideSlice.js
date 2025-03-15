import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api_service";
<<<<<<< HEAD
import apiService from "../../api/api_service";
=======
>>>>>>> 5fb6248eaaa8563d44fa71518310c42ee4a076a8

export const postRideData = createAsyncThunk(
  "rideService/postRideData",
  async (
    { carType, fromLocation, toLocation, totalSeats, price, date, time },

    { rejectWithValue }
  ) => {
    console.log("API Call:", { carType, fromLocation, toLocation, totalSeats });
    try {
      const response = await api.create("rides", {
        carType,
        fromLocation,
        toLocation,
        totalSeats,
        price,
        date,
        time,
      });

      // console.log("🚀 Response Data:", response); // ✅ طباعة الاستجابة بعد استدعاء API

      return response; // ✅ تأكد من إرجاع البيانات الصحيحة
    } catch (error) {
      // console.error("❌ API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || "Failed to add ride service"
      );
    }
  }
);
export const searchRidesAction = createAsyncThunk(
  "rideService/searchRidesAction",
  async ({ fromLocation, toLocation, date, time }, { rejectWithValue }) => {
    try {
      console.log("🚀 Dispatching search with:", { fromLocation, toLocation, date, time });

      const response = await apiService.getAll(
        `rides/search?fromLocation=${fromLocation}&toLocation=${toLocation}&date=${date}&time=${time}`
      );

      console.log("✅ API Response:", response);
      return response.rides;
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to search rides");
    }
  }
);


export const updateRideAction = createAsyncThunk(
  "ride/updateRideAction",
  async ({ id, form }, { rejectWithValue }) => {
    try {
      const response = await api.update(`rides/${id}`, form);
      return response;
    } catch (error) {
      // console.error("❌ API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Error updating ride."
      );
    }
  }
);

const addRideSlice = createSlice({
  name: "rideService",
  initialState: {
    rideInfo: {},
    loading: false,
    error: null,
    success: false,
<<<<<<< HEAD
    rides:[]
=======
    isEditMode: false, // ✅ متغير جديد يحدد إذا كنا في وضع التعديل
>>>>>>> 5fb6248eaaa8563d44fa71518310c42ee4a076a8
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
      .addCase(postRideData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(postRideData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.isEditMode = false; // ✅ تأكيد أنها عملية إضافة

        state.rideInfo = action.payload;
      })
      .addCase(postRideData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
<<<<<<< HEAD
      builder
      .addCase(searchRidesAction.pending, (state) => {
        state.error=null
        state.loading = true;
      })
      .addCase(searchRidesAction.fulfilled, (state, action) => {
        state.error=null
        state.loading = false;
        state.rides = action.payload;
      })
      .addCase(searchRidesAction.rejected, (state, action) => {
=======
      .addCase(updateRideAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRideAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true; // ✅ ضبط success ليظهر الـ Alert
        state.isEditMode = true; // ✅ تأكيد أنها عملية تحديث
        state.ride = action.payload.ride;
      })
      .addCase(updateRideAction.rejected, (state, action) => {
>>>>>>> 5fb6248eaaa8563d44fa71518310c42ee4a076a8
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetSuccess } = addRideSlice.actions;
export const addRideReducer = addRideSlice.reducer;
