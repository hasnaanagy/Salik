import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../api/apiService";

export const filterUsersAction = createAsyncThunk(
  "documentVerification/filterUsersAction",
  async (userType, { rejectWithValue }) => {
    try {
      const data = await apiService.getAll(`auth/users?type=${userType}`)
      console.log(data)
      return data.users; 
    } catch (error) {
        console.log(error.response?.data?.message)
      return rejectWithValue(error.response?.data?.message || "Filtering users failed");
    }
  }
);


export const verifyDocumentAction = createAsyncThunk(
    "documentVerification/verifyDocumentAction",
    async (documentData, { rejectWithValue }) => {
      try {
        const data = await apiService.create("auth/verify-document",documentData)
        console.log(data.user)
        return data.user; 
      } catch (error) {
          console.log(error.response?.data?.message)
        return rejectWithValue(error.response?.data?.message || "Filtering users failed");
      }
    }
  );
  

const documentVerificationSlice = createSlice({
  name: "documentVerification",
  initialState: {
    users:[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(filterUsersAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterUsersAction.fulfilled, (state, action) => {
        state.loading = false;
        state.users=action.payload
      })
      .addCase(filterUsersAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyDocumentAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyDocumentAction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyDocumentAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const documentVerificationReducer = documentVerificationSlice.reducer;