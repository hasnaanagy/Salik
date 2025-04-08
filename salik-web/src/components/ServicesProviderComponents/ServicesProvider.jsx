import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { keyframes } from "@mui/system";
import {
  getProviderServices,
  deleteService,
  clearError,
} from "../../redux/slices/serviceSlice";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ServicesProvider = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { service, loading, error, success } = useSelector(
    (state) => state.service || {}
  );
  const { user, loading: userLoading } = useSelector(
    (state) => state.auth || {}
  );
  const [errorMessage, setErrorMessage] = useState(false);
  const [locations, setLocations] = useState({}); // Cache for geocoded addresses
  const [expandedLocations, setExpandedLocations] = useState({}); // Track expanded locations

  // Check user role and redirect if not a provider
  useEffect(() => {
    if (!userLoading && user?.type !== "provider") {
      navigate("/"); // Redirect to homepage if not a provider
    }
  }, [user, userLoading, navigate]);

  // Fetch services on mount
  useEffect(() => {
    if (user?.type === "provider") {
      dispatch(getProviderServices())
        .unwrap()
        .catch(() => setErrorMessage(true));
    }

    return () => {
      dispatch(clearError());
    };
  }, [dispatch, user]);

  // Reverse geocode coordinates to address
  const getAddressFromCoordinates = async (lat, lng, requestId) => {
    try {
      const apiKey = "2d4b78c5799a4d8292da41dce45cadde"; // Your OpenCage API key
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
      );
      const address = response.data.results[0]?.formatted || "Unknown location";
      setLocations((prev) => ({ ...prev, [requestId]: address }));
    } catch (error) {
      console.error("Error fetching address:", error);
      setLocations((prev) => ({
        ...prev,
        [requestId]: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`, // Fallback to coordinates
      }));
    }
  };

  // Fetch addresses when services data changes
  useEffect(() => {
    if (success && Array.isArray(service?.services)) {
      service.services.forEach((svc) => {
        if (svc.location?.coordinates?.length === 2) {
          const [lng, lat] = svc.location.coordinates; // GeoJSON format: [lng, lat]
          if (!locations[svc._id]) {
            getAddressFromCoordinates(lat, lng, svc._id);
          }
        }
      });
    }
  }, [service, success, locations]);

  // Format location based on coordinates (priority) or addressOnly
  const formatLocation = (svc) => {
    if (svc.location?.coordinates?.length === 2) {
      const [lng, lat] = svc.location.coordinates;
      return (
        locations[svc._id] || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
      );
    } else if (svc.addressOnly && svc.addressOnly !== "null") {
      return svc.addressOnly;
    } else {
      return "Location not specified";
    }
  };

  // Truncate location text if too long
  const truncateLocation = (location, maxLength = 30) => {
    if (location.length <= maxLength) return location;
    return `${location.substring(0, maxLength)}...`;
  };

  // Toggle expanded location
  const toggleLocation = (svcId) => {
    setExpandedLocations((prev) => ({
      ...prev,
      [svcId]: !prev[svcId],
    }));
  };

  // Format working hours to ensure AM/PM is displayed
  const formatWorkingHours = (time) => {
    if (!time) return "N/A";
    // Check if the time already includes AM/PM
    if (time.includes("AM") || time.includes("PM")) {
      return time;
    }
    // Parse the time (e.g., "03:22" or "21:22")
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Handle update: Navigate to AddServiceForm with service data
  const handleUpdate = (svcId) => {
    const serviceToUpdate = service.services.find((svc) => svc._id === svcId);
    if (serviceToUpdate) {
      // Use the same location value as displayed in the UI (from formatLocation)
      const displayedLocation = formatLocation(serviceToUpdate);
      const updatedService = {
        ...serviceToUpdate,
        addressOnly: displayedLocation, // Set addressOnly to the displayed location
      };
      console.log("Service to Update:", updatedService); // Debug: Log the service data
      navigate("/addService", {
        state: { service: updatedService, isEdit: true },
      });
    } else {
      console.error("Service not found for ID:", svcId);
    }
  };

  const handleDelete = async (svcId) => {
    await dispatch(deleteService(svcId)); // Add your delete logic here (e.g., dispatch a delete action)
    await dispatch(getProviderServices());
  };

  // If user is not a provider, don't render the component (already redirected)
  if (userLoading || !user || user?.type !== "provider") {
    return null; // Optionally render a loading spinner or nothing
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8, bgcolor: "#f5f5f5" }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{
          color: "#000",
          mb: 6,
        }}
      >
        Services Provider
      </Typography>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress sx={{ color: "#ffb800" }} />
        </Box>
      )}

      {/* Error State - Improved UI */}
      {!loading && error && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
            px: 3,
            my: 4,
            borderRadius: "16px",
            backgroundColor: "rgba(244, 67, 54, 0.05)",
            border: "1px solid rgba(244, 67, 54, 0.2)",
            maxWidth: "600px",
            mx: "auto",
            animation: `${fadeIn} 0.5s ease forwards`,
          }}
        >
          <Box
            sx={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <DeleteIcon
              sx={{
                fontSize: "40px",
                color: "#f44336",
              }}
            />
          </Box>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            color="#d32f2f"
            sx={{ mb: 2 }}
          >
            Oops! Something went wrong
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {error || "We couldn't load your services. Please try again later."}
          </Typography>
          <Box
            component="button"
            onClick={() => dispatch(getProviderServices())}
            sx={{
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "30px",
              padding: "10px 24px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f57f17",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            <RefreshIcon sx={{ fontSize: "20px" }} />
            Try Again
          </Box>
        </Box>
      )}

      {/* Success State */}
      {!loading && success && Array.isArray(service?.services) && (
        <Grid container spacing={4}>
          {service.services.map((svc, index) => {
            const locationText = formatLocation(svc);
            const isExpanded = expandedLocations[svc._id];
            const isLongLocation = locationText.length > 30;
            const displayLocation = isExpanded
              ? locationText
              : truncateLocation(locationText);

            return (
              <Grid item xs={12} sm={6} md={4} key={svc._id}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                    bgcolor: "#fff",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    animation: `${fadeIn} 0.5s ease forwards`,
                    animationDelay: `${index * 0.1}s`,
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
                      bgcolor: "#fffde7", // Slight background change on hover
                    },
                    border: "1px solid #ffe082", // Subtle border
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="#ffb800"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      {svc.serviceType} Service
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mb: 1.5,
                        cursor: isLongLocation ? "pointer" : "default",
                      }}
                      onClick={() => isLongLocation && toggleLocation(svc._id)}
                    >
                      <LocationOnIcon
                        sx={{ mr: 1, color: "#ffb800", mt: 0.2 }}
                      />
                      <Box>
                        <strong>Location:</strong> {displayLocation}
                        {isLongLocation && (
                          <Typography
                            component="span"
                            sx={{
                              color: "#ffb800",
                              ml: 1,
                              fontSize: "0.8rem",
                            }}
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </Typography>
                        )}
                      </Box>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                    >
                      <AccessTimeIcon sx={{ mr: 1, color: "#ffb800" }} />
                      <strong>Working Hours:</strong>{" "}
                      {formatWorkingHours(svc.workingHours.from)} -{" "}
                      {formatWorkingHours(svc.workingHours.to)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                    >
                      <CalendarTodayIcon sx={{ mr: 1, color: "#ffb800" }} />
                      <strong>Working Days:</strong>{" "}
                      {svc.workingDays.join(", ")}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, justifyContent: "flex-end" }}>
                    <IconButton
                      onClick={() => handleUpdate(svc._id)}
                      sx={{
                        color: "#ffb800",
                        "&:hover": { color: "#ffca28" },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(svc._id)}
                      sx={{
                        color: "#f44336",
                        "&:hover": { color: "#d32f2f" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Empty State */}
      {!loading &&
        success &&
        (!service?.services || service.services.length === 0) && (
          <Typography textAlign="center" color="text.secondary" sx={{ my: 4 }}>
            No services available at the moment.
          </Typography>
        )}

      {/* Error Snackbar */}
      <Snackbar
        open={errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorMessage(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error || "An error occurred while fetching services."}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ServicesProvider;
