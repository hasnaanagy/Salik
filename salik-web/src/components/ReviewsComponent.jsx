import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewsComponents/reviewCard";
import { Box, Button } from "@mui/material";
import ReviewModal from "./ReviewsComponents/ReviewModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsAction } from "../redux/slices/reviewsSlice";

export default function ReviewsComponent({ providerId }) {
  const dispatch = useDispatch();
  const { reviews, error, isLoading } = useSelector(
    (state) => state.reviewsSlice
  );
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    dispatch(getAllReviewsAction(`${providerId}`));
  }, []);
  return (
    console.log(reviews),
    (
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
                  setOpen={setOpen}
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
          onClick={handleOpen}
        >
          Add Review
        </Button>
        <ReviewModal open={open} setOpen={setOpen} />
      </Box>
    )
  );
}
