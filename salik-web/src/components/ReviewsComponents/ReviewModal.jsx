import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Rating,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addReviewsAction, getAllReviewsAction, updateReviewAction } from "../../redux/slices/reviewsSlice";

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
  }, [review, open]);

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

    const serviceType = "ride"; // Hardcoded to "ride"

    if (review) {
      await dispatch(updateReviewAction({ 
        reviewId: review._id, 
        rating, 
        comment: reviewText, 
        serviceType 
      }));
    } else {
      await dispatch(addReviewsAction({ 
        providerId, 
        rating, 
        comment: reviewText, 
        serviceType 
      }));
    }

    dispatch(getAllReviewsAction({ providerId, serviceType: "ride" }));
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{review ? "Edit Ride Review" : "Write a Ride Review"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Rating
          name="user-rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
        />
        <TextField
          label="Your Ride Review"
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
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ backgroundColor: "#ffb800", color: "black" }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}