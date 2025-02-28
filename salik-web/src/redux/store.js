import { configureStore } from "@reduxjs/toolkit";
import addServiceReducer from "./slices/addServiceSlice";
import addMechanicReducer from "./slices/addMechanicSlice";
import imageReducer from "./slices/imageSlice";
import { reviewReducer } from "./slices/reviewsSlice";
import { activityReducer } from "./slices/activitySlice";
import { bookingReducer } from "./slices/bookingSlice";
import { authReducer } from "./slices/authSlice";
import { requestReducer } from "./slices/requestServiceSlice";
import { rideReducer } from "./slices/RideSlice";

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
    requestSlice: requestReducer
  },
});
export default store;
