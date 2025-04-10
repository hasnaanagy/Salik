import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../api/apiService";

const initialState = {
  reviews: [],
  error: null,
  isLoading: false,
};

export const getAllReviewsAction = createAsyncThunk(
  "reviews/getAllReviewsAction",
  async ({ providerId, serviceType }, { rejectWithValue }) => {
    try {
      console.log("ssssss", providerId, serviceType);
      const url = serviceType
        ? `reviews/${providerId}?serviceType=${serviceType}`
        : `reviews/${providerId}`;
      console.log("Fetching reviews from URL:", url);
      const response = await apiService.getAll(url);
      console.log("API Response:", response);
      return response;
    } catch (e) {
      console.error("API Error:", e.response?.data || e.message);
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const addReviewsAction = createAsyncThunk(
  "reviews/addReviewsAction",
  async ({ providerId, rating, comment, serviceType }, { rejectWithValue }) => {
    try {
      const response = await apiService.create(`reviews/${providerId}`, {
        rating,
        comment,
        serviceType,
      });
      return response;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const deleteReviewAction = createAsyncThunk(
  "reviews/deleteReviewAction",
  async (reviewId, { rejectWithValue }) => {
    try {
      console.log(" delete", reviewId);
      const response = await apiService.delete("reviews", reviewId);
      return response;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const updateReviewAction = createAsyncThunk(
  "reviews/updateReviewAction",
  async ({ reviewId, rating, comment }, { rejectWithValue }) => {
    console.log(reviewId);
    console.log(rating, comment);
    try {
      const response = await apiService.update(`reviews/${reviewId}`, {
        rating,
        comment,
      });
      return response;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllReviewsAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllReviewsAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reviews = action.payload.reviews;
      console.log("Updated reviews state:", state.reviews);
    });
    builder.addCase(getAllReviewsAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(addReviewsAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addReviewsAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reviews.push(action.payload.review);
    });
    builder.addCase(addReviewsAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const reviewReducer = reviewSlice.reducer;
