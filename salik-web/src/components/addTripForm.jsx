import React from "react";
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
import mapImage from "../../public/images/map.png"; // Make sure this path is correct

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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      pickup: "",
      dropoff: "",
      carType: "",
      seats: "",
      price: "",
      date: "",
      time: "",
    }, // Initialize all fields with default values
  });

  const onSubmit = (data) => {
    dispatch(postRideData(data));
  };

  return (
    <Container maxWidth="lg" style={{ padding: "50px" }}>
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
            <Controller
              name="carType"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  {...field}
                  value={field.value || ""} // Ensure value is always defined
                  label="Car Type"
                  fullWidth
                  margin="normal"
                  error={!!errors.carType}
                  helperText={errors.carType?.message}
                >
                  <MenuItem value="Bus">Bus</MenuItem>
                  <MenuItem value="MicroBus">MicroBus</MenuItem>
                  <MenuItem value="Verna">Verna</MenuItem>
                </TextField>
              )}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="seats"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Seats"
                      fullWidth
                      margin="normal"
                      error={!!errors.seats}
                      helperText={errors.seats?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Price"
                      fullWidth
                      margin="normal"
                      error={!!errors.price}
                      helperText={errors.price?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Date"
                      fullWidth
                      margin="normal"
                      error={!!errors.date}
                      helperText={errors.date?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="time"
                      label="Time"
                      fullWidth
                      margin="normal"
                      error={!!errors.time}
                      helperText={errors.time?.message}
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
              {loading ? "Submitting..." : "Confirm Pickup"}
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} md={6}>
          <img
            src={mapImage}
            alt="Map Placeholder"
            style={{ width: "100%", height: "80vh", objectFit: "cover" }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddTripForm;
