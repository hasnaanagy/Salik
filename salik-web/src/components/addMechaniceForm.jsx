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
import { postMechanicData, clearError } from "../redux/slices/addMechanicSlice"; // Ensure path is correct
import mechanicImage from "../../public/images/map.png"; // Update the image path as needed
import MapComponent from "./Mapcomponent/Mapcomponent";

const schema = yup.object().shape({
  mechanicLocation: yup.string().required("Workshop location is required"),
  mechanicType: yup.string().required("Mechanic type is required"),
  availableFrom: yup.string().required("Available from time is required"),
  availableTo: yup.string().required("Available to time is required"),
});

const AddMechanicForm = () => {
  const dispatch = useDispatch();
  const { loading = false, error = null } = useSelector(
    (state) => state.mechanicService || {}
  );
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      mechanicLocation: "",
      mechanicType: "",
      availableFrom: "",
      availableTo: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(postMechanicData(data));
  };


  const [pickupCoords, setPickupCoords] = useState(null);

    return (
        <Container maxWidth="lg" style={{ padding: "50px" }}>
            <Grid container spacing={4} alignItems="center">
                {/* Form Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Add Mechanic Service
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="MechanicLocation"
                            control={control}
                            defaultValue=""  // Ensures controlled input from the start
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Workshop Location"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.MechanicLocation}
                                    helperText={errors.MechanicLocation?.message}
                                />
                            )}
                        />


  // Function to update the pickup location when a location is selected on the map
  const handleLocationSelect = (lat, lng, address) => {
    setPickupCoords({ lat, lng });
    setValue("Workshop location", address);
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
  return (
    <Container maxWidth="lg" style={{ padding: "50px" }}>
      <Grid container spacing={4} alignItems="center">
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Add Mechanic Service
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="Workshop location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Workshop Location"
                  fullWidth
                  margin="normal"
                  error={!!errors.mechanicLocation}
                  helperText={errors.mechanicLocation?.message}
                  onBlur={() => handleAddressSearch(field.value)} // Convert to coordinates when user types
                />
              )}
            />

            <Controller
              name="mechanicType"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  {...field}
                  label="Mechanic Type"
                  fullWidth
                  margin="normal"
                  error={!!errors.mechanicType}
                  helperText={errors.mechanicType?.message}
                >
                  <MenuItem value="Engine Repair">Engine Repair</MenuItem>
                  <MenuItem value="Body Work">Body Work</MenuItem>
                  <MenuItem value="Transmission Repair">
                    Transmission Repair
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
              {loading ? "Submitting..." : "Add Mechanic Service"}
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

export default AddMechanicForm;
