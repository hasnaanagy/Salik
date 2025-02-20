import { useState, useEffect } from "react";
import axios from "axios";
import { StyledTextField } from "../custom/StyledTextField";
import { Box, Button, TextField, Typography } from "@mui/material";
import { MainButton } from "../custom/MainButton";

export const RequestService = ({ serviceType }) => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [problem, setProblem] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      problem,
      location,
    };

    try {
      await axios.post(
        "http://localhost:5000/api/request-service",
        requestData
      );
      alert("Request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div>
      <Typography variant="h6" fontWeight="bold" mb={2} gutterBottom>
        Request {serviceType} Service
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          placeholder="Describe your problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          required
          multiline
          minRows={4}
          sx={{
            width: "70%",
            marginBottom: "16px",
            borderRadius: "12px",
            backgroundColor: "#F3F3F3",
            fontSize: "16px",
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
            },
          }}
        />

        <MainButton
          type="submit"
          sx={{ width: "30%", display: "flex" }}
          variant="contained"
        >
          Send
        </MainButton>
      </form>
    </div>
  );
};

