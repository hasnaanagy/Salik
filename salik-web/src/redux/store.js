 
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlices';
import addServiceReducer from './slices/addServiceSlice';
import addFuelReducer from './slices/addFeulSlice';
import addMechanicReducer from './slices/addMechanicSlice';
import imageReducer from './slices/imageSlice';
import { reviewReducer } from './slices/reviewsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    addService: addServiceReducer,
    fuelService: addFuelReducer,
    mechanicService: addMechanicReducer,
    images: imageReducer,
    reviewsSlice:reviewReducer,
    ride: rideslice,
  },
});
