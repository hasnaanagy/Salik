import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postMechanicData, clearError } from "../redux/slices/addMechanicSlice";

import MapComponent from "./Mapcomponent/MapComponent";


// Validation schema
const schema = yup.object().shape({
  mechanicLocation: yup.string().required("Workshop location is required"),
  mechanicType: yup.string().required("Mechanic type is required"),
  availableFrom: yup.string().required("Available from time is required"),
  availableTo: yup.string().required("Available to time is required"),
  workingDays: yup.array().min(1, "Select at least one working day"),
});

const AddServiceForm = () => {
  const dispatch = useDispatch();

  const { loading, error } = useSelector(
    (state) => state.mechanicService || {}
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      mechanicLocation: "",
      mechanicType: "",
      availableFrom: "",
      availableTo: "",
      workingDays: [],
    },
  });

  const [pickupCoords, setPickupCoords] = useState(null);
  const [locationError, setLocationError] = useState("");

  // Handle location selection from the map
  const handleLocationSelect = (lat, lng, address) => {
    setPickupCoords({ lat, lng });
    setValue("mechanicLocation", address);
    setLocationError("");
  };

  // Handle manual address search
  const handleAddressSearch = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setPickupCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setLocationError("");
      } else {
        setLocationError("Could not find location. Try again.");
      }
    } catch (error) {
      setLocationError("Failed to fetch coordinates.");
    }
  };

  // Handle form submission
  const onSubmit = (data) => {
    if (!pickupCoords) {
      setLocationError("Please select a location on the map.");
      return;
    }

    const transformedData = {
      serviceType: data.mechanicType,
      location: {
        type: "Point",
        coordinates: [pickupCoords.lng, pickupCoords.lat],

      },
      addressOnly: data.mechanicLocation,
      workingDays: data.workingDays,
      workingHours: {
        from: data.availableFrom + " AM",
        to: data.availableTo + " PM",
      },
    };
    dispatch(postMechanicData(transformedData));
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <Container maxWidth="lg" style={{ padding: "50px" }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Add Mechanic Service
          </Typography>

          {/* Server error as raw HTML (like mechanic form) */}
          {error && (
            <span
              style={{
                color: "red",
                fontSize: "14px",
                display: "block",
                marginBottom: "10px",
              }}
              dangerouslySetInnerHTML={{ __html: error }}
            ></span>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Workshop Location */}
            <Controller
              name="mechanicLocation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Workshop Location"
                  fullWidth
                  margin="normal"
                  error={!!errors.mechanicLocation}
                  helperText={errors.mechanicLocation?.message}
                  onBlur={() => handleAddressSearch(field.value)}
                />
              )}
            />

            <span style={{ color: "red", fontSize: "14px" }}>
              {locationError}
            </span>


            {/* Mechanic Type */}
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
                  <MenuItem value="mechanic">mechanic</MenuItem>
                  <MenuItem value="fuel">fuel</MenuItem>
                </TextField>
              )}
            />

            {/* Working Days */}
            <Controller
              name="workingDays"
              control={control}
              render={({ field }) => (
                <div>
                  <Typography variant="subtitle1">Working Days</Typography>

                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <FormControlLabel
                      key={day}
                      control={
                        <Checkbox
                          checked={field.value.includes(day)}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, day]
                              : field.value.filter((d) => d !== day);
                            field.onChange(newValue);
                          }}
                        />
                      }
                      label={day}
                    />
                  ))}
                  {errors.workingDays && (
                    <Typography color="error">
                      {errors.workingDays.message}
                    </Typography>

                  )}
                </div>
              )}
            />

            {/* Working Hours */}
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
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
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

        {/* Map Section */}
        <Grid
          item
          xs={12}
          md={6}
          style={{ height: "400px", position: "relative" }}
        >
          <MapComponent
            onLocationSelect={handleLocationSelect}
            pickupCoords={pickupCoords}
          />

        </Grid>
      </Grid>
    </Container>
  );
};

export default AddServiceForm;
