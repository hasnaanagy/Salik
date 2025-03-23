import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { RideIcons } from "./RideIcons";
import { RideForm } from "./RideForm";
import { RideResults } from "../Searchresult/RideResults";
import MapComponent from "../Mapcomponent/MapComponent";
import RidePersonDetais from "../Searchresult/RidePersonDetais";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { keyframes } from "@mui/system";
import { RequestService } from "../RequestService";
import { fetchRideData } from "../../redux/slices/RideSlice";

export function RideSearch() {
  const [viewRequestForm, setViewRequestForm] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const dispatch = useDispatch();
  const { data: rideData, loading, error } = useSelector((state) => state.ride);

  const [view, setView] = useState("search");
  const [selectedRide, setSelectedRide] = useState(null);
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    date: "",
    time: "",
  });
  const [focusedInput, setFocusedInput] = useState("fromLocation"); // Track focused input

  const fromRef = useRef(null); // Ref for "fromLocation"
  const toRef = useRef(null); // Ref for "toLocation"

  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  const zoomIn = keyframes`
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  `;

  const [pickupCoords, setPickupCoords] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFocus = (inputName) => {
    setFocusedInput(inputName); // Update focused input
  };

  const handleLocationSelect = (lat, lng, address) => {
    setPickupCoords({ lat, lng });
    setFormData((prev) => ({ ...prev, [focusedInput]: address })); // Set location in focused input
  };

  const handleSubmit = () => {
    setView("results");
    dispatch(fetchRideData(formData));
  };

  const handleRideClick = (ride) => {
    setSelectedRide(ride);
    setView("details");
  };

  const handleBackToResults = () => {
    setSelectedRide(null);
    setView("results");
  };

  const handleBackToSearch = () => {
    setSelectedRide(null);
    setView("search");
  };

  return (
    <Stack
      spacing={4}
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 4 },
        backgroundColor: "#fff",
        borderRadius: "20px",
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        <Grid
          item
          xs={12}
          sm={10}
          md={view === "search" ? 6 : 3}
          sx={{
            textAlign: { xs: "center", md: "left" },
            border: "2px solid #d2d2d2",
            padding: "10px",
            borderRadius: "20px",
          }}
        >
          {view === "search" && (
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={3}
              textAlign={{ xs: "center", md: "left" }}
              sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" } }}
            >
              Go Anywhere With <span style={{ color: "#FFB800" }}>SALIK</span>
            </Typography>
          )}
          {(view === "results" || view === "details") && (
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={3}
              textAlign={{ xs: "center", md: "left" }}
              sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" } }}
            >
              Get A Ride With <span style={{ color: "#FFB800" }}>SALIK</span>
            </Typography>
          )}

          {view === "search" && (
            <RideIcons
              setServiceType={setServiceType}
              setViewRequestForm={setViewRequestForm}
            />
          )}

          {!viewRequestForm && (
            <RideForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleFocus={handleFocus} // Pass focus handler
              fromRef={fromRef} // Pass ref
              toRef={toRef} // Pass ref
            />
          )}
          {viewRequestForm && <RequestService serviceType={serviceType} />}
        </Grid>

        {view !== "search" && (
          <Grid item xs={12} sm={10} md={4}>
            {view === "results" && (
              <>
                <Button
                  onClick={handleBackToSearch}
                  sx={{ mb: 2, float: "left", marginRight: "10px" }}
                >
                  <KeyboardBackspaceIcon
                    fontSize="large"
                    sx={{ mr: 1, color: "#FFB800" }}
                  />
                </Button>
                <RideResults
                  rideData={rideData}
                  loading={loading}
                  error={error}
                  selectedRide={handleRideClick}
                />
              </>
            )}

            {view === "details" && (
              <div style={{ marginRight: "50px" }}>
                <Button
                  onClick={handleBackToResults}
                  sx={{ mb: 2, float: "left", marginRight: "10px" }}
                >
                  <KeyboardBackspaceIcon
                    fontSize="large"
                    sx={{ mr: 1, color: "#FFB800" }}
                  />
                </Button>
                <RidePersonDetais ride={selectedRide} />
              </div>
            )}
          </Grid>
        )}

        <Grid
          item
          xs={12}
          sm={10}
          md={view === "search" ? 5 : 4}
          sx={{
            height: "450px",
            maxWidth: "800px",
            mx: "auto",
            animation: `${
              view === "search" ? fadeIn : zoomIn
            } 0.8s ease-in-out`,
          }}
        >
          <MapComponent
            onLocationSelect={handleLocationSelect}
            pickupCoords={pickupCoords}
            focusedInput={focusedInput} // Pass focused input
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
