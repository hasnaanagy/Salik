import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { styled } from "@mui/system";

// Styled component for the highlighted text
const HighlightedText = styled("span")({
  backgroundColor: "#ffb800", // Yellow highlight color
  padding: "0 4px",
  borderRadius: "4px",
});

// Styled component for the circular badge
const CircularBadge = styled(Box)({
  position: "relative",
  width: 120,
  height: 120,
  borderRadius: "50%",
  backgroundColor: "#ffb800",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "bold",
  fontSize: "24px",
  color: "#000",
  marginLeft: "200px",
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    width: 140,
    height: 140,
    border: "2px solid #ffb800",
    borderRadius: "50%",
  },
  "&::before": {
    transform: "rotate(45deg)",
  },
  "&::after": {
    transform: "rotate(-45deg)",
  },
});

// Placeholder image (replace with actual image URL or local asset)
const placeholderImage = "../../../public/images/person.webp";
const logo = "../../../public/images/logo.svg";

const SafetySection = () => {
  return (
    <Box
      sx={{
        padding: { xs: "40px 20px", md: "60px 40px" },
        textAlign: { xs: "center", md: "left" },
        marginTop: "200px",
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Left Side: Image with Green Background */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: { xs: "center", md: "center" },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -20,
                left: { xs: "50%", md: "30%" },
                transform: { xs: "translateX(-50%)", md: "none" },
                width: 300,
                height: 300,
                backgroundColor: "#ffb800", // Green background
                borderRadius: "50%",
                clipPath: "polygon(0 50, 100% 0, 100% 70%, 70% 100%, 0 100%)",
              }}
            />
            <Box
              component="img"
              src={placeholderImage}
              alt="Safety Image"
              sx={{
                width: { xs: 250, md: 350 },
                height: { xs: 250, md: 350 },
                borderRadius: "16px",
                position: "relative",
                zIndex: 1,
              }}
            />
          </Box>
        </Grid>

        {/* Right Side: Text Content */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "28px", sm: "36px", md: "48px" },
              fontWeight: "bold",
              color: "#000",
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            Your safety is <HighlightedText>our priority</HighlightedText>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "16px", md: "20px" },
              color: "#666",
              mb: 3,
            }}
          >
            Stay on the safe side with Salik
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              color: "#333",
              mb: 4,
              maxWidth: 500,
            }}
          >
            We want all of us to be on the same page about safety. And so, we’re
            calling this page our safety pact – a 3-sided alliance between
            passengers, drivers and Salik, with mutual responsibilities for
            every single ride.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "24px",
                padding: "10px 24px",
                textTransform: "none",
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              Learn more
            </Button>
            <CircularBadge>
              <img src={logo} alt="Safety Badge"></img>
            </CircularBadge>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SafetySection;
