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
import { postFuelData, clearError } from "../redux/slices/addFeulSlice";
import mapImage from "../../public/images/map.png"; // Make sure this path is correct
import MapComponent from "./Mapcomponent/Mapcomponent";

const schema = yup.object().shape({
  fuelLocation: yup.string().required("Fuel location is required"),
  serviceType: yup.string().required("Service type is required"),
  availableFrom: yup.string().required("Available from time is required"),
  availableTo: yup.string().required("Available to time is required"),
});

const AddFuelForm = () => {
  const dispatch = useDispatch();
  const { loading = false, error = null } = useSelector(
    (state) => state.fuelService || {}
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fuelLocation: "",
      serviceType: "",
      availableFrom: "",
      availableTo: "",
    },
  });
  const [pickupCoords, setPickupCoords] = useState(null);

  // Function to update the pickup location when a location is selected on the map
  const handleLocationSelect = (lat, lng, address) => {
    setPickupCoords({ lat, lng });
    setValue("fuelLocation", address);
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
    dispatch(postFuelData(data));
  };

  return (
    <Container maxWidth="lg" style={{ padding: "50px" }}>
      <Grid container spacing={4} alignItems="center">
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Add Fuel Service
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="fuelLocation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fuel Location"
                  fullWidth
                  margin="normal"
                  error={!!errors.fuelLocation}
                  helperText={errors.fuelLocation?.message}
                  onBlur={() => handleAddressSearch(field.value)} // Convert to coordinates when user types
                />
              )}
            />

            <Controller
              name="serviceType"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  {...field}
                  label="Service Type"
                  fullWidth
                  margin="normal"
                  error={!!errors.serviceType}
                  helperText={errors.serviceType?.message}
                >
                  <MenuItem value="Petrol">Petrol</MenuItem>
                  <MenuItem value="Diesel">Diesel</MenuItem>
                  <MenuItem value="Electric Charging">
                    Electric Charging
                  </MenuItem>
                </TextField>
              )}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="availableFrom"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="time"
                      label="Available From"
                      fullWidth
                      margin="normal"
                      error={!!errors.availableFrom}
                      helperText={errors.availableFrom?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="availableTo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="time"
                      label="Available To"
                      fullWidth
                      margin="normal"
                      error={!!errors.availableTo}
                      helperText={errors.availableTo?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
            </Grid>

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
              {loading ? "Submitting..." : "Add Fuel Service"}
            </Button>
          </form>
        </Grid>

        {/* Image Section */}
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

export default AddFuelForm;
