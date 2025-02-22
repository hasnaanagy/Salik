import { Grid, Box, Typography } from "@mui/material";
import React from "react";

export function IntoScreen() {
  const sections = [
    {
      image: "../../../public/images/road 2 (2).jpg",
      title: "Your All-in-One Place",
      description:
        "Car sharing, courier services, and roadside assistance—everything in one place!",
    },
    {
      image:
        "../../../public/images/man-with-map-smartphone-renting-car-driver-using-car-sharing-app-phone-searching-vehicle-vector-illustration-transport-transportation-urban-traf.jpg",
      title: " Car Sharing & Rides",
      description:
        "Ride or Share a Car need a ride? Book one instantly.Own a car?Share it and earn money.",
      reverse: true,
    },
    {
      image: "../../../public/images/maintanance 1 (1).jpg",

      title: "Emergency Help",
      description:
        " Roadside Assistance, Fuel delivery, towing, and mechanic support—whenever you need it.",
    },
    {
      image: "../../../public/images/undraw_welcome_nk8k.png",

      title: "Join Salik!",
      join: "How Do You Want to Join?",
      description:
        "As a Customer – Book rides, send packages, or get roadside help.As a Provider – Offer rides, deliver packages, or provide assistance.",
      reverse: true,
    },
  ];
  return (
    <Box sx={{ py: 5, px: { xs: 2, sm: 4, md: 6 }, mt: "70px" }}>
      {sections.map((section, index) => (
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          sx={{ textAlign: { xs: "center", md: "left" }, mb: { xs: 4, md: 6 } }}
          direction={section.reverse ? "row-reverse" : "row"}
          key={index}
        >
          {/* Image Section */}
          <Grid item xs={12} md={6} sx={{ mt: { xs: 3, md: 5 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <img
                src={section.image}
                alt={`section-${index}`}
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  height: "auto",
                  borderRadius: "12px",
                }}
              />
            </Box>
          </Grid>

          {/* Text Section */}
          <Grid item xs={12} md={6} textAlign={{ xs: "center", md: "left" }}>
            <Box
              sx={{
                px: { xs: 2, sm: 4, md: 5 },
                width: { xs: "100%", md: "80%" },
                mx: "auto",
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "1.6rem", sm: "1.8rem", md: "2.2rem" },
                  mb: 2,
                  textAlign: "center",
                }}
              >
                {section.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  color: "#FFB800",
                  textAlign: "center",
                  mb: 2,
                  fontWeight: "bold",
                }}
              >
                {section.join}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  color: "gray",
                  textAlign: "center",
                }}
              >
                {section.description}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
}
