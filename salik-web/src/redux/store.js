import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlices';
import addServiceReducer from './slices/addServiceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    addService: addServiceReducer,  
  },
});
