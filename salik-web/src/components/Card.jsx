import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { cancelRideAction, fetchBooking } from "../redux/slices/activitySlice";
import { MainButton } from "../custom/MainButton";
import car from "/images/car.png"; // Correct path

const Cards = ({ ride }) => {
  const dispatch = useDispatch();
  const [cancelled, setCancelled] = useState(false);
  const { upcoming, completed, canceled } = useSelector(
    (state) => state.activity
  );

  useEffect(() => {}, [upcoming, completed, canceled]);
  const handleCancel = async () => {
    await dispatch(cancelRideAction(ride._id))
      .then(() => setCancelled(true))
      .catch((err) => console.error("Error canceling ride:", err));
    dispatch(fetchBooking());
  };

  const rideDate = ride?.rideDateTime?.split("T")[0];
  const rideTime = ride?.rideDateTime?.split("T")[1]?.slice(0, 5);

  return (
    <Box display="flex" alignItems="center" gap={2} mb={2}>
      {/* Left side */}
      <Box display="flex" alignItems="center">
        <Box
          sx={{
            width: 12,
            height: 12,
            bgcolor: cancelled ? "grey" : "#FFB800",
            borderRadius: "50%",
            marginRight: 1,
            boxShadow: 1,
          }}
        />
        <Typography variant="body2" color="textSecondary">
          {rideDate} {rideTime}
        </Typography>
      </Box>
      {/* Ride Card */}
      <Card
        sx={{ width: 500, display: "flex", alignItems: "center", padding: 1 }}
      >
        <CardContent
          sx={{ display: "flex", alignItems: "center", width: "100%" }}
        >
          {/* Car Icon */}
          <img src={car} style={{ width: 50, marginRight: 20 }} alt="Car" />

          {/* Ride Details */}
          <Box flexGrow={1}>
            <Typography variant="subtitle1">
              {ride.fromLocation} to {ride.toLocation}
            </Typography>
            <Typography variant="body2">
              Price: {ride.price} $ &nbsp; &nbsp; Seats: {ride.bookedSeats}
            </Typography>
          </Box>

          {/* Cancel Button */}
          {ride.status === "upcoming" && (
            <MainButton
              variant="contained"
              disabled={cancelled}
              sx={{
                backgroundColor: cancelled ? "grey" : "#FFB800",
                color: "white",
                textDecoration: cancelled ? "line-through" : "none",
                pointerEvents: cancelled ? "none" : "auto",
                "&:hover": {
                  backgroundColor: cancelled ? "grey" : "#FFA500",
                },
              }}
              onClick={handleCancel}
            >
              {cancelled ? "Cancelled" : "Cancel"}
            </MainButton>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Cards;
