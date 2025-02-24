import React, { useState } from "react";
import { StyledTextField } from "../../custom/StyledTextField";
import { Button, Grid, Snackbar, Alert } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SquareIcon from "@mui/icons-material/Square";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { useNavigate } from "react-router-dom";

export function RideForm({ formData, handleChange, handleSubmit }) {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmitWithAuthCheck = (e) => {
    e.preventDefault();

    if (!token) {
      setSuccessMessage(true);
      setTimeout(() => {
        navigate("/login");
      }, 5000);
      return; // Stop form submission
    }

    handleSubmit(e);
  };

  return (
    <>
      <form onSubmit={handleSubmitWithAuthCheck}>
        <StyledTextField
          variant="outlined"
          name="fromLocation"
          placeholder="Pickup Location"
          value={formData.fromLocation}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <RadioButtonCheckedIcon style={{ color: "#FFB800" }} />
              </InputAdornment>
            ),
          }}
        />
        <StyledTextField
          variant="outlined"
          name="toLocation"
          placeholder="Dropoff Location"
          value={formData.toLocation}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SquareIcon style={{ color: "#FFB800" }} fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Grid spacing={10} display={"flex"} gap={4}>
          <Grid item xs={5}>
            <StyledTextField
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={5}>
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

      {/* Snackbar for showing the login alert */}
      <Snackbar
        open={successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          🚀 Hold on! You need to log in first. Go ahead, log in, and come back!
          😉
        </Alert>
      </Snackbar>
    </>
  );
}
