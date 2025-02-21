import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import MapComponent from "../Mapcomponent/Mapcomponent";
import rideImage from "../../../public/images/car.png";
import fuelImage from "../../../public/images/gas-pump.png";
import mechanicImage from "../../../public/images/technician.png";
import { RequestService } from "../RequestService";

export function RideSearch() {
  const [viewRequestForm, setViewRequestForm] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const dispatch = useDispatch();
  const { data: rideData, loading, error } = useSelector((state) => state.ride);

  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    date: "",
    time: "",
  });

  const [pickupCoords, setPickupCoords] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev, // Keep the existing values
      [e.target.name]: e.target.value, // Update only the changed field
    }));
  };

  const handleLocationSelect = (lat, lng, address) => {
    setPickupCoords({ lat, lng });
    setFormData((prev) => ({ ...prev, fromLocation: address }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dispatching formData:", formData); // Debugging step
    dispatch(fetchRideData(formData));
  };

  return (
    <Container sx={{ mt: 5, pb: 5, mb: 4 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={10} md={5}>
          <Typography variant="h4" fontWeight="bold" mb={3} textAlign="left">
            Go Anywhere With SALIK
          </Typography>

          {/* Service Icons */}
          <Box display="flex" gap={3} mb={4}>
            <IconButton
             onClick={() => setViewRequestForm(false)}
              // component={Link}
              // to="/"

              sx={{ backgroundColor: "#F3F3F3", p: 2, borderRadius: "12px" }}
            >
              <img src={rideImage} alt="Ride Icon" width={50} height={50} />
            </IconButton>
            <IconButton

            onClick={() =>  {setViewRequestForm(true), setServiceType("Fuel")}}
              sx={{ backgroundColor: "#F3F3F3", p: 2, borderRadius: "12px" }}
            >
              <img src={fuelImage} alt="Fuel Icon" width={50} height={50} />
            </IconButton>
            <IconButton
              onClick={() => {setViewRequestForm(true), setServiceType("Mechanic")}}
              // component={Link}
              // to="/requestService"
              sx={{ backgroundColor: "#F3F3F3", p: 2, borderRadius: "12px" }}
            >
              <img
                src={mechanicImage}
                alt="Mechanic Icon"
                width={50}
                height={50}
              />
            </IconButton>
          </Box>

                  {
                    viewRequestForm &&
                    <RequestService serviceType={serviceType}/>
                  }

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {rideData && (
            <Box
              mt={3}
              p={2}
              sx={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
            >
              <Typography variant="h6" fontWeight="bold">
                Ride Available
              </Typography>
              <pre>{JSON.stringify(rideData, null, 2)}</pre>
            </Box>
          )}
        </Grid>

        <Grid
          itemrides
          xs={10}
          md={6}
          sx={{ height: "400px", ml: { xs: 0, md: 10 } }}
        >
          <MapComponent
            onLocationSelect={handleLocationSelect}
            pickupCoords={pickupCoords}
          />
        </Grid>
      </Grid>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {rideData &&
        rideData.rides.map((ride) => (
          <div key={ride._id}>
            <p>{ride.fromLocation}</p>
            <p>{ride.toLocation}</p>
            <p>{ride.carType}</p>
            <p>{ride.price}</p>
            <p>{ride.rideDateTime}</p>
          </div>
        ))}
    </Container>
  );
}
