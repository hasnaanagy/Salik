import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../api/apiService";

const initialState = {
  requests: [],
  error: null,
  isLoading: false,
};


export const sendRequestAction = createAsyncThunk(
  "requests/sendRequestAction",
  async ({serviceType,location,problem}, { rejectWithValue }) => {
    try {
      const response = await apiService.create(`request`, {
        serviceType,
        location,       
        problemDescription:problem
      });
      console.log(response);
      return response;
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.message);
    }
  }
);

export const getAllResquestsAction = createAsyncThunk(
    "requests/getAllResquestsAction",
    async (_,{ rejectWithValue }) => {
      try {
        const response = await apiService.getAll("request");
        console.log(response);
        return response.requests;
      } catch (e) {
        return rejectWithValue(e.message);
      }
    }
  );
const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllResquestsAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllResquestsAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.requests = action.payload;
    });
    builder.addCase(getAllResquestsAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(sendRequestAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(sendRequestAction.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(sendRequestAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const requestReducer = requestSlice.reducer;
