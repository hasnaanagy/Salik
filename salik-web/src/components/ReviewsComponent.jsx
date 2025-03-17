import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import ReviewModal from "./ReviewsComponents/ReviewModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsAction } from "../redux/slices/reviewsSlice";
import CircularProgress from "@mui/material/CircularProgress";
import ReviewCard from "./ReviewsComponents/ReviewCard";

export default function ReviewsComponent({ providerId }) {
  const dispatch = useDispatch();
  const { reviews, error, isLoading } = useSelector(
    (state) => state.reviewsSlice
  );
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const handleOpen = (review) => {
    setSelectedReview(review);
    setOpen(true);
  };

  useEffect(() => {
    dispatch(getAllReviewsAction(`${providerId}`));
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "40px",
        }}
      >
        <CircularProgress />;
      </Box>
    );
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (reviews) {
    return (
      <Box sx={{ margin: "30px 20px" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {reviews &&
            reviews.map((review) => {
              return (
                <ReviewCard
                  key={review._id}
                  handleOpen={handleOpen}
                  review={review}
                />
              );
            })}
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
}
