import React from "react";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { Avatar, Box, Stack, keyframes } from "@mui/material";
import Divider from "@mui/joy/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert } from "@mui/joy";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getVehicleIcon = (vehicleType) => {
  return vehicleType === "car" ? "/images/car.png" : "/public/images/car.png";
};

export function RideResults({ loading, error, rideData, selectedRide }) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress size={40} sx={{ color: "#FFB800" }} />
      </Box>
    );
  }

  if (error) {
    const errorMessage = error.includes("Network Error")
      ? "Connection failed! Please check your internet."
      : error.includes("400")
      ? "Server error! Please try again later."
      : "Please set your From and To Location and select a date.";

    return (
      <Alert
        variant="soft"
        color="danger"
        sx={{
          mb: 2,
          fontWeight: "600",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        startDecorator={<ErrorOutlineIcon sx={{ color: "#d32f2f" }} />}
      >
        {errorMessage}
      </Alert>
    );
  }

  const groupedRides = rideData
    ? rideData.rides.reduce((acc, ride) => {
        const rideDate = formatDate(ride.rideDateTime);
        if (!acc[rideDate]) acc[rideDate] = [];
        acc[rideDate].push(ride);
        return acc;
      }, {})
    : {};

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 1, md: 0 } }}>
      <Typography
        level="h2"
        sx={{
          mb: 3,
          fontWeight: "700",
          textAlign: { xs: "center", md: "left" },
          fontSize: { xs: "24px", sm: "28px", md: "32px" },
          color: "#333",
        }}
      >
        Available Rides
      </Typography>

      {Object.entries(groupedRides).map(([date, rides]) => (
        <Box key={date} sx={{ mb: 4 }}>
          <Typography
            level="title-lg"
            sx={{
              mb: 2,
              fontWeight: "600",
              fontSize: { xs: "18px", md: "20px" },
              color: "#444",
            }}
          >
            {date}
          </Typography>

          {rides
            .filter((ride) => ride.totalSeats - ride.bookedSeats > 0)
            .map((ride, index) => (
              <Stack
                key={ride._id}
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                  mb: 2,
                  animation: `${fadeInUp} 0.5s ease-out forwards`,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", minWidth: { xs: 70, md: 90 } }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      backgroundColor: "#FFB800",
                      borderRadius: "50%",
                      boxShadow: "0 2px 6px rgba(15, 15, 15, 0.5)",
                      mr: 1,
                      animation: `${pulse} 2s infinite`,
                    }}
                  />
                  <Typography
                    level="body-sm"
                    sx={{ fontSize: { xs: "14px", md: "16px" }, fontWeight: "500", color: "#555" }}
                  >
                    {new Date(ride.rideDateTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </Typography>
                </Box>

                <Card
                  variant="outlined"
                  sx={{
                    width: { xs: 280, sm: 320, md: 360 },
                    borderRadius: "16px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    border: "1px solid #e0e0e0",
                    bgcolor: "#fff",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      borderColor: "#FFB800",
                      transform: "scale(1.03)",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => selectedRide && selectedRide(ride)}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      src={getVehicleIcon(ride.vehicleType)}
                      sx={{
                        width: { xs: 50, md: 60 },
                        height: { xs: 50, md: 60 },
                        mt: 1.5,
                        ml: 1.5,
                        border: "2px solid #fff",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography
                        level="title-md"
                        sx={{ fontSize: { xs: "16px", md: "18px" }, fontWeight: "600", color: "#333" }}
                      >
                        {ride.providerId?.fullName
                          ?.toLowerCase()
                          .replace(/\b\w/g, (char) => char.toUpperCase()) || "Unknown Provider"}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Typography
                          level="body-sm"
                          sx={{ fontSize: { xs: "14px", md: "15px" }, color: "#666" }}
                        >
                          Price: <strong>${ride.price}</strong>
                        </Typography>
                        <Typography
                          level="body-sm"
                          sx={{ fontSize: { xs: "14px", md: "15px" }, color: "#666" }}
                        >
                          Seats: <strong>{ride.totalSeats - ride.bookedSeats}</strong>
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Stack>
                </Card>
              </Stack>
            ))}
          <Divider sx={{ my: 3, borderColor: "#ddd" }} />
        </Box>
      ))}
    </Box>
  );
}