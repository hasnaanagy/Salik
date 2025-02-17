import React, { useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postRideData } from "../redux/slices/addServiceSlice";
import MapComponent from "./Mapcomponent/Mapcomponent";

const schema = yup.object().shape({
  pickup: yup.string().required("Pickup location is required"),
  dropoff: yup.string().required("Dropoff location is required"),
  carType: yup.string().required("Car type is required"),
  seats: yup
    .number()
    .typeError("Seats must be a number")
    .min(1, "Seats must be at least 1")
    .max(28, "Seats cannot exceed 28")
    .required("Seats are required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be negative")
    .required("Price is required"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
});

const AddTripForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.addService);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [pickupCoords, setPickupCoords] = useState(null);

  // Function to update the pickup location when a location is selected on the map
  const handleLocationSelect = (lat, lng, address) => {
    setPickupCoords({ lat, lng });
    setValue("pickup", address);
  };

  // Function to search an address manually
  const handleAddressSearch = async (address) => {
    try {
      const response = await fetch(
        `        https://nominatim.openstreetmap.org/search?format=json&q=${address}
`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setPickupCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
      }
    } catch (error) {
      console.error("Error fetching address coordinates:", error);
    }
  };

  const onSubmit = (data) => {
    dispatch(postRideData(data));
  };

  return (
    <Container maxWidth="lg" style={{ padding: "50px", marginBottom: "50px" }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Go Anywhere With <span style={{ color: "#FFC107" }}>SALIK</span>
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="pickup"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Pickup location"
                  fullWidth
                  margin="normal"
                  error={!!errors.pickup}
                  helperText={errors.pickup?.message}
                  onBlur={() => handleAddressSearch(field.value)} // Convert to coordinates when user types
                />
              )}
            />
            <Controller
              name="dropoff"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Dropoff location"
                  fullWidth
                  margin="normal"
                  error={!!errors.dropoff}
                  helperText={errors.dropoff?.message}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{
                marginTop: "20px",
                backgroundColor: "#ffb800",
                color: "black",
              }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Confirm Pickup"}
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} md={6} style={{ height: "400px" }}>
          <MapComponent
            onLocationSelect={handleLocationSelect}
            pickupCoords={pickupCoords}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddTripForm;
