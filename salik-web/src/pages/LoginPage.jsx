import React from "react";
import { Grid, Box, Typography, Container } from "@mui/material";
import Login from "../components/login";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} sx={{ minHeight: "100vh" }}>
        {/* Left Side Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              backgroundImage: "url(images/signPhoto.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              height: "50%",
              marginTop: "23%",
              marginRight: "15%",
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: "100vh",
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
                style={{
                  width: "40px",
                  height: "40px",
                }}
              />
              ALIK
            </Typography>

            <Typography
              variant="h5"
              component="h4"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Welcome Back
            </Typography>
            <Typography sx={{ marginBottom: 3, textAlign: "center" }}>
              Enter your credentials to access your account.
            </Typography>

            {/* Login Form */}
            <Login />

            {/* Sign Up Link */}
            <Typography sx={{ textAlign: "center", marginTop: 2 }}>
              Don't have an account?{" "}
              <a href="#" onClick={goToSignup} style={{ color: "#ffb800" }}>
                Sign up
              </a>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
