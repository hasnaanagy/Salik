import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import ReviewModal from "./ReviewsComponents/ReviewModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsAction } from "../redux/slices/reviewsSlice";
import CircularProgress from "@mui/material/CircularProgress";
import ReviewCard from "./ReviewsComponents/ReviewCard";

export default function ReviewsComponent({ providerId }) {
  const dispatch = useDispatch();
  const { reviews, error, isLoading } = useSelector((state) => state.reviewsSlice);
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    if (providerId) {
      dispatch(getAllReviewsAction({ providerId, serviceType: "ride" }));
    }
  }, [dispatch, providerId]);

  const handleOpen = (review) => {
    setSelectedReview(review);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "40px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ margin: "30px 20px" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review._id} handleOpen={handleOpen} review={review} />
          ))
        ) : (
          <Box sx={{ textAlign: "center", color: "#666" }}>
            No ride reviews available
          </Box>
        )}
      </Box>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#ffb800",
          color: "black",
          fontWeight: "bold",
          marginTop: "20px",
          "&:hover": { backgroundColor: "#e0a700" },
        }}
        onClick={() => handleOpen(null)}
      >
        Add Review
      </Button>
      <ReviewModal
        open={open}
        setOpen={setOpen}
        providerId={providerId}
        review={selectedReview}
      />
    </Box>
  );
}