
import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Container,
  Divider,
  Paper,
  InputBase,
  IconButton,
  Badge,
  Tooltip,
  Button,
  Avatar,
  Pagination,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooking,
  fetchProviderRides,
} from "../redux/slices/activitySlice";
import Cards from "./Card";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const ActivityComponent = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRides, setFilteredRides] = useState({
    upcoming: [],
    completed: [],
    canceled: [],
  });
  const [showTabsSidebar, setShowTabsSidebar] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ridesPerPage = 3; // Number of rides per page

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userType = user?.type;

  // Fetch rides based on user type
  const fetchActivity = async () => {
    if (userType === "customer") {
      await dispatch(fetchBooking());
    } else {
      await dispatch(fetchProviderRides());
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [dispatch, userType]);

  // Access state.activity correctly
  const {
    upcoming = [],
    completed = [],
    canceled = [],
    loading,
    error,
  } = useSelector((state) => state.activity);

  // Filter rides based on search term
  useEffect(() => {
    const filterRides = (rides) => {
      if (!searchTerm) return rides;
      return rides.filter(
        (ride) =>
          ride.fromLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ride.toLocation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    setFilteredRides({
      upcoming: filterRides(upcoming),
      completed: filterRides(completed),
      canceled: filterRides(canceled),
    });
  }, [searchTerm, upcoming, completed, canceled]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1); // Reset to the first page when switching tabs
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Get the rides for the current page
  const getPaginatedRides = () => {
    const currentRides =
      activeTab === 0
        ? filteredRides.upcoming
        : activeTab === 1
        ? filteredRides.completed
        : filteredRides.canceled;

    const startIndex = (currentPage - 1) * ridesPerPage;
    const endIndex = startIndex + ridesPerPage;
    return currentRides.slice(startIndex, endIndex);
  };

  // Render content based on active tab
  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5, py: 5 }}>
          <CircularProgress color="warning" />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 3 }}>
          {error}
        </Alert>
      );
    }

    const currentRides =
      activeTab === 0
        ? filteredRides.upcoming
        : activeTab === 1
          ? filteredRides.completed
          : filteredRides.canceled;

    if (currentRides.length === 0) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "rgba(0,0,0,0.02)",
            borderRadius: 2,
            my: 3,
          }}
        >
          <Box sx={{ mb: 2 }}>
            {activeTab === 0 ? (
              <DirectionsCarIcon
                sx={{ fontSize: 60, color: "#FFB800", opacity: 0.7 }}
              />
            ) : activeTab === 1 ? (
              <CheckCircleIcon
                sx={{ fontSize: 60, color: "#2E7D32", opacity: 0.7 }}
              />
            ) : (
              <CancelIcon
                sx={{ fontSize: 60, color: "#F44336", opacity: 0.7 }}
              />
            )}
          </Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No{" "}
            {activeTab === 0
              ? "upcoming"
              : activeTab === 1
                ? "completed"
                : "canceled"}{" "}
            rides found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm
              ? "Try adjusting your search terms"
              : `You don't have any ${activeTab === 0
                ? "upcoming"
                : activeTab === 1
                  ? "completed"
                  : "canceled"
              } rides yet`}
          </Typography>
        </Paper>
      );
    }

    return getPaginatedRides().map((ride) => <Cards key={ride._id} ride={ride} />);
  };

  // Tab colors
  const tabColors = {
    0: "#FFB800", // upcoming
    1: "#5db661", // completed
    2: "#F44336", // canceled
  };

  // Tab icons
  const tabIcons = {
    0: <DirectionsCarIcon />,
    1: <CheckCircleIcon />,
    2: <CancelIcon />,
  };

  // Check if there are no rides at all
  const hasNoRides =
    upcoming.length === 0 && completed.length === 0 && canceled.length === 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          My Rides
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Filter toggle button */}
          <Tooltip title="Filter rides">
            <IconButton
              onClick={() => setShowTabsSidebar(!showTabsSidebar)}
              sx={{
                bgcolor: showTabsSidebar
                  ? "rgba(0,0,0,0.08)"
                  : "rgba(0,0,0,0.04)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
                width: 40,
                height: 40,
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main content area */}
        <Grid item xs={12} md={showTabsSidebar ? 9 : 12}>
          {renderContent()}

          {/* Pagination */}
          {filteredRides[activeTab === 0 ? "upcoming" : activeTab === 1 ? "completed" : "canceled"].length > ridesPerPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={Math.ceil(
                  filteredRides[
                    activeTab === 0
                      ? "upcoming"
                      : activeTab === 1
                      ? "completed"
                      : "canceled"
                  ].length / ridesPerPage
                )}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Grid>

        {/* Right sidebar */}
        {showTabsSidebar && (
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                overflow: "hidden",
                position: "sticky",
                top: 20,
              }}
            >
              <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <Typography variant="h6" fontWeight="bold">
                  Ride Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Filter by ride status
                </Typography>
              </Box>

              {/* Vertical tabs instead of horizontal */}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {["upcoming", "completed", "canceled"].map((status, index) => (
                  <Button
                    key={status}
                    onClick={() => setActiveTab(index)}
                    sx={{
                      py: 2,
                      px: 3,
                      justifyContent: "flex-start",
                      borderRadius: 0,
                      borderLeft:
                        activeTab === index
                          ? `4px solid ${tabColors[index]}`
                          : "4px solid transparent",
                      bgcolor:
                        activeTab === index
                          ? `${tabColors[index]}10`
                          : "transparent",
                      color:
                        activeTab === index
                          ? tabColors[index]
                          : "text.secondary",
                      "&:hover": {
                        bgcolor: `${tabColors[index]}10`,
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            mr: 1.5,
                            bgcolor:
                              activeTab === index
                                ? tabColors[index]
                                : "rgba(0,0,0,0.08)",
                            color:
                              activeTab === index ? "white" : "text.secondary",
                          }}
                        >
                          {tabIcons[index]}
                        </Avatar>
                        <Typography
                          sx={{
                            fontWeight: activeTab === index ? "bold" : "medium",
                            fontSize: "0.9rem",
                            textTransform: "capitalize",
                          }}
                        >
                          {status}
                        </Typography>
                      </Box>
                      <Badge
                        badgeContent={filteredRides[status].length}
                        color={
                          index === 0
                            ? "warning"
                            : index === 1
                              ? "success"
                              : "error"
                        }
                        sx={{
                          "& .MuiBadge-badge": {
                            fontWeight: "bold",
                            minWidth: 20,
                          },
                        }}
                      />
                    </Box>
                  </Button>
                ))}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ActivityComponent;