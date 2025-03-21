import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  keyframes,
} from "@mui/material";
import {
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";
import { NavLink } from "react-router-dom";

// Animation keyframes
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleHover = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.2); }
`;
const colorShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: "transparent",
        color: "#333",
        py: 4, // Increased padding for better spacing
        mt: "auto", // Push footer to bottom
        width: "100%",
        position: "relative",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.1)", // Subtle shadow at top
        backdropFilter: "blur(10px)",
        backgroundSize: "200% 200%",
        animation: `${colorShift} 10s ease infinite`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        py: 1,
        "&::before": {
          content: '""',
          display: "block",
          height: "50px", // Space above footer
          background: "transparent",
          position: "absolute",
          top: "-50px",
          left: 0,
          right: 0,
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{
            animation: `${fadeInUp} 0.8s ease-out`,
          }}
        >
          {/* Services Section */}
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ mb: 2, fontSize: { xs: "18px", md: "20px" } }}
            >
              Our Services
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
              {["Ride", "Fuel Delivery", "Mechanic"].map((item) => (
                <Typography
                  key={item}
                  component="li"
                  sx={{
                    fontSize: "16px",
                    mb: 1,
                    "&:hover": { color: "#000", textDecoration: "underline" },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Support Section */}
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ mb: 2, fontSize: { xs: "18px", md: "20px" } }}
            >
              User Support
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
              {["FAQs", "Help Center", "Terms & Conditions"].map((item) => (
                <Typography
                  key={item}
                  component="li"
                  sx={{
                    fontSize: "16px",
                    mb: 1,
                    "&:hover": { color: "#000", textDecoration: "underline" },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Find Us Section */}
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ mb: 2, fontSize: { xs: "18px", md: "20px" } }}
            >
              Find Us
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
              {["About Us", "Contact Us"].map((item) => (
                <Typography
                  key={item}
                  component="li"
                  sx={{
                    fontSize: "16px",
                    mb: 1,
                    "&:hover": { color: "#000", textDecoration: "underline" },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Social Media Icons */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: <FaFacebookF />, link: "/" },
            { icon: <FaXTwitter />, link: "/" },
            { icon: <FaYoutube />, link: "/" },
            { icon: <FaLinkedinIn />, link: "/" },
            { icon: <FaInstagram />, link: "/" },
          ].map((social, index) => (
            <IconButton
              key={index}
              component={NavLink}
              to={social.link}
              color="inherit"
              sx={{
                color: "#333",
                fontSize: "24px",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#000",
                  animation: `${scaleHover} 0.3s ease forwards`,
                },
              }}
            >
              {social.icon}
            </IconButton>
          ))}
        </Box>

        {/* App Store & Google Play */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
            alt="Google Play"
            width={150}
            height={50}
            style={{
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              borderRadius: "8px",
            }}
          />
          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="App Store"
            width={150}
            height={50}
            style={{
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              borderRadius: "8px",
            }}
          />
        </Box>

        {/* Copyright */}
        <Typography
          variant="body2"
          sx={{
            mt: 3,
            textAlign: "center",
            fontSize: "14px",
            color: "#555",
          }}
        >
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
