import React from "react";
import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import {
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";
import { NavLink } from "react-router-dom";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#ffb800",
        color: "black",
        mt: "auto", // Push footer to the bottom
        py: 3, // Padding for better spacing
        textAlign: "center",
      }}
    >
      <Container>
        {/* Services & Support Sections */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold">
              Our Services
            </Typography>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>Ride</li>
              <li>Fuel Delivery</li>
              <li>Mechanic</li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold">
              User Support
            </Typography>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>FAQs</li>
              <li>Help Center</li>
              <li>Terms & Conditions</li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold">
              Find Us
            </Typography>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>About Us</li>
              <li>Contact Us</li>
            </ul>
          </Grid>
        </Grid>

        {/* Social Media Icons */}
        <Box sx={{ mt: 2 }}>
          <IconButton component={NavLink} to="/" color="inherit">
            <FaFacebookF />
          </IconButton>
          <IconButton component={NavLink} to="/" color="inherit">
            <FaXTwitter />
          </IconButton>
          <IconButton component={NavLink} to="/" color="inherit">
            <FaYoutube />
          </IconButton>
          <IconButton component={NavLink} to="/" color="inherit">
            <FaLinkedinIn />
          </IconButton>
          <IconButton component={NavLink} to="/" color="inherit">
            <FaInstagram />
          </IconButton>
        </Box>

        {/* App Store & Google Play */}
        <Box sx={{ mt: 2 }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
            alt="Google Play"
            width="150"
            style={{ margin: "0 10px" }}
          />
          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="App Store"
            width="150"
            style={{ margin: "0 10px" }}
          />
        </Box>
      </Container>
    </Box>
  );
}
