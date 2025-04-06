import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PublicIcon from "@mui/icons-material/Public";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

// Styled component for the highlighted text
const HighlightedText = styled("span")({
  backgroundColor: "#ffb800", // Yellow highlight color
  padding: "4px 12px",
  borderRadius: "4px",
  display: "inline-block", // Forces the highlighted text to a new line
  marginTop: "8px", // Adds spacing between the lines
  width: "fit-content", // Makes the text container fit the content width
  fontWeight: "bold",
  boxShadow: "0 2px 8px rgba(255, 184, 0, 0.3)",
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
  padding: "8px 16px",
  borderRadius: "30px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 184, 0, 0.1)",
    transform: "translateY(-2px)",
  },
});

// Styled component for the arrow icon
const ArrowIcon = styled(Box)({
  display: "inline-flex",
  width: 24,
  height: 24,
  borderRadius: "50%",
  backgroundColor: "#ffb800",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "bold",
  transition: "transform 0.3s ease",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  "& svg": {
    fontSize: "16px",
  },
});

const impactData = [
  {
    value: "21",
    label: "countries",
    backgroundColor: "#FFF8E1", // Warm yellow background
    position: "top-left",
    icon: <PublicIcon fontSize="large" />,
    description: "Serving communities across the globe",
  },
  {
    value: "7",
    label: "projects",
    backgroundColor: "#E8F5E9", // Light green background
    position: "bottom-left",
    icon: <LightbulbIcon fontSize="large" />,
    description: "Innovative initiatives for positive change",
  },
  {
    value: "8",
    label: "international awards",
    backgroundColor: "#E3F2FD", // Light blue background
    position: "right",
    icon: <EmojiEventsIcon fontSize="large" />,
    description: "Recognized for excellence and impact",
  },
];

const ImpactSection = () => {
  return (
    <Box
      sx={{
        padding: { xs: "80px 20px", md: "120px 40px" },
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        marginTop: "60px",
        marginBottom: "60px",
      }}
    >
      {/* Background elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,184,0,0.1) 0%, rgba(255,184,0,0) 70%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,184,0,0.1) 0%, rgba(255,184,0,0) 70%)",
        }}
      />

      <Container maxWidth="lg">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: "center", mb: 8 }}>
            {/* Section Heading */}
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "32px", sm: "42px", md: "52px" },
                fontWeight: "bold",
                color: "#000",
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Social impact: making
              <br />
              <span className="highlight" style={{ color: "black" }}>
                a difference
              </span>
            </Typography>

            {/* Subheading */}
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "16px", md: "20px" },
                color: "#555",
                mb: 4,
                maxWidth: 500,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              To maximize our positive impact, we created a hub called InVision
              that drives meaningful change in communities we serve
            </Typography>

            {/* Learn More Link */}
            <StyledLink to="/" end>
              Learn more about InVision
              <ArrowIcon>→</ArrowIcon>
            </StyledLink>
          </Box>
        </motion.div>

        {/* Impact Cards */}
        <Grid container spacing={5} justifyContent="center">
          {impactData.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
              >
                <Card
                  sx={{
                    backgroundColor: item.backgroundColor,
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    overflow: "visible",
                    position: "relative",
                    width: 280,
                    height: 280,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    transform: `rotate(${index % 2 === 0 ? -3 : 3}deg)`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: -20,
                      right: -20,
                      backgroundColor: "#ffb800",
                      borderRadius: "50%",
                      width: 50,
                      height: 50,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      boxShadow: "0 4px 12px rgba(255,184,0,0.3)",
                    }}
                  >
                    {item.icon}
                  </Box>

                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: "48px", md: "64px" },
                        fontWeight: "800",
                        color: "#000",
                        mb: 1,
                        lineHeight: 1,
                      }}
                    >
                      {item.value}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: "18px", md: "20px" },
                        fontWeight: "600",
                        color: "#333",
                        mb: 2,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      {item.label}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "14px",
                        color: "#666",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ImpactSection;
