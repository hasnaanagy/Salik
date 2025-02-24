import React, { useEffect, useState } from "react";
import { Container, Grid, TextField, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postRideData } from "../redux/slices/addServiceSlice";
import MapComponent from "./Mapcomponent/MapComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { getRideById, updateRideAction } from "../redux/slices/rideSlice";

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
  const { loading, error } = useSelector((state) => state.addService);
  const navigate = useNavigate();
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

  const handleLocationSelect = (lat, lng, address) => {
    setPickupCoords({ lat, lng });
    setValue("fromLocation", address);
  };

  const onSubmit = async (data) => {
    const formattedData = {
      carType: data.carType,
      fromLocation: data.fromLocation,
      toLocation: data.toLocation,
      totalSeats: parseInt(data.totalSeats, 10),
      price: parseInt(data.price, 10),
      date: data.date,
      time: data.time,
    };

    if (rideId) {
      await dispatch(updateRideAction({ rideId, newRide: formattedData }));
      console.log("edit");
    } else {
      console.log("add");
      await dispatch(postRideData(formattedData));
    }
    navigate("/activities");
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
              {typeof error === "string" ? error : error.message || "An error occurred"}
            </Typography>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="fromLocation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Pickup Location"
                  fullWidth
                  margin="normal"
                  error={!!errors.fromLocation}
                  helperText={errors.fromLocation?.message}
                  disabled={!!rideId}
                />
              )}
            />
            <Controller
              name="toLocation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Dropoff Location"
                  fullWidth
                  margin="normal"
                  error={!!errors.toLocation}
                  helperText={errors.toLocation?.message}
                  disabled={!!rideId}
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
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ marginTop: "20px", backgroundColor: "#ffb800", color: "black" }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Confirm Pickup"}
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} md={6} style={{ height: "400px", position: "relative" }}>
          <MapComponent onLocationSelect={handleLocationSelect} pickupCoords={pickupCoords} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddTripForm;