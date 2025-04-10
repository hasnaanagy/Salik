import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { documentVerificationReducer } from "./slices/documentVerificationSlice";

export const store = configureStore({
  reducer: {
       auth: authReducer,
       documentVerificationSlice : documentVerificationReducer
  },
});
export default store;
