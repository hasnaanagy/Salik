import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../api/apiService";

const initialState={
    reviews:[],
    error:null,
    isLoading:false
}

export const getAllReviewsAction=createAsyncThunk("reviews/getAllReviewsAction",
    async(providerId,{rejectWithValue})=>{

    try{
        const response=await apiService.getById("reviews",providerId)
        return response;
    }catch(e){
        return rejectWithValue(e.message)
    }
    }
)
export const addReviewsAction = createAsyncThunk(
    "reviews/addReviewsAction",
    async ({ providerId, rating, comment }, { rejectWithValue}) => {
      try {
        const response = await apiService.create(
          `reviews/${providerId}`,
          { rating, comment },
        );
        return response;
      } catch (e) {
        console.log(e)
        return rejectWithValue(e.message);
      }
    }
  );
  
const reviewSlice=createSlice({
    name:"reviews",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllReviewsAction.pending,(state,action)=>{
            state.isLoading=true;
        });
        builder.addCase(getAllReviewsAction.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.reviews=action.payload.reviews;
        });
        builder.addCase(getAllReviewsAction.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload;
        });
        builder.addCase(addReviewsAction.pending,(state,action)=>{
            state.isLoading=true;
        });
        builder.addCase(addReviewsAction.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.reviews=action.payload;
        });
        builder.addCase(addReviewsAction.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload;
        });

    }
})

export const reviewReducer=reviewSlice.reducer;