import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const rootReducer = (state, action) => {
    if (action.type === "RESET_APP") {
        state = undefined;
    }
    return authReducer(state, action);
};

const store = configureStore({
    reducer: {
        auth: rootReducer,
    },
});

export default store;
