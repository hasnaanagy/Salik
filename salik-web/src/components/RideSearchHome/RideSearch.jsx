import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRideData } from "../../redux/slices/RideSlice";
import {
  Box,
  Container,
  Grid,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import MapComponent from "../Mapcomponent/Mapcomponent";
import rideImage from "../../../public/images/car.png";
import fuelImage from "../../../public/images/gas-pump.png";
import mechanicImage from "../../../public/images/technician.png";
import { StyledTextField } from "../../custom/StyledTextField";

export function RideSearch() {
  const dispatch = useDispatch();
  const { data: rideData, loading, error } = useSelector((state) => state.ride);

  const [formData, setFormData] = useState({
    pickup: "",
    dropoff: "",
    date: new Date().toISOString().split("T")[0],
    time: "Now",
  });

  const [pickupCoords, setPickupCoords] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (lat, lng, address) => {
    setPickupCoords({ lat, lng });
    setFormData((prev) => ({ ...prev, pickup: address }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchRideData(formData));
  };

  return (
    <Container sx={{ mt: 5, pb: 5, mb: 4 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={10} md={5}>
          <Typography variant="h4" fontWeight="bold" mb={3} textAlign="left">
            Go Anywhere With SALIK
          </Typography>

          {/* Service Icons */}
          <Box display="flex" gap={3} mb={4}>
            <IconButton
              component={Link}
              to="/"
              sx={{ backgroundColor: "#F3F3F3", p: 2, borderRadius: "12px" }}
            >
              <img src={rideImage} alt="Ride Icon" width={50} height={50} />
            </IconButton>
            <IconButton
              component={Link}
              to="/addService"
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
          <form onSubmit={handleSubmit}>
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
                width: "50%",
                mt: 3,
                fontWeight: "bold",
                color: "black",
                borderRadius: "12px",
                py: 1.5,
              }}
            >
              Search
            </Button>
          </form>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {rideData && (
            <Box
              mt={3}
              p={2}
              sx={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
            >
              <Typography variant="h6" fontWeight="bold">
                Ride Available
              </Typography>
              <pre>{JSON.stringify(rideData, null, 2)}</pre>
            </Box>
          )}
        </Grid>

        <Grid
          item
          xs={10}
          md={6}
          sx={{ height: "400px", ml: { xs: 0, md: 10 } }}
        >
          <MapComponent
            onLocationSelect={handleLocationSelect}
            pickupCoords={pickupCoords}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
