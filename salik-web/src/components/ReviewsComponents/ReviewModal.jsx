import React, { useState } from 'react'
import {
     Button, Dialog, DialogActions,DialogContent, DialogTitle, TextField,Rating,
  } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { addReviewsAction } from '../../redux/slices/reviewsSlice';
export default function ReviewModal({open,setOpen}) {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const dispatch=useDispatch()
    const handleClose = () => {
        setOpen(false);
        setRating(0);
        setReviewText("");
      };
      
      const addReview = async () => {
        const providerId = "67ae7330e7702b6a83cf4034";
        await dispatch(addReviewsAction({ providerId, rating, comment: reviewText }));
      };
      

    const handleSubmit =async () => {
        addReview()
        console.log("Review Submitted:", { rating, reviewText });
        handleClose();
      };
  return (
    <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Write a Review</DialogTitle>
    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Rating
        name="user-rating"
        value={rating}
        onChange={(event, newValue) => setRating(newValue)} />
      <TextField
        label="Your Review"
        multiline
        rows={3}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="black">
        Cancel
      </Button>
      <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: "#ffb800", color: "black" }}>
        Submit
      </Button>
    </DialogActions>
  </Dialog>
    )
}
