import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import addServiceReducer from "./slices/addServiceSlice";
import addMechanicReducer from "./slices/addMechanicSlice";
import imageReducer from "./slices/imageSlice";
import { reviewReducer } from "./slices/reviewsSlice";
import rideslice from "./slices/rideSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    addService: addServiceReducer,
    mechanicService: addMechanicReducer,
    images: imageReducer,
    reviewsSlice: reviewReducer,
    ride: rideslice,
  },
});
export default store;
