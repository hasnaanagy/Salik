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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createRide } from "../redux/slices/RideSlice";
import MapComponent from "./Mapcomponent/MapComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { getRideById, updateRideAction } from "../redux/slices/RideSlice";

const schema = yup.object().shape({
  fromLocation: yup.string().required("Pickup location is required"),
  toLocation: yup.string().required("Dropoff location is required"),
  carType: yup.string().required("Car type is required"),
  totalSeats: yup
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
  const { ride } = useSelector((state) => state.ride) || {};
  const location = useLocation();
  const rideId = location.state?.rideId;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.ride);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
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
  const [focusedInput, setFocusedInput] = useState("fromLocation"); // Track focused input

  const fromRef = useRef(null); // Ref for "fromLocation"
  const toRef = useRef(null); // Ref for "toLocation"

  useEffect(() => {
    if (fromRef.current && !rideId) {
      fromRef.current.focus(); // Focus "fromLocation" on mount if not editing
    }
  }, [fromRef, rideId]);

  const handleLocationSelect = (lat, lng, address) => {
    setPickupCoords({ lat, lng });
    setValue(focusedInput, address); // Set location in the focused input
  };

  const handleFocus = (inputName) => {
    if (!rideId) {
      // Only allow focus change if not editing
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
    <Container maxWidth="lg" style={{ padding: "50px", marginBottom: "50px" }}>
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
            <Controller
              name="fromLocation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  inputRef={fromRef} // Add ref
                  label="Pickup Location"
                  fullWidth
                  margin="normal"
                  error={!!errors.fromLocation}
                  helperText={errors.fromLocation?.message}
                  disabled={!!rideId}
                  onFocus={() => handleFocus("fromLocation")} // Track focus
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
            <Controller
              name="toLocation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  inputRef={toRef} // Add ref
                  label="Dropoff Location"
                  fullWidth
                  margin="normal"
                  error={!!errors.toLocation}
                  helperText={errors.toLocation?.message}
                  disabled={!!rideId}
                  onFocus={() => handleFocus("toLocation")} // Track focus
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
            <Controller
              name="carType"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Car Type"
                  fullWidth
                  margin="normal"
                  error={!!errors.carType}
                  helperText={errors.carType?.message}
                  disabled={!!rideId}
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
            <Controller
              name="totalSeats"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Total Seats"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.totalSeats}
                  helperText={errors.totalSeats?.message}
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
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.price}
                  helperText={errors.price?.message}
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
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  disabled={!!rideId}
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
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Time"
                  type="time"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.time}
                  helperText={errors.time?.message}
                  disabled={!!rideId}
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
        <Grid
          item
          xs={12}
          md={6}
          style={{ height: "400px", position: "relative" }}
        >
          <MapComponent
            onLocationSelect={handleLocationSelect}
            pickupCoords={pickupCoords}
            focusedInput={focusedInput} // Pass focused input
            disabled={!!rideId} // Disable map interaction if editing
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
