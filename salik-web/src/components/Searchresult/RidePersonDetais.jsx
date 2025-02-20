import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Input } from "@mui/joy";
import { Avatar, Box, Stack, useMediaQuery } from "@mui/material";
import Badge, { badgeClasses } from "@mui/joy/Badge";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";

export default function RidePersonDetails({ ride }) {
  if (!ride) {
    return <Typography color="error">No ride details available</Typography>;
  }

  const [passengerCount, setPassengerCount] = useState(1);
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <>
      <Typography
        level="h2"
        sx={{
          fontWeight: "bold",
          mb: 2,
          textAlign: { xs: "center", md: "left" },
          fontSize: { xs: "20px", sm: "24px", md: "28px" },
        }}
      >
        Confirm Details
      </Typography>
      <Card sx={{ width: "100%", p: 2, borderRadius: "12px", boxShadow: 3 }}>
        {/* Driver Info */}
        <Link state={{ providerId: ride.providerId }} to={"/reviews"}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: "1px solid #ddd",
              borderRadius: "8px",
              p: 1.5,
              mt: 2,
              flexWrap: "wrap",
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
                alt="Driver"
                src={ride?.providerId?.profileImg || ""}
                sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }}
              />
            </Badge>

            <Typography
              level="title-md"
              sx={{ fontSize: { xs: "16px", sm: "18px" } }}
            >
              {ride?.providerId?.fullName
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase()) ||
                "Unknown Driver"}
            </Typography>

            <NavigateNextIcon
              sx={{ fontSize: isMobile ? "24px" : "30px", ml: "auto" }}
            />

            {/* Star Rating */}
            <Stack
              direction="row"
              justifyContent="center"
              spacing={0.5}
              ml={isMobile ? 0 : 4}
              mt={isMobile ? 1 : 5}
              flexWrap="wrap"
            >
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  sx={{ color: "gold", fontSize: isMobile ? "18px" : "24px" }}
                />
              ))}
            </Stack>
          </Box>
        </Link>

        {/* Car Type */}
        <Typography
          level="body-sm"
          sx={{
            mt: 2,
            fontWeight: "bold",
            fontSize: { xs: "14px", sm: "16px" },
          }}
        >
          Car Type: {ride?.carType}
        </Typography>

        {/* Passenger Count & Price */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mt: 1, flexWrap: "wrap" }}
        >
          <PersonIcon />
          <Input
            type="number"
            value={passengerCount}
            onChange={(e) => setPassengerCount(Number(e.target.value))}
            sx={{ width: 80, fontSize: { xs: "14px", sm: "16px" } }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
            EGP: {ride?.price?.toFixed(2) || "N/A"}$
          </Typography>
        </Stack>

        {/* Date & Time */}
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 1, flexWrap: "wrap" }}
        >
          <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
            Date: {ride?.rideDateTime?.split("T")[0]}
          </Typography>
          <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
            Time: {ride?.rideDateTime?.split("T")[1].slice(0, 5)}
          </Typography>
        </Stack>

        {/* Buttons */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          mt={2}
          flexWrap="wrap"
        >
          <Button
            sx={{
              bgcolor: "#ffb800",
              color: "black",
              width: { xs: "100%", sm: "45%" },
              fontWeight: "bold",
              fontSize: { xs: "14px", sm: "16px" },
            }}
          >
            Booking
          </Button>
          <Button
            sx={{
              bgcolor: "#FFB800",
              color: "black",
              width: { xs: "100%", sm: "45%" },
              fontWeight: "bold",
              fontSize: { xs: "14px", sm: "16px" },
            }}
          >
            Call
          </Button>
        </Stack>
      </Card>
    </>
  );
}
