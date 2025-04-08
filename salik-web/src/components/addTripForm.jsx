import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { createRide, getRideById, updateRideAction } from "../redux/slices/RideSlice";
import MapComponent from "./Mapcomponent/MapComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { textFieldStyles, buttonStyles, containerStyles } from "../styles/AddTripStyle";

const AddTripForm = () => {
  const { ride } = useSelector((state) => state.ride) || {};
  const location = useLocation();
  const rideId = location.state?.rideId;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.ride);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fromLocation: "",
      toLocation: "",
      carType: "",
      totalSeats: "",
      price: "",
      date: "",
      time: "",
    },
  });

  const [pickupCoords, setPickupCoords] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [focusedInput, setFocusedInput] = useState("fromLocation");

  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    if (fromRef.current && !rideId) {
      fromRef.current.focus();
    }
  }, [fromRef, rideId]);

  const handleLocationSelect = (lat, lng, address) => {
    setPickupCoords({ lat, lng });
    setValue(focusedInput, address, { shouldValidate: true });
  };

  const handleFocus = (inputName) => {
    if (!rideId) {
      setFocusedInput(inputName);
    }
  };

  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":");
    const hoursInt = parseInt(hours, 10);
    const period = hoursInt >= 12 ? "PM" : "AM";
    const hours12 = hoursInt % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  };

  const onSubmit = async (data) => {
    const formattedData = {
      carType: data.carType,
      fromLocation: data.fromLocation,
      toLocation: data.toLocation,
      totalSeats: parseInt(data.totalSeats, 10),
      price: parseInt(data.price, 10),
      date: data.date,
      time: convertTo12HourFormat(data.time),
    };

    if (rideId) {
      dispatch(updateRideAction({ rideId, formattedData }));
    } else {
      dispatch(createRide(formattedData));
    }
    setSuccessMessage(true);
    setTimeout(() => {
      navigate("/activities");
    }, 2000);
  };

  useEffect(() => {
    if (rideId) {
      dispatch(getRideById(rideId));
    }
  }, [rideId, dispatch]);

  useEffect(() => {
    if (rideId && ride) {
      setValue("fromLocation", ride?.fromLocation || "");
      setValue("toLocation", ride?.toLocation || "");
      setValue("carType", ride?.carType || "");
      setValue("totalSeats", ride?.totalSeats || "");
      setValue("price", ride?.price || "");
      setValue("date", ride?.rideDateTime?.split("T")[0] || "");
      setValue("time", ride?.rideDateTime?.split("T")[1]?.slice(0, 5) || "");
    }
  }, [ride, rideId, setValue]);

  return (
    <Container maxWidth="lg" sx={containerStyles}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Go Anywhere With <span style={{ color: "#FFC107" }}>SALIK</span>
          </Typography>
          {error && (
            <Typography color="error">
              {typeof error === "string"
                ? error
                : error.message || "An error occurred"}
            </Typography>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("fromLocation", {
                required: "Pickup location is required",
              })}
              inputRef={fromRef}
              label="Pickup Location"
              fullWidth
              margin="normal"
              error={!!errors.fromLocation}
              helperText={errors.fromLocation?.message}
              disabled={!!rideId}
              onFocus={() => handleFocus("fromLocation")}
              sx={textFieldStyles}
              InputLabelProps={{ shrink: true }} // Fix: Ensure label shrinks
            />
            <TextField
              {...register("toLocation", {
                required: "Dropoff location is required",
              })}
              inputRef={toRef}
              label="Dropoff Location"
              fullWidth
              margin="normal"
              error={!!errors.toLocation}
              helperText={errors.toLocation?.message}
              disabled={!!rideId}
              onFocus={() => handleFocus("toLocation")}
              sx={textFieldStyles}
              InputLabelProps={{ shrink: true }} // Fix: Ensure label shrinks
            />
            <TextField
              {...register("carType", {
                required: "Car type is required",
              })}
              label="Car Type"
              fullWidth
              margin="normal"
              error={!!errors.carType}
              helperText={errors.carType?.message}
              disabled={!!rideId}
              sx={textFieldStyles}
              InputLabelProps={{ shrink: true }} // Optional: Added for consistency
            />
            <TextField
              {...register("totalSeats", {
                required: "Seats are required",
                valueAsNumber: true,
                min: { value: 1, message: "Seats must be at least 1" },
                max: { value: 28, message: "Seats cannot exceed 28" },
              })}
              label="Total Seats"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.totalSeats}
              helperText={errors.totalSeats?.message}
              sx={textFieldStyles}
              InputLabelProps={{ shrink: true }} // Optional: Added for consistency
            />
            <TextField
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0, message: "Price cannot be negative" },
              })}
              label="Price"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.price}
              helperText={errors.price?.message}
              sx={textFieldStyles}
              InputLabelProps={{ shrink: true }} // Optional: Added for consistency
            />
            <TextField
              {...register("date", {
                required: "Date is required",
              })}
              label="Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }} // Already present
              error={!!errors.date}
              helperText={errors.date?.message}
              disabled={!!rideId}
              sx={textFieldStyles}
            />
            <TextField
              {...register("time", {
                required: "Time is required",
              })}
              label="Time"
              type="time"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }} // Already present
              error={!!errors.time}
              helperText={errors.time?.message}
              disabled={!!rideId}
              sx={textFieldStyles}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={buttonStyles}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Confirm Pickup"}
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} md={6} sx={{ height: "400px", position: "relative" }}>
          <MapComponent
            onLocationSelect={handleLocationSelect}
            pickupCoords={pickupCoords}
            focusedInput={focusedInput}
            disabled={!!rideId}
          />
        </Grid>
      </Grid>
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
          Trip added successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddTripForm;