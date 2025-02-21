import React from "react";
import ReviewsComponent from "../components/ReviewsComponent";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function Reviews() {
  const location = useLocation();
  const { providerId } = location.state || {};
  console.log("Provider ID:", providerId._id);
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "18px",
            color: "#444",
            marginTop: "20px",
          }}
        >
          What Poeple Say
        </Typography>
      </Box>
      <ReviewsComponent providerId={providerId._id} />
    </>
  );
}
