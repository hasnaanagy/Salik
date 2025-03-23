import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { styled } from "@mui/system";
import { Link, NavLink } from "react-router-dom";

// Styled component for the highlighted text
const HighlightedText = styled("span")({
  backgroundColor: "#ffb800", // Yellow highlight color
  padding: "0 4px",
  borderRadius: "4px",
  display: "inline-block", // Forces the highlighted text to a new line
  marginTop: "8px", // Adds spacing between the lines
  width: "fit-content", // Makes the text container fit the content width
});

// Styled component for the link
const StyledLink = styled(NavLink)({
  color: "#000",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  position: "relative",
  zIndex: 1,
  gap: "8px",
  "&:hover": {
    textDecoration: "underline",
  },
});

const impactData = [
  {
    value: "21",
    label: "countries",
    backgroundColor: "#FFEBEE", // Pink background
    position: "top-left",
  },
  {
    value: "7",
    label: "projects",
    backgroundColor: "#FFEBEE", // Pink background
    position: "bottom-left",
  },
  {
    value: "8",
    label: "international awards",
    backgroundColor: "#E0F7FA", // Light blue background
    position: "right",
  },
];

const ImpactSection = () => {
  return (
    <Box
      sx={{
        padding: { xs: "40px 20px", md: "60px 40px" },
        textAlign: "center",
        position: "relative",
        marginTop: "200px",
      }}
    >
      {/* Section Heading */}
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
        Social impact: making<br></br>
        <HighlightedText>a difference</HighlightedText>
      </Typography>

      {/* Subheading */}
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: "16px", md: "20px" },
          color: "#333",
          mb: 3,
          maxWidth: 400,
          mx: "auto",
        }}
      >
        To maximize our positive impact, we created a hub called InVision
      </Typography>

      {/* Learn More Link */}
      <StyledLink to="/" end>
        Learn more about InVision
        <Box
          component="span"
          sx={{
            display: "inline-block",
            width: 16,
            height: 16,
            border: "2px solid #000",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          }}
        >
          →
        </Box>
      </StyledLink>

      {/* Impact Cards */}
      <Grid
        container
        spacing={5}
        sx={{ position: "relative", marginTop: "-200px" }}
      >
        {/* Left Side: Pink Cards (stacked vertically) */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              maxWidth: 300,
            }}
          >
            {impactData
              .filter((item) => item.position.includes("left"))
              .map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    backgroundColor: item.backgroundColor,
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    p: 2,
                    textAlign: "center",
                    transform: index === 0 ? "rotate(-5deg)" : "rotate(5deg)", // Slight rotation for visual effect
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: "36px", md: "48px" },
                        fontWeight: "bold",
                        color: "#000",
                        mb: 1,
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: "14px", md: "16px" },
                        color: "#666",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
          </Box>
        </Grid>

        {/* Right Side: Blue Card */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {impactData
            .filter((item) => item.position === "right")
            .map((item, index) => (
              <Card
                key={index}
                sx={{
                  backgroundColor: item.backgroundColor,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  p: 2,
                  textAlign: "center",
                  maxWidth: 300,
                  height: 200,
                  transform: "rotate(-3deg)", // Slight rotation for visual effect
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: "36px", md: "48px" },
                      fontWeight: "bold",
                      color: "#000",
                      mb: 1,
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "14px", md: "16px" },
                      color: "#666",
                    }}
                  >
                    {item.label}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImpactSection;
