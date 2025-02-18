import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUserApi } from '../../services/authService';

const signUpUser = createAsyncThunk('auth/signUpUser', async (userData) => {
  try {
    return await registerUser(userData);
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

const loginUser = createAsyncThunk('auth/loginUser', async (userData) => {
  return await loginUserApi(userData);
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token"); // Remove token on logout
    }
  },
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
        state.error = action.error.message;
        console.error("Error during signup: ", action.error);
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token; // Store token in state
        localStorage.setItem("token", action.payload.token); // Save token in localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
export { signUpUser, loginUser };
