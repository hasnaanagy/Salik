import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import rideImage from "../../../public/images/car.png";
import fuelImage from "../../../public/images/gas-pump.png";
import mechanicImage from "../../../public/images/technician.png";

export function RideIcons({ setServiceType, setViewRequestForm }) {
  const [activeIcon, setActiveIcon] = useState("Ride"); // Default active icon

  const handleClick = (type) => {
    setActiveIcon(type);
    if (type === "Ride") {
      setViewRequestForm(false);
    } else {
      setViewRequestForm(true);
      setServiceType(type);
    }
  };

  return (
    <Box display="flex" gap={3} mb={4}>
      {/* Ride Icon */}
      <IconButton
        onClick={() => handleClick("Ride")}
        sx={{
          backgroundColor: activeIcon === "Ride" ? "#FFB800" : "#F3F3F3",
          p: 2,
          borderRadius: "12px",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        <img src={rideImage} alt="Ride Icon" width={50} height={50} />
      </IconButton>

      {/* Fuel Icon */}
      <IconButton
        onClick={() => handleClick("Fuel")}
        sx={{
          backgroundColor: activeIcon === "Fuel" ? "#FFB800" : "#F3F3F3",
          p: 2,
          borderRadius: "12px",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        <img src={fuelImage} alt="Fuel Icon" width={50} height={50} />
      </IconButton>

      {/* Mechanic Icon */}
      <IconButton
        onClick={() => handleClick("Mechanic")}
        sx={{
          backgroundColor: activeIcon === "Mechanic" ? "#FFB800" : "#F3F3F3",
          p: 2,
          borderRadius: "12px",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        <img src={mechanicImage} alt="Mechanic Icon" width={50} height={50} />
      </IconButton>
    </Box>
  );
}
