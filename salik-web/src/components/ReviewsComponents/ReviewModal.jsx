import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Rating,
} from "@mui/material";
import { useDispatch } from 'react-redux';
import { addReviewsAction, getAllReviewsAction, updateReviewAction } from '../../redux/slices/reviewsSlice';

export default function ReviewModal({ open, setOpen, review, providerId }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setReviewText(review.comment);
    } else {
      setRating(0);
      setReviewText("");
    }
  }, [review, open]);  // Added `open` dependency to reset when modal opens for a new review

  const handleClose = () => {
    setOpen(false);
    setRating(0);
    setReviewText("");
  };

  const handleSubmit = async () => {
    if (!providerId) {
      console.error("Provider ID is missing!");
      return;
    }

    if (review) {
      await dispatch(updateReviewAction({ reviewId: review._id, rating, comment: reviewText }));
    } else {
      await dispatch(addReviewsAction({ providerId, rating, comment: reviewText }));
    }

    dispatch(getAllReviewsAction(providerId));
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{review ? "Edit Review" : "Write a Review"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Rating
          name="user-rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
        />
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
  );
}
