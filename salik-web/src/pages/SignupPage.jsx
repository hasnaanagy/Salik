import React from "react";
import { Grid, Box, Typography, Container } from "@mui/material";
import SignUp from "../components/signup";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} sx={{ minHeight: "100vh" }}>
      
        {/* Left Side (Image) */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              backgroundImage: "url(/images/signPhoto.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              height: "50%",
              marginTop: "20%",
              marginRight: "15%",
            }}
          />
        </Grid>

        {/* Right Side (Form) */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: "100vh",
              padding: "0 20px",
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{
                marginBottom: 3,
                textAlign: "center",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1, 
              }}
            >
              <img
                src="/images/logo.png"
                alt="Brand Logo"
                style={{ width: "40px", height: "40px" }}
              />
              ALIK
            </Typography>
            <Typography variant="h5" component="h4" sx={{ textAlign: "center", fontWeight: "bold" }}>
              Create Account
            </Typography>
            <Typography sx={{ marginBottom: 3, textAlign: "center" }}>
              We suggest using your default email address.
            </Typography>

            <SignUp />

            <Typography sx={{ textAlign: "center", marginTop: 2 }}>
              Already have an account?{" "}
              <a href="#" onClick={goToLogin} style={{ color: "#ffb800"}}>
                Log in
              </a>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
