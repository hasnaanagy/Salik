import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    fromLocation: "", 
    toLocation: "",
    focusedInput: "fromLocation", // الافتراضي هو `fromLocation`
  },
  reducers: {
    setFromLocation: (state, action) => {
      state.fromLocation = action.payload;
    },
    setToLocation: (state, action) => {
      state.toLocation = action.payload;
    },
    setFocusedInput: (state, action) => {
      state.focusedInput = action.payload; // تحديث الإدخال النشط
    },
    clearLocation:(state)=>{
      state.fromLocation=""
      state.toLocation=""
      state.focusedInput="fromLocation"
    }
  },
});

export const { setFromLocation, setToLocation, setFocusedInput,clearLocation } = locationSlice.actions;
export const locationReducer = locationSlice.reducer;
