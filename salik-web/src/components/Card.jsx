import React, { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelRideAction,
  deleteRideAction,
  fetchBooking,
  fetchProvidedRides,
} from "../redux/slices/activitySlice";
import { MainButton } from "../custom/MainButton";
import car from "/images/car.png"; // Correct path
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Cards = ({ ride }) => {
  const { user } = useSelector((state) => state.auth)
  console.log("User type: ", user.type);
  const dispatch = useDispatch();
  const [cancelled, setCancelled] = useState(ride.status === "canceled");
  const navigate = useNavigate()
  const handleCancel = async () => {
    await dispatch(cancelRideAction(ride._id));
    setCancelled(true);
    dispatch(fetchBooking());
  };
  const handleDelete = async () => {
    await dispatch(deleteRideAction(ride._id));
    dispatch(fetchProvidedRides());
  }
  // const handleEdit = () => {
  //   console.log("Edit ride:", ride._id);
  //   // Add your edit logic here
  // };

  // Format ride date and time
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
      <Card sx={{ width: 500, display: "flex", alignItems: "center", padding: 1 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          {/* Car Icon */}
          <img src={car} style={{ width: 50, marginRight: 20 }} alt="Car" />

          {/* Ride Details */}
          <Box flexGrow={1}>
            <Typography variant="subtitle1">
              {ride.fromLocation} to {ride.toLocation}
            </Typography>
            <Typography variant="body2">
              Price: {ride.price} $ &nbsp; &nbsp; Seats: {user.type === "customer" ? ride.bookedSeats : ride.totalSeats - ride.bookedSeats}
            </Typography>
          </Box>

          {/* Cancel Button */}
          {ride.status === "upcoming" && user.type === "customer" && (
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

          {/* Edit Button (for providers) */}
          {ride.status === "upcoming" && user.type === "provider" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={() => navigate(`/addTrip`, { state: { rideId: ride._id } })}
                sx={{
                  color: "#ffb800", // Blue color for edit
                  transition: "0.3s",
                  "&:hover": { color: "#0D47A1", transform: "scale(1.2)" }
                }}
              >
                <Tooltip title="Edit">
                  <EditIcon />
                </Tooltip>
              </IconButton>

              <IconButton
                onClick={handleDelete}
                sx={{
                  color: "#F44336", // Red color for delete
                  transition: "0.3s",
                  "&:hover": { color: "#B71C1C", transform: "scale(1.2)" }
                }}
              >
                <Tooltip title="Delete">
                  <DeleteIcon />
                </Tooltip>
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Cards;
