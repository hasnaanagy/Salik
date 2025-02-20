import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Input } from "@mui/joy";
import { Avatar, Box, Stack } from "@mui/material";
import Badge, { badgeClasses } from "@mui/joy/Badge";

import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";
export default function RidePersonDetais({ ride }) {
  if (!ride) {
    return <Typography color="error"></Typography>;
  }

  const [passengerCount, setPassengerCount] = useState(1);

  return (
    <>
      <Typography
        level="h2"
        sx={{
          fontWeight: "bold",
          mb: 2,
          textAlign: { xs: "center", md: "left" },
        }}
      >
        Confirm Details
      </Typography>
      <div>
        <Link state={{ providerId: ride.providerId }} to={"/reviews"}>
          <Card
            sx={{ width: "100%", p: 2, borderRadius: "12px", boxShadow: 3 }}
          >
            {/* Driver Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                border: "1px solid #ddd",
                borderRadius: "8px",
                p: 1.5,
                mt: 2,
              }}
            >
              <Badge
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeInset="14%"
                color="success"
                sx={{
                  [`& .${badgeClasses.badge}`]: {
                    "&::after": {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      animation: "ripple 1.2s infinite ease-in-out",
                      border: "2px solid",
                      borderColor: "success.500",
                      content: '""',
                    },
                  },
                  "@keyframes ripple": {
                    "0%": {
                      transform: "scale(1)",
                      opacity: 1,
                    },
                    "100%": {
                      transform: "scale(2)",
                      opacity: 0,
                    },
                  },
                }}
              >
                <Avatar
                  alt="Remy Sharp"
                  src={ride?.providerId?.profileImg || ""}
                  sx={{ width: 50, height: 50 }}
                />
              </Badge>

              <Typography level="title-md">
                {ride?.providerId?.fullName
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase()) ||
                  "Unknown Driver"}
              </Typography>

              <Stack
                direction="row"
                justifyContent="center"
                spacing={0.5}
                ml={4}
                mt={5}
              >
                {[...Array(5)].map((_, index) => (
                  <StarIcon key={index} sx={{ color: "gold" }} />
                ))}
              </Stack>
              <NavigateNextIcon sx={{ marginLeft: "auto", fontSize: "30px" }} />
            </Box>

            {/* Star Rating */}

            {/* Shuttle Section */}
            <Typography level="body-sm" sx={{ mt: 2, fontWeight: "bold" }}>
              Car Type: {ride?.carType}
            </Typography>

            {/* Passenger Count & Price */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mt: 1 }}
            >
              <PersonIcon />
              <Input
                type="number"
                value={passengerCount}
                onChange={(e) => setPassengerCount(e.target.value)}
                sx={{ width: 80 }}
              />
              <Box sx={{ flexGrow: 1 }} />
              <Typography>EGP: {ride?.price?.toFixed(2) || "N/A"}$</Typography>
            </Stack>

            {/* Date & Time */}
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 1 }}
            >
              <Typography>Date: {ride?.rideDateTime?.split("T")[0]}</Typography>
              <Typography>
                Time: {ride?.rideDateTime?.split("T")[1].slice(0, 5)}
              </Typography>
            </Stack>

            {/* Buttons */}
            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
              <Button
                sx={{
                  bgcolor: "#ffb800",
                  color: "black",
                  width: "45%",
                  fontWeight: "bold",
                }}
              >
                Booking
              </Button>
              <Button
                sx={{
                  bgcolor: "#FFB800",
                  color: "black",
                  width: "45%",
                  fontWeight: "bold",
                }}
              >
                Call
              </Button>
            </Stack>
          </Card>
        </Link>
      </div>
    </>
  );
}
