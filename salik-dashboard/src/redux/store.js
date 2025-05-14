import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { documentVerificationReducer } from "./slices/documentVerificationSlice";
import { dashboardStatisticsReducer } from "./slices/dashboardStatisticsSlice";

export const store = configureStore({
  reducer: {
       auth: authReducer,
       documentVerificationSlice : documentVerificationReducer,
       dashboardStatisticsSlice:dashboardStatisticsReducer
  },
});
export default store;
