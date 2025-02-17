import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUserApi } from '../../services/authService';

export const signUpUser = createAsyncThunk('auth/signUpUser', async (userData, { rejectWithValue }) => {
  try {
    return await registerUser(userData);
  } catch (error) {
    return rejectWithValue(error.response.data.message || "Registration failed.");
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    return await loginUserApi(userData);
  } catch (error) {
    return rejectWithValue(error.response.data.message || "Login failed.");
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => { state.loading = true; })
      .addCase(signUpUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.user = action.payload; 
        state.error = null; 
      })
      .addCase(signUpUser.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.user = action.payload; 
        state.error = null; 
      })
      .addCase(loginUser.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      });
  },
});

export default authSlice.reducer;