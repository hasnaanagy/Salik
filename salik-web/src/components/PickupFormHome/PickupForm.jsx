import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Grid,
  Button,
  Typography,
  IconButton,
  styled,
} from "@mui/material";
import { Link } from "react-router-dom";
import MapComponent from "../Mapcomponent/Mapcomponent";
import rideImage from "../../../public/images/car.png";
import fuelImage from "../../../public/images/gas-pump.png";
import mechanicImage from "../../../public/images/technician.png";
import { StyledTextField } from "../../custom/StyledTextField";
export function PickupForm() {
  const [formData, setFormData] = useState({
    pickup: "",
    dropoff: "",
    date: new Date().toISOString().split("T")[0],
    time: "Now",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://your-backend-api.com/pickup",
        formData
      );
      console.log("Response:", response.data);
      alert("Pickup confirmed!");
    } catch (error) {
      console.error("Error submitting pickup:", error);
      alert("Failed to confirm pickup.");
    }
  };

  return (
    <Container sx={{ mt: 5, pb: 5, mb: 4 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Form Section */}
        <Grid item xs={10} md={5}>
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            textAlign={{ xs: "center", md: "left" }}
          >
            Go Anywhere With SALIK
          </Typography>

          {/* Service Icons */}
          <Box
            display="flex"
            justifyContent={{ xs: "center", md: "start" }}
            gap={3}
            mb={4}
          >
            <IconButton
              component={Link}
              to="/mechanic"
              sx={{ backgroundColor: "#F3F3F3", p: 2, borderRadius: "12px" }}
            >
              <img src={rideImage} alt="Ride Icon" width={50} height={50} />
            </IconButton>
            <IconButton
              component={Link}
              to="/fuel"
              sx={{ backgroundColor: "#F3F3F3", p: 2, borderRadius: "12px" }}
            >
              <img src={fuelImage} alt="Fuel Icon" width={50} height={50} />
            </IconButton>
            <IconButton
              component={Link}
              to="/mechanic"
              sx={{ backgroundColor: "#F3F3F3", p: 2, borderRadius: "12px" }}
            >
              <img
                src={mechanicImage}
                alt="Mechanic Icon"
                width={50}
                height={50}
              />
            </IconButton>
          </Box>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
            <StyledTextField
              name="pickup"
              placeholder="Pickup Location"
              value={formData.pickup}
              onChange={handleChange}
              required
              sx={{ mr: 2 }}
            />
            <StyledTextField
              name="dropoff"
              placeholder="Dropoff Location"
              value={formData.dropoff}
              onChange={handleChange}
              required
            />
            <Grid container spacing={10}>
              <Grid item xs={6}>
                <StyledTextField
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledTextField
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#ffb800",
                width: { xs: "100%", md: "40%" },
                mt: 3,
                fontWeight: "bold",
                color: "black",
                borderRadius: "12px",
                py: 1.5,
              }}
            >
              Confirm Pickup
            </Button>
          </form>
        </Grid>

        {/* Map Section */}
        <Grid
          item
          xs={10}
          md={6}
          sx={{ height: "400px", ml: { xs: 0, md: 10 } }}
        >
          <MapComponent />
        </Grid>
      </Grid>
    </Container>
  );
}
