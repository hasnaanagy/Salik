import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { addServiceReducer } from "./slices/addServiceSlice";
import { addRideReducer } from "./slices/addRideSlice";
import { requestReducer } from "./slices/requestServiceSlice";
import { activityReducer } from "./slices/activitySlice";
const rootReducer = (state, action) => {
    if (action.type === "RESET_APP") {
        state = undefined;
    }
    return authReducer(state, action);
};

const store = configureStore({
    reducer: {
        auth: rootReducer,
        rideService: addRideReducer,
        addServices: addServiceReducer,
        activity: activityReducer,
        requestSlice: requestReducer,
    },
});

export default store;
