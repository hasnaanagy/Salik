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
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  createService,
  updateService,
  clearError,
} from "../redux/slices/serviceSlice";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { loading, error } = useSelector((state) => state.service || {});

  // Check if we're in edit mode
  const isEdit = location.state?.isEdit || false;
  const serviceToEdit = location.state?.service || null;

  // Debug: Log the received service data
  useEffect(() => {
    console.log("Received Service in AddServiceForm:", serviceToEdit);
  }, [serviceToEdit]);

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
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  // Pre-fill form if in edit mode
  useEffect(() => {
    if (isEdit && serviceToEdit) {
      // Only set mechanicLocation if addressOnly is not the fallback message
      const locationToSet =
        serviceToEdit.addressOnly &&
        serviceToEdit.addressOnly !== "Location not specified"
          ? serviceToEdit.addressOnly
          : "";
      setValue("mechanicLocation", locationToSet);
      setValue("mechanicType", serviceToEdit.serviceType || "");
      setValue(
        "availableFrom",
        serviceToEdit.workingHours?.from?.replace(" AM", "") || ""
      );
      setValue(
        "availableTo",
        serviceToEdit.workingHours?.to?.replace(" PM", "") || ""
      );
      setValue("workingDays", serviceToEdit.workingDays || []);
      if (
        serviceToEdit.location?.coordinates &&
        Array.isArray(serviceToEdit.location.coordinates) &&
        serviceToEdit.location.coordinates.length === 2
      ) {
        const [lng, lat] = serviceToEdit.location.coordinates;
        if (typeof lng === "number" && typeof lat === "number") {
          setPickupCoords({ lat, lng });
          console.log("Set pickupCoords:", { lat, lng });
        } else {
          console.error(
            "Invalid coordinates format:",
            serviceToEdit.location.coordinates
          );
        }
      } else {
        console.error("No valid coordinates found in serviceToEdit.location");
      }
    }
  }, [isEdit, serviceToEdit, setValue]);

  // Handle location selection from the map
  const handleLocationSelect = (lat, lng, address) => {
    setPickupCoords({ lat, lng });
    setValue("mechanicLocation", address);
    setLocationError("");
  };

  // Handle manual address search
  const handleAddressSearch = async (address) => {
    if (!address) return; // Avoid empty searches
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setPickupCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setLocationError("");
      } else {
        setLocationError(
          "Could not find location. Try a more specific address."
        );
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setLocationError("Failed to fetch coordinates. Please try again.");
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
        from: data.availableFrom,
        to: data.availableTo,
      },
    };

    if (isEdit) {
      // Update service
      dispatch(
        updateService({
          serviceId: serviceToEdit._id,
          ...transformedData,
        })
      )
        .unwrap()
        .then(() => {
          setSuccessMessage(true);
          setTimeout(() => {
            navigate("/servicesprovider");
          }, 2000);
        })
        .catch((err) => {
          setErrorMessage(true);
        });
    } else {
      // Create service
      dispatch(createService(transformedData))
        .unwrap()
        .then(() => {
          setSuccessMessage(true);
          setTimeout(() => {
            navigate("/servicesprovider");
          }, 2000);
        })
        .catch((err) => {
          setErrorMessage(true);
        });
    }
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
            {isEdit ? "Edit Service" : "Add Your Service"}
          </Typography>

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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.23)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.87)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb800",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(0, 0, 0, 0.54)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#ffb800",
                    },
                  }}
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
                  helperText={
                    isEdit
                      ? "Service type cannot be changed."
                      : errors.mechanicType?.message
                  }
                  disabled={isEdit} // Disable the field in edit mode
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.23)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.87)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb800",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "#f5f5f5", // Light gray background when disabled
                        color: "rgba(0, 0, 0, 0.87)", // Ensure text is still readable
                        WebkitTextFillColor: "rgba(0, 0, 0, 0.87)", // Fix for Safari
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(0, 0, 0, 0.54)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#ffb800",
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.54)", // Ensure label is readable when disabled
                    },
                  }}
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.23)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.87)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#ffb800",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(0, 0, 0, 0.54)",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#ffb800",
                        },
                      }}
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.23)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0, 0, 0, 0.87)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#ffb800",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(0, 0, 0, 0.54)",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#ffb800",
                        },
                      }}
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
              {loading
                ? "Submitting..."
                : isEdit
                ? "Edit Service"
                : "Add Service"}
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

      {/* Success Snackbar */}
      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {isEdit
            ? "Service updated successfully!"
            : "Service added successfully!"}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorMessage(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error ||
            `An error occurred while ${
              isEdit ? "updating" : "adding"
            } the service.`}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddServiceForm;
