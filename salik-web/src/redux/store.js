import { configureStore } from "@reduxjs/toolkit";
import addServiceReducer from "./slices/addServiceSlice";
import addMechanicReducer from "./slices/addMechanicSlice";
import imageReducer from "./slices/imageSlice";
import { reviewReducer } from "./slices/reviewsSlice";
import { activityReducer } from "./slices/activitySlice";
import { rideReducer } from "./slices/rideSlice";
import { bookingReducer } from "./slices/bookingSlice";
import { authReducer } from "./slices/authSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    addService: addServiceReducer,
    mechanicService: addMechanicReducer,
    images: imageReducer,
    reviewsSlice: reviewReducer,
    ride: rideReducer,
    activity: activityReducer,
    booking: bookingReducer,
  },
});
export default store;
