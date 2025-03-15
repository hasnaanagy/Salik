import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { addServiceReducer } from "./slices/addServiceSlice";
import { addRideReducer } from "./slices/addRideSlice";
import { licenseReducer } from "./slices/licenseSlice";
import { reviewReducer } from "./slices/reviewsSlice";
import { locationReducer } from "./slices/locationSlice";
import { activityReducer } from "./slices/activitySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    rideService: addRideReducer,
    addServices: addServiceReducer,
    images: licenseReducer,
    reviews: reviewReducer,
    location: locationReducer,
    activity: activityReducer,
  },
});

export default store;
