import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { MainButton } from "../custom/MainButton";
import { useDispatch, useSelector } from "react-redux";
import {
  sendRequestAction,
  getAllFilterServices,
} from "../redux/slices/requestServiceSlice";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { StyledTextField } from "../custom/StyledTextField";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";

const socket = io("http://localhost:5000"); // Replace with your backend URL

export const RequestService = ({
  serviceType,
  onLocationSelect,
  selectedLocation,
  onProvidersFound, // New prop to pass providers to parent
}) => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationInput, setLocationInput] = useState("");
  const [problem, setProblem] = useState("");
  const [isFindProvider, setIsFindProvider] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    services,
    isLoading: reduxLoading,
    error,
  } = useSelector((state) => state.requestSlice); // Access Redux state

  useEffect(() => {
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      setLocation(selectedLocation);
      reverseGeocode(selectedLocation.lat, selectedLocation.lng);
    }
  }, [selectedLocation]);

  const reverseGeocode = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      setLocationInput(
        data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      );
    } catch (error) {
      console.error("Error fetching address:", error);
      setLocationInput(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.lat && location.lng && !locationInput) {
      setLocationInput(
        `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
      );
    }
  }, [location, locationInput]);

  const handleToggleMode = (mode) => {
    setIsFindProvider(mode === "find");
  };

  const handleLocationInputClick = () => {
    setAlert({
      open: true,
      message: "Please set your location using the map.",
      severity: "info",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.lat || !location.lng) {
      setAlert({
        open: true,
        message: "Please set a valid location before submitting.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const type = serviceType === "Mechanic" ? "mechanic" : "fuel";
      const requestData = {
        serviceType: type,
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
        problem,
      };

      await dispatch(sendRequestAction(requestData)).unwrap();
      setAlert({
        open: true,
        message: "Request sent successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/requests"), 1500);
    } catch (error) {
      console.error("Error sending request:", error);
      setAlert({
        open: true,
        message: "Failed to send request. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFindProviders = async () => {
    if (!location.lat || !location.lng) {
      setAlert({
        open: true,
        message: "Please set a valid location before searching.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const type = serviceType === "Mechanic" ? "mechanic" : "fuel";
      await dispatch(
        getAllFilterServices({
          latitude: location.lat,
          longitude: location.lng,
          serviceType: type,
        })
      ).unwrap();

      if (services && services.length > 0 && onProvidersFound) {
        onProvidersFound(services); // Pass the services to the parent
      } else {
        setAlert({
          open: true,
          message: "No nearby service providers found.",
          severity: "info",
        });
      }
    } catch (error) {
      console.error("Error fetching nearby providers:", error);
      setAlert({
        open: true,
        message: "Failed to find nearby providers. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h6" fontWeight="bold" mb={3} gutterBottom>
        Request {serviceType} Service
      </Typography>

      {/* Toggle Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <IconButton
          onClick={() => handleToggleMode("send")}
          sx={{
            flex: 1,
            bgcolor: !isFindProvider ? "#FFB800" : "#F3F3F3",
            color: !isFindProvider ? "#fff" : "#000",
            borderRadius: "12px 0 0 12px",
            p: 1.5,
            mr: 0.5,
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: !isFindProvider ? "#e6a700" : "#e0e0e0",
            },
          }}
        >
          <SendIcon sx={{ mr: 1 }} />
          Send Request
        </IconButton>
        <IconButton
          onClick={() => handleToggleMode("find")}
          sx={{
            flex: 1,
            bgcolor: isFindProvider ? "#FFB800" : "#F3F3F3",
            color: isFindProvider ? "#fff" : "#000",
            borderRadius: "0 12px 12px 0",
            p: 1.5,
            ml: 0.5,
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: isFindProvider ? "#e6a700" : "#e0e0e0",
            },
          }}
        >
          <SearchIcon sx={{ mr: 1 }} />
          Find Provider
        </IconButton>
      </Box>

      {isFindProvider ? (
        // Find Provider Section
        <Box>
          <StyledTextField
            placeholder="Click on the map to set your location"
            value={locationInput}
            onClick={handleLocationInputClick}
            fullWidth
            disabled={loading || reduxLoading}
            InputProps={{
              startAdornment: (
                <LocationOnIcon sx={{ color: "text.secondary", mr: 1 }} />
              ),
              endAdornment:
                loading || reduxLoading ? (
                  <CircularProgress size={20} sx={{ ml: 1 }} />
                ) : null,
            }}
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                borderRadius: "12px",
                backgroundColor: "#F3F3F3",
                padding: "8px 12px",
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" mb={2}>
            Select your location on the map to find nearby providers.
          </Typography>
          <MainButton
            onClick={handleFindProviders}
            variant="contained"
            disabled={loading || reduxLoading || !location.lat || !location.lng}
            sx={{
              width: "100%",
              mb: 2,
              bgcolor: "#FFB800",
              "&:hover": { bgcolor: "#e6a700" },
            }}
          >
            {loading || reduxLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Find Providers"
            )}
          </MainButton>
        </Box>
      ) : (
        // Send Request Section
        <form onSubmit={handleSubmit}>
          <StyledTextField
            placeholder="Describe your problem in detail"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            required
            multiline
            minRows={4}
            disabled={loading}
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                borderRadius: "12px",
                backgroundColor: "#F3F3F3",
                padding: "8px 12px",
              },
            }}
          />
          <MainButton
            type="submit"
            variant="contained"
            disabled={loading || !location.lat || !location.lng}
            sx={{
              width: "100%",
              bgcolor: "#FFB800",
              "&:hover": { bgcolor: "#e6a700" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send Request"
            )}
          </MainButton>
        </form>
      )}

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};
