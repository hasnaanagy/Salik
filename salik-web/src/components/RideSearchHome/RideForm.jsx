import React from "react";
import { StyledTextField } from "../../custom/StyledTextField";
import { Button, Grid } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SquareIcon from "@mui/icons-material/Square";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

export function RideForm({ formData, handleChange, handleSubmit }) {
  return (
    <>
      <form onSubmit={handleSubmit}>
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
                <SquareIcon style={{ color: "#FFB800" }} />
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
    </>
  );
}
