import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Login from "../components/LoginComponents/LoginLayout";

export default function LoginPage() {
  const navigate = useNavigate();

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <Box sx={{ 
      width: '100%',
      height: '100vh', 
      overflow: 'hidden',
      background: 'white'
    }}
    className="login-page-container"
    >
      <Grid container sx={{ height: '100%' }}>
        {/* Left Side with Car Illustration */}
        <Grid item xs={12} md={6} sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          bgcolor: '#f5f5f5',
          position: 'relative'
        }}>
          <Box
            sx={{
              width: '90%',
              maxWidth: '500px',
              height: '400px',
              backgroundImage: "url(/images/taxi-illustration.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              zIndex: 2
            }}
          />
        </Grid>

        {/* Right Side with Login Form */}
        <Grid item xs={12} md={6} sx={{ 
          height: '100%', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, md: 8 }
        }}>
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <img
                  src="/images/salik-logo.png"
                  alt="Salik Logo"
                  style={{ height: '36px', marginRight: '8px' }}
                />
                ALIK
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="h4"
              component="h2"
              sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: '2rem' 
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              sx={{ 
                mb: 4, 
                color: 'text.secondary',
                fontSize: '1rem' 
              }}
            >
              Enter your credentials to access your account.
            </Typography>

            {/* Login Form */}
            <Login />

            {/* Sign Up Link */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography sx={{ 
                color: 'text.secondary',
                fontSize: '0.9rem'
              }}>
                Don't have an account?{" "}
                <span 
                  onClick={goToSignup} 
                  style={{ 
                    color: "#ffb800", 
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Sign up
                </span>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
