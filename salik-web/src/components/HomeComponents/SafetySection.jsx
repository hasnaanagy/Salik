import React from "react";
import { Box, Typography, Button, Grid, Container, Paper } from "@mui/material";
import { styled } from "@mui/system";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ShieldIcon from "@mui/icons-material/Shield";
import { motion } from "framer-motion";

// Styled component for the highlighted text
const HighlightedText = styled("span")({
  backgroundColor: "#ffb800",
  padding: "0 8px",
  borderRadius: "4px",
  fontWeight: "bold",
});

// Styled component for the circular badge
const CircularBadge = styled(Box)({
  position: "relative",
  width: 140,
  height: 140,
  borderRadius: "50%",
  backgroundColor: "#ffb800",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "bold",
  fontSize: "28px",
  color: "#000",
  boxShadow: "0 8px 24px rgba(255, 184, 0, 0.3)",
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    width: 160,
    height: 160,
    border: "2px solid #ffb800",
    borderRadius: "50%",
    opacity: 0.5,
  },
  "&::before": {
    transform: "rotate(45deg)",
    animation: "rotate 15s linear infinite",
  },
  "&::after": {
    transform: "rotate(-45deg)",
    animation: "rotate-reverse 20s linear infinite",
  },
  "@keyframes rotate": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  "@keyframes rotate-reverse": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(-360deg)" },
  },
});

const FeatureItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: "24px",
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(255, 184, 0, 0.1)",
  borderRadius: "50%",
  width: "48px",
  height: "48px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: "16px",
  color: "#ffb800",
}));

// Placeholder image (replace with actual image URL or local asset)
const placeholderImage = "../../../public/images/person.webp";
const logo = "../../../public/images/logo.svg";

const safetyFeatures = [
  {
    icon: <SecurityIcon fontSize="medium" />,
    title: "Real-time GPS Tracking",
    description:
      "Monitor your journey in real-time with our advanced GPS tracking system.",
  },
  {
    icon: <VerifiedUserIcon fontSize="medium" />,
    title: "Verified Drivers",
    description:
      "All our drivers undergo thorough background checks and verification processes.",
  },
  {
    icon: <ShieldIcon fontSize="medium" />,
    title: "24/7 Support Team",
    description:
      "Our dedicated support team is available around the clock to assist you.",
  },
];

const SafetySection = () => {
  return (
    <Box
      sx={{
        padding: { xs: "60px 0", md: "100px 0" },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={30} alignItems="left">
          {/* Left Side: Image with Badge */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -30,
                    left: { xs: "50%", md: "30%" },
                    transform: { xs: "translateX(-50%)", md: "none" },
                    width: 350,
                    height: 350,
                    background:
                      "linear-gradient(135deg, #ffb800 0%, #ffd54f 100%)",
                    borderRadius: "50%",
                    opacity: 0.2,
                    filter: "blur(40px)",
                  }}
                />
                <Box
                  component="img"
                  src={placeholderImage}
                  alt="Safety First"
                  sx={{
                    width: "100%",
                    maxWidth: "500px",
                    borderRadius: "24px",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    right: { xs: "50%", md: "0" },
                    bottom: { xs: "-70px", md: "40px" },
                    transform: { xs: "translateX(50%)", md: "translateX(40%)" },
                  }}
                >
                  <CircularBadge>100% Safe</CircularBadge>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Side: Content */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mt: { xs: 10, md: 0 } }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: "800",
                    mb: 3,
                    lineHeight: 1.3,
                    fontSize: { xs: "32px", sm: "40px", md: "48px" },
                  }}
                >
                  Your Safety is Our{" "}
                  <span className="highlight" style={{ color: "black" }}>
                    Top Priority
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    mb: 4,
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                    maxWidth: "600px",
                  }}
                >
                  We want all of us to be on the same page about safety. Our
                  safety pact is a 3-sided alliance between passengers, drivers
                  and Salik, with mutual responsibilities for every single ride.
                </Typography>
              </motion.div>

              {safetyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FeatureItem>
                    <FeatureIcon>{feature.icon}</FeatureIcon>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 0.5 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </FeatureItem>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 3,
                    backgroundColor: "#ffb800",
                    color: "#000",
                    fontWeight: "bold",
                    padding: "12px 24px",
                    borderRadius: "30px",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(255, 184, 0, 0.4)",
                    "&:hover": {
                      backgroundColor: "#e6a800",
                      boxShadow: "0 6px 20px rgba(255, 184, 0, 0.6)",
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Learn More About Safety
                </Button>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SafetySection;
