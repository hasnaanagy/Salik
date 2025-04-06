import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Collapse,
  Chip,
  Button,
} from "@mui/material";
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
import { IconButton, Tooltip, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteRideAction } from "../redux/slices/RideSlice";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Cards = ({ ride }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [cancelled, setCancelled] = useState(ride.status === "canceled");
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // Handle cancel booking
  const handleCancel = async () => {
    await dispatch(cancelBooking(ride._id));
    setCancelled(true);
    dispatch(fetchBooking());
  };

  // Handle delete ride
  const handleDelete = async () => {
    await dispatch(deleteRideAction(ride._id));
    dispatch(fetchProviderRides());
  };

  // Format ride date and time
  const rideDate = ride?.rideDateTime?.split("T")[0];
  const rideTime = ride?.rideDateTime?.split("T")[1]?.slice(0, 5);

  // Handle location display with show more functionality
  const handleLocationField = (data, isExpanded) => {
    if (!data) return "";
    return isExpanded
      ? data
      : data.length > 13
      ? `${data.slice(0, 13)}...`
      : data;
  };

  // Toggle expanded view
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Define status color
  const statusColor =
    ride.status === "upcoming"
      ? "#FFB800"
      : ride.status === "completed"
      ? "#2E7D32"
      : "#F44336";

  // Status label
  const statusLabel =
    ride.status === "upcoming"
      ? "Upcoming"
      : ride.status === "completed"
      ? "Completed"
      : "Canceled";

  return (
    <Paper
      elevation={3}
      sx={{
        mb: 3,
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        },
        position: "relative",
      }}
    >
      {/* Status indicator */}
      <Box
        sx={{
          height: "6px",
          bgcolor: statusColor,
          width: "100%",
        }}
      />

      <Box p={2}>
        {/* Header with date and status */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 10,
                height: 10,
                bgcolor: statusColor,
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="body2" fontWeight="medium">
              {rideDate} • {rideTime}
            </Typography>
          </Box>

          <Chip
            label={statusLabel}
            size="small"
            sx={{
              bgcolor: `${statusColor}20`,
              color: statusColor,
              fontWeight: "bold",
              fontSize: "0.7rem",
            }}
          />
        </Box>

        {/* Main card content */}
        <Card
          sx={{
            boxShadow: "none",
            bgcolor: "transparent",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box display="flex" alignItems="center">
              <img
                src={car}
                style={{
                  width: 50,
                  marginRight: 16,
                  opacity: ride.status === "canceled" ? 0.5 : 1,
                }}
                alt="Car"
              />

              {/* Ride Details */}
              <Box flexGrow={1}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <LocationOnIcon
                    sx={{ fontSize: 18, color: "#666", mr: 0.5 }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {handleLocationField(ride.fromLocation, expanded)} to{" "}
                    {handleLocationField(ride.toLocation, expanded)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={toggleExpanded}
                    sx={{ ml: 0.5, p: 0.5 }}
                  >
                    {expanded ? (
                      <KeyboardArrowUpIcon fontSize="small" />
                    ) : (
                      <KeyboardArrowDownIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Price: <b>${ride.price}</b> •
                  {user.type === "customer"
                    ? ` Booked Seats: ${ride.bookedSeats}`
                    : ` Total Seats: ${ride.totalSeats}`}
                </Typography>

                {user.type === "provider" && (
                  <Typography variant="body2" color="text.secondary">
                    Available Seats: <b>{ride.totalSeats - ride.bookedSeats}</b>
                  </Typography>
                )}
              </Box>

              {/* Action Buttons */}
              <Box>
                {/* Cancel Button for customers */}
                {ride.status === "upcoming" && user.type === "customer" && (
                  <Button
                    variant="contained"
                    disabled={cancelled}
                    sx={{
                      backgroundColor: "#FFB800",
                      color: "black",
                      fontWeight: "bold",
                      borderRadius: 8,
                      "&:hover": {
                        backgroundColor: "#E69F00",
                      },
                    }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}

                {/* Edit/Delete Buttons for providers */}
                {ride.status === "upcoming" && user.type === "provider" && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      onClick={() =>
                        navigate(`/addTrip`, { state: { rideId: ride._id } })
                      }
                      sx={{
                        color: "#ffb800",
                        transition: "0.3s",
                        "&:hover": {
                          color: "#0D47A1",
                          transform: "scale(1.2)",
                        },
                      }}
                    >
                      <Tooltip title="Edit">
                        <EditIcon />
                      </Tooltip>
                    </IconButton>

                    <IconButton
                      onClick={handleDelete}
                      sx={{
                        color: "#F44336",
                        transition: "0.3s",
                        "&:hover": {
                          color: "#B71C1C",
                          transform: "scale(1.2)",
                        },
                      }}
                    >
                      <Tooltip title="Delete">
                        <DeleteIcon />
                      </Tooltip>
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Expanded details */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box mt={2} p={1.5} bgcolor="rgba(0,0,0,0.02)" borderRadius={1}>
            <Typography variant="body2" fontWeight="medium" mb={1}>
              Full Location Details:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <b>From:</b> {ride.fromLocation}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>To:</b> {ride.toLocation}
            </Typography>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default Cards;
