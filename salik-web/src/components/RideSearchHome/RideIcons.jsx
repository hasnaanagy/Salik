import { Box } from "@mui/material";
import { IconButton } from "@mui/material";
import React from "react";
import rideImage from "../../../public/images/car.png";
import fuelImage from "../../../public/images/gas-pump.png";
import mechanicImage from "../../../public/images/technician.png";

export function RideIcons({ setServiceType, setViewRequestForm }) {
  return (
    <>
      <Box display="flex" gap={3} mb={4}>
        <IconButton
          onClick={() => setViewRequestForm(false)}
          sx={{ backgroundColor: "#F3F3F3", p: 2, borderRadius: "12px" }}
        >
          <img src={rideImage} alt="Ride Icon" width={50} height={50} />
        </IconButton>
        <IconButton
          onClick={() => {
            setViewRequestForm(true), setServiceType("Fuel");
          }}
          sx={{ backgroundColor: "#F3F3F3", p: 2, borderRadius: "12px" }}
        >
          <img src={fuelImage} alt="Fuel Icon" width={50} height={50} />
        </IconButton>
        <IconButton
          onClick={() => {
            setViewRequestForm(true), setServiceType("Mechanic");
          }}
          sx={{ backgroundColor: "#F3F3F3", p: 2, borderRadius: "12px" }}
        >
          <img src={mechanicImage} alt="Mechanic Icon" width={50} height={50} />
        </IconButton>
      </Box>
    </>
  );
}
