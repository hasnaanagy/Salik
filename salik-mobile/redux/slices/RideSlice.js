import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../api/api_service";

export const postRideData = createAsyncThunk(
  "rideService/postRideData",
  async (
    { carType, fromLocation, toLocation, totalSeats, price, date, time },

    { rejectWithValue }
  ) => {
    console.log("API Call:", { carType, fromLocation, toLocation, totalSeats });
    try {
      const response = await apiService.create("rides", {
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
      console.error("❌ API Error:", error.response?.data || error.message);
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
      console.log("🚀 Dispatching search with:", {
        fromLocation,
        toLocation,
        date,
        time,
      });

      const response = await apiService.getAll(
        `rides/search?fromLocation=${fromLocation}&toLocation=${toLocation}&date=${date}&time=${time}`
      );

      console.log("✅ API Response:", response);
      return response.rides;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to search rides");
    }
  }
);

export const updateRideAction = createAsyncThunk(
  "ride/updateRideAction",
  async ({ id, form }, { rejectWithValue }) => {
    try {
      const response = await apiService.update(`rides/${id}`, form);
      return response;
    } catch (error) {
      // console.error("❌ API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Error updating ride."
      );
    }
  }
);

export const bookRideAction = createAsyncThunk(
  "ride/bookRideAction",
  async ({ rideId, bookedSeats }, { rejectWithValue }) => {
    try {
      console.log(rideId, bookedSeats)
      const response = await apiService.create(`rideBooking`, {rideId, bookedSeats});
      console.log(response)
      return response;
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Error updating ride."
      );
    }
  }
);


export const getRideById = createAsyncThunk(
  "rideService/getRideById",
  async ({rideId}, { rejectWithValue }) => {
    try {

      const response = await apiService.getById("rides",rideId);
      console.log("Ride", response);
      return response.ride;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get ride");
    }
  }
);

const RideSlice = createSlice({
  name: "rideService",
  initialState: {
    loading: false,
    error: null,
    success: false,
    rides: [],
    isEditMode: false, // ✅ متغير جديد يحدد إذا كنا في وضع التعديل
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
      })
      .addCase(postRideData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(searchRidesAction.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(searchRidesAction.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.rides = action.payload;
      })
      .addCase(searchRidesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRideAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRideAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true; // ✅ ضبط success ليظهر الـ Alert
        state.isEditMode = true; // ✅ تأكيد أنها عملية تحديث
      })
      .addCase(updateRideAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRideById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRideById.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = action.payload.ride;        
      })
      .addCase(getRideById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bookRideAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookRideAction.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(bookRideAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearError, resetSuccess } = RideSlice.actions;
export const RideReducer = RideSlice.reducer;
