import React from "react";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { Avatar } from "@mui/material";
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import Box from "@mui/joy/Box";
import { Alert } from "@mui/joy";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CircularProgress from "@mui/material/CircularProgress";

// Function to format the date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Function to get icon based on vehicle type
const getVehicleIcon = (vehicleType) => {
  return vehicleType === "car" ? "/images/car.png" : "/public/images/car.png";
};

export function RideResults({ loading, error, rideData, selectedRide }) {
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <CircularProgress />
      </Box>
    );
  if (error) {
    const errorMessage = error.includes("Network Error")
      ? "Connection failed! Please check your internet."
      : error.includes("400")
      ? "Server error! Please try again later."
      : "Please Set your From and To Location! and select date.";

    return (
      <Alert
        variant="soft"
        color="danger"
        sx={{ mb: 2, fontWeight: "bold", padding: "30px" }}
        startDecorator={<ErrorOutlineIcon />}
      >
        {errorMessage}
      </Alert>
    );
  }
  // Group rides by date
  const groupedRides = rideData
    ? rideData.rides.reduce((acc, ride) => {
        const rideDate = formatDate(ride.rideDateTime);
        if (!acc[rideDate]) acc[rideDate] = [];
        acc[rideDate].push(ride);
        return acc;
      }, {})
    : {};

  return (
    <>
      <Typography
        level="h2"
        sx={{
          mb: 2,
          fontWeight: "bold",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        Available Rides
      </Typography>
      <Box sx={{ p: 2 }}>
        {Object.entries(groupedRides).map(([date, rides]) => (
          <div key={date}>
            <Typography level="title-lg" sx={{ mb: 1, fontWeight: "bold" }}>
              {date}
            </Typography>

            {rides
              // .filter((ride) => ride.totalSeats - ride.bookedSeats > 0)
              .map((ride) => (
                <Stack
                  key={ride._id}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  {/* Circular Time Indicator */}

                  <Typography
                    level="body-sm"
                    sx={{
                      minWidth: 80,
                      textShadow: "0px 5px 10px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: "gold",
                        borderRadius: "50%",
                        display: "inline-block",
                        boxShadow: "0px 4px 7px rgba(0, 0, 0, 0.4)",
                        mr: 1,
                        mt: 0.5,
                      }}
                    />
                    {ride.rideDateTime.split("T")[1].slice(0, 5)}
                  </Typography>

                  <Link
                    sx={{ textDecoration: "none" }}
                    onClick={() => selectedRide && selectedRide(ride)}
                  >
                    <Card
                      variant="outlined"
                      orientation="horizontal"
                      sx={{
                        width: 320,
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
                        borderColor: "white",
                        "&:hover": {
                          boxShadow: "md",
                          borderColor: "#FFB800",
                        },
                      }}
                    >
                      <Avatar
                        src={getVehicleIcon(ride.vehicleType)}
                        sx={{ width: 50, height: 50, mt: 1, ml: 1 }}
                      />

                      <CardContent>
                        <Typography level="title-lg">
                          {ride.providerId.fullName.replace(
                            /\b\w/g,
                            (char) => ` ${char.toUpperCase()}`
                          )}
                        </Typography>

                        <Typography level="body-sm" sx={{ mt: 1 }}>
                          Price: {ride.price}$ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          Seats: {ride.totalSeats - ride.bookedSeats}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Stack>
              ))}
            <Divider sx={{ my: 4 }} />
          </div>
        ))}
      </Box>
    </>
  );
}
