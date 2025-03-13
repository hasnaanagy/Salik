import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { addServiceReducer } from "./slices/addServiceSlice";
import { addRideReducer } from "./slices/addRideSlice";
<<<<<<< HEAD
import { requestReducer } from "./slices/requestServiceSlice";
import { activityReducer } from "./slices/activitySlice";
=======
import { locationReducer } from "./slices/locationSlice";
import { activityReducer } from "./slices/activitySlice";

>>>>>>> master
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
<<<<<<< HEAD
        activity: activityReducer,
        requestSlice: requestReducer,
=======
         location: locationReducer,
         activity: activityReducer,
>>>>>>> master
    },
});

export default store;
