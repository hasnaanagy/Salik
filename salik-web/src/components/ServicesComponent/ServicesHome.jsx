import { Box, Grid, Typography, Snackbar, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/slices/authSlice";

export default function ServicesHome() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(false);
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("useEffect triggered: token =", token, "loading =", loading, "user =", user);
    if (token && !user && !loading) {
      console.log("Dispatching getUser...");
      dispatch(getUser());
    }
  }, [dispatch, token, user, loading]);

  const handleProtectedNavigation = (e, path) => {
    if (!token) {
      setSuccessMessage(true);
      e.preventDefault();
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  };

  const handleRideClick = (e) => {
    e.preventDefault();
    if (!token) {
      handleProtectedNavigation(e, "/login");
      return;
    }

    if (user?.type === "provider") {
      const hasDocuments = user?.nationalIdImage && user?.licenseImage;
      const areVerified = user?.nationalIdStatus === "verified" && user?.licenseStatus === "verified";

      if (!hasDocuments || !areVerified) {
        navigate("/licence");
      } else {
        navigate("/addTrip");
      }
    } else {
      navigate("/addTrip");
    }};
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        marginTop: "70px",
        px: 2,
        mb: 5,
        backgroundColor: "#fff",
        borderRadius: "20px",
      }}
    >
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
        <Grid item xs={12} sm={6} md={4} sx={{ marginBottom: "70px" }}>
          <Link
            to="#"
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={handleRideClick}
          >
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                padding: "20px 50px",
                borderRadius: "12px",
                position: "relative",
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <h2 style={{ fontSize: "30px" }}>Ride</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <p style={{ fontSize: "20px", color: "#4F4F4F" }}>
                  Share and request rides now!
                </p>
                <img
                  src="/images/car.png"
                  alt="Ride"
                  width={100}
                  height={100}
                  style={{ position: "absolute", right: "20px", top: "15px" }}
                />
              </div>
            </Box>
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={4} sx={{ marginBottom: "70px" }}>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to={token ? "/addService" : "#"}
            onClick={(e) => handleProtectedNavigation(e, "/addService")}
          >
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                padding: "20px 50px",
                borderRadius: "12px",
                position: "relative",
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <h2 style={{ fontSize: "30px" }}>Fuel Delivery</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <p style={{ fontSize: "20px", color: "4F4F4F" }}>
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
          </Link>
        </Grid>

        <Grid item xs={12} md={4} sx={{ marginBottom: "70px" }}>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to={token ? "/addService" : "#"}
            onClick={(e) => handleProtectedNavigation(e, "/addService")}
          >
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                padding: "20px 50px",
                borderRadius: "12px",
                position: "relative",
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <h2 style={{ fontSize: "30px" }}>Mechanic</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <p style={{ fontSize: "20px", color: "#4F4F4F" }}>
                  Send and get help anywhere!
                </p>
                <img
                  src="/images/technician.png"
                  alt="Mechanic"
                  width={100}
                  height={100}
                  style={{ position: "absolute", right: "10px", top: "15px" }}
                />
              </div>
            </Box>
          </Link>
        </Grid>
      </Grid>

      <Snackbar
        open={successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          🚀 Hold on! You need to log in first. Go ahead, log in, and come back! 😉
        </Alert>
      </Snackbar>
    </Box>
  );
}