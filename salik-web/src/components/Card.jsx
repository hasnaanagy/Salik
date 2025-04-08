import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelBooking,
  fetchBooking,
  fetchProviderRides,
} from "../redux/slices/activitySlice";
import { MainButton } from "../custom/MainButton";
import car from "/images/car.png"; // Correct path
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { deleteRideAction } from "../redux/slices/RideSlice";
import CardStyles from "../styles/CardStyle"; // Adjust the path if needed

const Cards = ({ ride }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cancelled, setCancelled] = useState(ride.status === "canceled");

  const handleCancel = async () => {
    await dispatch(cancelBooking(ride._id));
    setCancelled(true);
    dispatch(fetchBooking());
  };

  const handleDelete = async () => {
    await dispatch(deleteRideAction(ride._id));
    dispatch(fetchProviderRides());
  };

  const handleEdit = () => {
    navigate(`/addTrip`, { state: { rideId: ride._id } });
  };

  // Format ride date and time
  let rideTime = "N/A";
  if (ride?.rideDateTime) {
    const rideTimeRaw = ride.rideDateTime.split("T")[1]?.slice(0, 5);
    if (rideTimeRaw) {
      const [hours, minutes] = rideTimeRaw.split(":");
      const hourNum = parseInt(hours, 10);
      rideTime = `${hourNum % 12 || 12}:${minutes} ${hourNum < 12 ? "AM" : "PM"}`;
    }
  }
  const rideDate = ride?.rideDateTime?.split("T")[0] || "N/A";

  const handleLocationField = (data) =>
    data?.length > 10 ? `${data?.slice(0, 10)}...` : data;

  const statusColor =
    ride.status === "upcoming"
      ? "#FFB800"
      : ride.status === "completed"
        ? "#4C585B"
        : "#F44336";

  return (
    <Box sx={CardStyles.container}>
      {/* Status Dot */}
      <Box
        sx={{
          ...CardStyles.statusDot,
          bgcolor: statusColor,
          boxShadow: `0 0 6px ${statusColor}`,
          ...(ride.status === "upcoming" && CardStyles.pulseAnimation),
        }}
      />

      {/* Card */}
      <Card sx={CardStyles.card}>
        <CardContent sx={CardStyles.cardContent}>
          {/* Car Image */}
          <Box component="img" src={car} alt="Car" sx={CardStyles.carImage} />

          {/* Ride Details */}
          <Box sx={CardStyles.rideDetails}>
            <Typography variant="h6" sx={CardStyles.title}>
              {handleLocationField(ride.fromLocation)} to{" "}
              {handleLocationField(ride.toLocation)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ ...CardStyles.dateTime, color: statusColor }}
            >
              {rideDate} | {rideTime}
            </Typography>
            <Typography variant="body2" sx={CardStyles.details}>
              Price: <strong>${ride.price}</strong> |{" "}
              {user.type === "customer" ? "Booked:" : "Total:"}{" "}
              <strong>
                {user.type === "customer" ? ride.bookedSeats : ride.totalSeats}
              </strong>
            </Typography>
            {user.type === "provider" && (
              <Typography variant="body2" sx={CardStyles.details}>
                Available:{" "}
                <strong>{ride.totalSeats - ride.bookedSeats}</strong>
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={CardStyles.actionButtons}>
            {ride.status === "upcoming" && user.type === "customer" && (
              <MainButton
                variant="contained"
                disabled={cancelled}
                onClick={handleCancel}
                sx={{
                  ...CardStyles.cancelButton,
                  "&:hover": { background: statusColor },
                }}
              >
                Cancel
              </MainButton>
            )}

            {ride.status === "upcoming" && user.type === "provider" && (
              <>
                <IconButton
                  onClick={handleEdit}
                  sx={{ ...CardStyles.iconButton, ...CardStyles.editButton }}
                >
                  <Tooltip title="Edit">
                    <EditIcon fontSize="small" />
                  </Tooltip>
                </IconButton>
                <IconButton
                  onClick={handleDelete}
                  sx={{ ...CardStyles.iconButton, ...CardStyles.deleteButton }}
                >
                  <Tooltip title="Delete">
                    <DeleteIcon fontSize="small" />
                  </Tooltip>
                </IconButton>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Cards;