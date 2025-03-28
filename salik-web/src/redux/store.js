import { configureStore } from "@reduxjs/toolkit";
import { ServiceReducer } from "./slices/serviceSlice";
import imageReducer from "./slices/imageSlice";
import { reviewReducer } from "./slices/reviewsSlice";
import { activityReducer } from "./slices/activitySlice";
import { authReducer } from "./slices/authSlice";
import { requestReducer } from "./slices/requestServiceSlice";
import { rideReducer } from "./slices/RideSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    service: ServiceReducer,
    images: imageReducer,
    reviewsSlice: reviewReducer,
    ride: rideReducer,
    activity: activityReducer,
    requestSlice: requestReducer,
  },
});
export default store;
