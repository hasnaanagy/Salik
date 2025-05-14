import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { ServiceReducer } from "./slices/ServiceSlice";
import { RideReducer } from "./slices/RideSlice";
import { licenseReducer } from "./slices/licenseSlice";
import { reviewReducer } from "./slices/reviewsSlice";
import { locationReducer } from "./slices/locationSlice";
import { activityReducer } from "./slices/activitySlice";
import { requestReducer } from "./slices/requestServiceSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    rideService: RideReducer,
    service: ServiceReducer,
    images: licenseReducer,
    reviews: reviewReducer,
    location: locationReducer,
    activity: activityReducer,
    requestSlice: requestReducer,
  },
});

export default store;
