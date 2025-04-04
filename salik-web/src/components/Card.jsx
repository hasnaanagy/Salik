import React, { useState } from "react";
import { Card, CardContent, Typography, Box, colors } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelBooking,
  fetchBooking,
  fetchProviderRides,
} from "../redux/slices/activitySlice";
import { MainButton } from "../custom/MainButton";
import car from "/images/car.png"; // Correct path
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Tooltip } from "@mui/material";
import { data, useNavigate } from "react-router-dom";
import { deleteRideAction } from "../redux/slices/RideSlice";
const Cards = ({ ride }) => {
  const { user } = useSelector((state) => state.auth);
  console.log("User type: ", user.type);
  const dispatch = useDispatch();
  const [cancelled, setCancelled] = useState(ride.status === "canceled");
  const navigate = useNavigate();
  const handleCancel = async () => {
    await dispatch(cancelBooking(ride._id));
    setCancelled(true);
    dispatch(fetchBooking());
  };
  const handleDelete = async () => {
    await dispatch(deleteRideAction(ride._id));
    dispatch(fetchProviderRides());
  };
  // Format ride date and time
  const rideDate = ride?.rideDateTime?.split("T")[0];
  const rideTime = ride?.rideDateTime?.split("T")[1]?.slice(0, 5);
  const handleLocationField = (data) => {
    var location = data?.length > 13 ? `${data?.slice(0, 13)}...` : data;
    return location;
  };
  const colors =
    ride.status === "upcoming"
      ? "#FFB800"
      : ride.status === "completed"
      ? "#4C585B"
      : "#F44336";
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      mb={2}
      sx={{
        "&:hover": {
          transform: "scale(1.05) translateX(20px)",
          transition: "0.3s",
        },
      }}
    >
      {/* Left side */}
      <Box display="flex" alignItems="center">
        <Box
          sx={{
            width: 12,
            height: 12,
            bgcolor: colors,
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
        sx={{
          width: "fit-content",
          display: "flex",
          alignItems: "center",
          padding: 1,
        }}
      >
        <CardContent
          sx={{ display: "flex", alignItems: "center", width: "100%" }}
        >
          <img src={car} style={{ width: 50, marginRight: 20 }} alt="Car" />

          {/* Ride Details */}
          <Box flexGrow={1}>
            <Typography variant="subtitle1">
              {handleLocationField(ride.fromLocation)} to{" "}
              {handleLocationField(ride.toLocation)}
            </Typography>
            <Typography variant="body2">
              Price: {ride.price} $ &nbsp; &nbsp;
              {user.type === "customer" ? "Booked Seats:" : "Total Seats:"}
              {user.type === "customer" ? ride.bookedSeats : ride.totalSeats}
            </Typography>
            {user.type === "provider" && (
              <Typography variant="body2">
                Available Seats : {ride.totalSeats - ride.bookedSeats}
              </Typography>
            )}
          </Box>

          {/* Cancel Button */}
          {ride.status === "upcoming" && user.type === "customer" && (
            <MainButton
              variant="contained"
              disabled={cancelled}
              sx={{
                backgroundColor: "#FFB800",
                color: "white",
                pointerEvents: "auto",
                "&:hover": {
                  backgroundColor: colors,
                },
              }}
              onClick={handleCancel}
            >
              Cancel
            </MainButton>
          )}

          {/* Edit Button (for providers) */}
          {ride.status === "upcoming" && user.type === "provider" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={() =>
                  navigate(`/addTrip`, { state: { rideId: ride._id } })
                }
                sx={{
                  color: "#ffb800", // Blue color for edit
                  transition: "0.3s",
                  "&:hover": { color: "#0D47A1", transform: "scale(1.2)" },
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
                  "&:hover": { color: "#B71C1C", transform: "scale(1.2)" },
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
