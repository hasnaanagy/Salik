import { Box, Grid, Typography } from "@mui/material";
import React from "react";

export default function ServicesHome() {
  return (
    <Box sx={{ marginTop: "70px", px: 2, mb: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        textAlign={{ xs: "center", md: "left" }}
        sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" } }}
      >
        Services
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* Ride Box */}
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              backgroundColor: "#D9D9D9",
              padding: "20px 50px",
              borderRadius: "12px",
              position: "relative",
              height: "100%",
            }}
          >
            <h2 style={{ fontSize: "30px" }}>Ride</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <p style={{ fontSize: "20px" }}>Share and request rides now!</p>
              <img
                src="/images/car.png"
                alt="Ride"
                width={100}
                height={100}
                style={{ position: "absolute", right: "20px", top: "15px" }}
              />
            </div>
          </Box>
        </Grid>

        {/* Fuel Delivery Box */}
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              backgroundColor: "#D9D9D9",
              padding: "20px 50px",
              borderRadius: "12px",
              position: "relative",
              height: "100%",
            }}
          >
            <h2 style={{ fontSize: "30px" }}>Fuel Delivery</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <p style={{ fontSize: "20px" }}>
                Bringing you closer, no matter the distance...
              </p>
              <img
                src="/images/gas-pump.png"
                alt="Fuel Delivery"
                width={100}
                height={100}
                style={{ position: "absolute", right: "10px", top: "15px" }}
              />
            </div>
          </Box>
        </Grid>

        {/* Mechanic Box */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              backgroundColor: "#D9D9D9",
              padding: "20px 50px",
              borderRadius: "12px",
              position: "relative",
              height: "100%",
            }}
          >
            <h2 style={{ fontSize: "30px" }}>Mechanic</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <p style={{ fontSize: "20px" }}>Send and get help anywhere!</p>
              <img
                src="/images/technician.png"
                alt="Mechanic"
                width={100}
                height={100}
                style={{ position: "absolute", right: "10px", top: "15px" }}
              />
            </div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
