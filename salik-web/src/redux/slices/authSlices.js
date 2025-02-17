import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUserApi } from '../../services/authService';




export const signUpUser = createAsyncThunk('auth/signUpUser', async (userData, { rejectWithValue }) => {
  try {
    return await registerUser(userData);
  } catch (error) {
    console.error("Error in signUpUser:", error.response); // Log the full response
    return rejectWithValue(error.response?.data?.message || "Registration failed.");
  }
});

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await loginUserApi(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed.");
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed.";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed.";
      });
  },
});

export default authSlice.reducer;
