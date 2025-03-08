import { configureStore } from "@reduxjs/toolkit";
import addRideReducer from "./slices/addRideSlice";
import addServiceReducer from "./slices/addServiceSlice";

const store = configureStore({
  reducer: {
    rideService: addRideReducer,
    addServices: addServiceReducer,
  },
});

export default store;
