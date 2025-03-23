import React, { useEffect, useState } from "react";
import { StyledTextField } from "../../custom/StyledTextField";
import { Button, Grid, Snackbar, Alert } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SquareIcon from "@mui/icons-material/Square";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { useNavigate } from "react-router-dom";

export function RideForm({
  formData,
  handleChange,
  handleSubmit,
  handleFocus,
  fromRef,
  toRef,
}) {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (fromRef.current) {
      fromRef.current.focus(); // Focus "fromLocation" on mount
    }
  }, [fromRef]);

  const handleSubmitWithAuthCheck = (e) => {
    e.preventDefault();

    if (!token) {
      setSuccessMessage(true);
      setTimeout(() => {
        navigate("/login");
      }, 5000);
      return;
    }

    handleSubmit(e);
  };

  return (
    <>
      <form onSubmit={handleSubmitWithAuthCheck}>
        <StyledTextField
          inputRef={fromRef} // Ref for "fromLocation"
          variant="outlined"
          name="fromLocation"
          placeholder="Pickup Location"
          value={formData.fromLocation}
          onChange={handleChange}
          onFocus={() => handleFocus("fromLocation")} // Set focus to "fromLocation"
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
          inputRef={toRef} // Ref for "toLocation"
          variant="outlined"
          name="toLocation"
          placeholder="Dropoff Location"
          value={formData.toLocation}
          onChange={handleChange}
          onFocus={() => handleFocus("toLocation")} // Set focus to "toLocation"
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
