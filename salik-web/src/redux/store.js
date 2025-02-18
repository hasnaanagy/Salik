import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices";
import addServiceReducer from "./slices/addServiceSlice";
import addMechanicReducer from "./slices/addMechanicSlice";
import imageReducer from "./slices/imageSlice";
import rideslice from "./slices/RideSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    addService: addServiceReducer,
    mechanicService: addMechanicReducer,
    images: imageReducer,
    ride: rideslice,
  },
});
