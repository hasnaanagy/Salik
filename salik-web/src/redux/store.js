import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./slices/imageSlice";
import { reviewReducer } from "./slices/reviewsSlice";
import { activityReducer } from "./slices/activitySlice";
import { bookingReducer } from "./slices/bookingSlice";
import { authReducer } from "./slices/authSlice";
import { requestReducer } from "./slices/requestServiceSlice";
import { rideReducer } from "./slices/RideSlice";
import serviceSlice from "./slices/serviceSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    serviceSlice: serviceSlice,
    images: imageReducer,
    reviewsSlice: reviewReducer,
    ride: rideReducer,
    activity: activityReducer,
    booking: bookingReducer,
    requestSlice: requestReducer,
  },
});
export default store;
