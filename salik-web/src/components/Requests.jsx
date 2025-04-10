import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllResquestsAction,
  confirmRequestAction,
  updateRequestStateAction,
} from "../redux/slices/requestServiceSlice";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Paper,
  Divider,
  Avatar,
  Tabs,
  Tab,
  Skeleton,
  Badge,
  IconButton,
  Tooltip,
  Collapse,
  Stack,
  colors,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BuildIcon from "@mui/icons-material/Build";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import ReviewModal from "./ReviewsComponents/ReviewModal";
import {
  addReviewsAction,
  getAllReviewsAction,
} from "../redux/slices/reviewsSlice";

const statusColors = {
  pending: "#FFC107",
  accepted: "#2196F3",
  confirmed: "#4CAF50",
  completed: "#673AB7",
};

const statusIcons = {
  pending: <ScheduleIcon />,
  accepted: <CheckCircleIcon />,
  confirmed: <DoneAllIcon />,
  completed: <BuildIcon />,
};

const Requests = ({ userType }) => {
  const dispatch = useDispatch();
  const { requests = {}, isLoading } = useSelector(
    (state) => state.requestSlice || {}
  );
  const { user } = useSelector((state) => state.auth);

  const [selectedProvider, setSelectedProvider] = useState({});
  const [locations, setLocations] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [showStatusFilter, setShowStatusFilter] = useState(() => {
    const saved = localStorage.getItem("showStatusFilter");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    localStorage.setItem("showStatusFilter", JSON.stringify(showStatusFilter));
  }, [showStatusFilter]);

  const statuses = Object.keys(requests);
  const defaultTab =
    statuses.indexOf("pending") !== -1 ? statuses.indexOf("pending") : 0;
  const [activeTab, setActiveTab] = useState(defaultTab);

  const refreshRequests = () => {
    dispatch(getAllResquestsAction());
  };

  useEffect(() => {
    dispatch(getAllResquestsAction());
  }, [dispatch, user]);

  const getAddressFromCoordinates = async (lat, lng, requestId) => {
    try {
      const apiKey = "2d4b78c5799a4d8292da41dce45cadde";
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
      );
      const address = response.data.results[0]?.formatted || "Unknown location";
      setLocations((prev) => ({ ...prev, [requestId]: address }));
    } catch (error) {
      console.error("Error fetching address:", error);
      setLocations((prev) => ({ ...prev, [requestId]: "Location not found" }));
    }
  };

  useEffect(() => {
    Object.entries(requests).forEach(([status, reqList]) => {
      reqList.forEach((req) => {
        if (req.location?.coordinates) {
          const [lng, lat] = req.location.coordinates;
          getAddressFromCoordinates(lat, lng, req._id);
        }
      });
    });
  }, [requests]);

  const handleAcceptRequest = async (requestId) => {
    await dispatch(updateRequestStateAction({ requestId, action: "accept" }));
    dispatch(getAllResquestsAction());
  };

  const handleConfirmProvider = async (requestId) => {
    if (!selectedProvider[requestId]) return;
    await dispatch(
      confirmRequestAction({
        requestId,
        action: "confirm",
        providerId: selectedProvider[requestId],
      })
    );
    dispatch(getAllResquestsAction());
  };

  const handleCompleteRequest = async (requestId) => {
    await dispatch(updateRequestStateAction({ requestId, action: "complete" }));
    dispatch(getAllResquestsAction());
  };

  const handleAddReview = (request) => {
    setSelectedRequest(request);
    setOpenReviewModal(true);
  };

  const handleMarkAsCompletedWithReview = (request) => {
    // First, open the review modal
    handleAddReview(request);
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "N/A", time: "N/A" };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Service Requests
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Loading your service requests...
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card sx={{ borderRadius: "10px", boxShadow: 2 }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={40} />
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={30}
                    sx={{ mt: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={60}
                    sx={{ mt: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={40}
                    sx={{ mt: 2, borderRadius: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (!requests || Object.values(requests).every((arr) => arr.length === 0)) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            bgcolor: "rgba(0,0,0,0.02)",
          }}
        >
          <BuildIcon
            sx={{ fontSize: 60, color: "#FFB800", opacity: 0.7, mb: 2 }}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            No Service Requests Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {user?.type === "customer"
              ? "You haven't made any service requests yet."
              : "There are no service requests available at the moment."}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Service Requests
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Filter by status">
            <IconButton
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              sx={{
                bgcolor: showStatusFilter
                  ? "rgba(0,0,0,0.08)"
                  : "rgba(0,0,0,0.04)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
                width: 40,
                height: 40,
              }}
              aria-label={
                showStatusFilter ? "Hide status filter" : "Show status filter"
              }
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={showStatusFilter ? 9 : 12}>
          <Grid container spacing={3}>
            {requests[statuses[activeTab]]?.map((req) => (
              <Grid item xs={12} sm={6} lg={4} key={req._id}>
                <Card
                  sx={{
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 20px rgba(0,0,0,0.12)",
                    },
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: statusColors[statuses[activeTab]],
                      py: 2,
                      px: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          width: 32,
                          height: 32,
                        }}
                      >
                        {statusIcons[statuses[activeTab]]}
                      </Avatar>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          ml: 1.5,
                          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        }}
                      >
                        {statuses[activeTab].charAt(0).toUpperCase() +
                          statuses[activeTab].slice(1)}
                      </Typography>
                    </Box>
                    <Chip
                      label={req.serviceType}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.25)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.7rem",
                        border: "1px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                  </Box>

                  {req.createdAt && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2.5,
                        py: 1.5,
                        bgcolor: "rgba(0,0,0,0.02)",
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CalendarTodayIcon
                          sx={{ fontSize: 16, color: "text.secondary", mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(req.createdAt).date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTimeIcon
                          sx={{ fontSize: 16, color: "text.secondary", mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(req.createdAt).time}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        p: 2.5,
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,0,0,0.1)",
                          color: "red",
                          mr: 2,
                          width: 40,
                          height: 40,
                        }}
                      >
                        <RoomIcon />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "bold",
                            color: "text.primary",
                            mb: 0.5,
                          }}
                        >
                          Location
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.5,
                            maxWidth: "100%",
                            wordBreak: "break-word",
                          }}
                        >
                          {locations[req._id] || "Fetching location..."}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ p: 2.5 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: "bold",
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <BuildIcon
                          sx={{
                            fontSize: 18,
                            mr: 1,
                            color: statusColors[statuses[activeTab]],
                          }}
                        />
                        Problem Description
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          bgcolor: "rgba(0,0,0,0.02)",
                          borderRadius: 2,
                          border: "1px solid rgba(0,0,0,0.05)",
                          position: "relative",
                          transition: "all 0.3s ease",
                          cursor:
                            req.problemDescription?.length > 80
                              ? "pointer"
                              : "default",
                          "&:hover":
                            req.problemDescription?.length > 80
                              ? { bgcolor: "rgba(0,0,0,0.03)" }
                              : {},
                        }}
                        onClick={() =>
                          req.problemDescription?.length > 80 &&
                          toggleCardExpand(req._id)
                        }
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.6, whiteSpace: "pre-line" }}
                        >
                          {expandedCards[req._id]
                            ? req.problemDescription
                            : truncateText(req.problemDescription, 80)}
                        </Typography>
                        {req.problemDescription?.length > 80 && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: 1,
                              pt: 1,
                              borderTop: expandedCards[req._id]
                                ? "1px solid rgba(0,0,0,0.05)"
                                : "none",
                            }}
                          >
                            <Button
                              size="small"
                              endIcon={
                                expandedCards[req._id] ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              }
                              sx={{
                                textTransform: "none",
                                color: statusColors[statuses[activeTab]],
                                fontWeight: "medium",
                                fontSize: "0.8rem",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCardExpand(req._id);
                              }}
                            >
                              {expandedCards[req._id]
                                ? "Show less"
                                : "Show more"}
                            </Button>
                          </Box>
                        )}
                      </Paper>
                    </Box>

                    {user.type === "customer" &&
                      statuses[activeTab] === "accepted" &&
                      req.acceptedProviders?.length > 0 && (
                        <Box sx={{ px: 2.5, pb: 2.5 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: "bold",
                              mb: 1.5,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <PersonIcon
                              sx={{
                                fontSize: 18,
                                mr: 1,
                                color: statusColors.accepted,
                              }}
                            />
                            Available Providers ({req.acceptedProviders.length})
                          </Typography>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              bgcolor: "rgba(0,0,0,0.02)",
                              borderRadius: 2,
                              border: "1px solid rgba(0,0,0,0.05)",
                            }}
                          >
                            <FormControl fullWidth size="small" sx={{ mb: 0 }}>
                              <InputLabel>Select Provider</InputLabel>
                              <Select
                                value={selectedProvider[req._id] || ""}
                                onChange={(e) =>
                                  setSelectedProvider({
                                    ...selectedProvider,
                                    [req._id]: e.target.value,
                                  })
                                }
                                sx={{
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "rgba(0,0,0,0.1)",
                                  },
                                }}
                              >
                                {req.acceptedProviders.map((provider) => (
                                  <MenuItem
                                    key={provider._id}
                                    value={provider._id}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 28,
                                          height: 28,
                                          mr: 1.5,
                                          bgcolor: statusColors.accepted,
                                        }}
                                      >
                                        <PersonIcon fontSize="small" />
                                      </Avatar>
                                      <Stack direction="column" spacing={0}>
                                        <Typography
                                          variant="body2"
                                          fontWeight="medium"
                                        >
                                          {provider.fullName}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {provider.phone}
                                        </Typography>
                                      </Stack>
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Paper>
                        </Box>
                      )}
                  </CardContent>

                  <Box
                    sx={{
                      p: 2.5,
                      bgcolor: "rgba(0,0,0,0.02)",
                      borderTop: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    {user.type === "provider" &&
                      statuses[activeTab] === "pending" && (
                        <Button
                          variant="contained"
                          startIcon={<CheckCircleIcon />}
                          sx={{
                            bgcolor: statusColors.pending,
                            color: "white",
                            py: 1.2,
                            fontWeight: "bold",
                            boxShadow: "0 4px 8px rgba(255,193,7,0.3)",
                            "&:hover": {
                              bgcolor: "#E6A800",
                              boxShadow: "0 6px 10px rgba(255,193,7,0.4)",
                            },
                          }}
                          fullWidth
                          onClick={() => handleAcceptRequest(req._id)}
                        >
                          Accept Request
                        </Button>
                      )}

                    {user.type === "customer" &&
                      statuses[activeTab] === "accepted" &&
                      req.acceptedProviders?.length > 0 && (
                        <Button
                          variant="contained"
                          startIcon={<CheckCircleIcon />}
                          sx={{
                            bgcolor: statusColors.accepted,
                            py: 1.2,
                            fontWeight: "bold",
                            boxShadow: "0 4px 8px rgba(33,150,243,0.3)",
                            "&:hover": {
                              bgcolor: "#1976D2",
                              boxShadow: "0 6px 10px rgba(33,150,243,0.4)",
                            },
                          }}
                          fullWidth
                          onClick={() => handleConfirmProvider(req._id)}
                          disabled={!selectedProvider[req._id]}
                        >
                          Confirm Provider
                        </Button>
                      )}

                    {user.type === "customer" &&
                      statuses[activeTab] === "confirmed" && (
                        <Button
                          variant="contained"
                          startIcon={<DoneAllIcon />}
                          sx={{
                            bgcolor: statusColors.confirmed,
                            py: 1.2,
                            fontWeight: "bold",
                            boxShadow: "0 4px 8px rgba(76,175,80,0.3)",
                            "&:hover": {
                              bgcolor: "#3D8B40",
                              boxShadow: "0 6px 10px rgba(76,175,80,0.4)",
                            },
                          }}
                          fullWidth
                          onClick={() => handleMarkAsCompletedWithReview(req)}
                        >
                          Mark as Completed
                        </Button>
                      )}

                    {statuses[activeTab] === "completed" && (
                      <Box
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          icon={
                            <DoneAllIcon
                              sx={{
                                color: statusColors.completed || "#673AB7",
                              }}
                            />
                          }
                          label="This request has been completed"
                          sx={{
                            bgcolor: `${statusColors.completed || "#673AB7"}10`,
                            color: statusColors.completed || "#673AB7",
                            fontWeight: "medium",
                            border: `1px solid ${
                              statusColors.completed || "#673AB7"
                            }30`,
                            py: 1,
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {(!requests[statuses[activeTab]] ||
            requests[statuses[activeTab]].length === 0) && (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: "rgba(0,0,0,0.02)",
                border: "1px dashed rgba(0,0,0,0.1)",
              }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: `${statusColors[statuses[activeTab]]}20`,
                  color: statusColors[statuses[activeTab]],
                  mx: "auto",
                  mb: 2,
                }}
              >
                {statusIcons[statuses[activeTab]]}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                No {statuses[activeTab]} requests found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {statuses[activeTab] === "pending"
                  ? "There are no pending requests at the moment."
                  : statuses[activeTab] === "accepted"
                  ? "No requests have been accepted yet."
                  : statuses[activeTab] === "confirmed"
                  ? "No requests have been confirmed yet."
                  : "No requests have been completed yet."}
              </Typography>
              <Button
                variant="outlined"
                onClick={refreshRequests}
                startIcon={<RefreshIcon />}
                sx={{
                  borderColor: statusColors[statuses[activeTab]],
                  color: statusColors[statuses[activeTab]],
                  "&:hover": {
                    borderColor: statusColors[statuses[activeTab]],
                    bgcolor: `${statusColors[statuses[activeTab]]}10`,
                  },
                }}
              >
                Refresh
              </Button>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={3}>
          <Collapse in={showStatusFilter} timeout={300}>
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
                  Request Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Filter by current status
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {statuses.map((status, index) => (
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
                          ? `4px solid ${statusColors[status]}`
                          : "4px solid transparent",
                      bgcolor:
                        activeTab === index
                          ? `${statusColors[status]}10`
                          : "transparent",
                      color:
                        activeTab === index
                          ? statusColors[status]
                          : "text.secondary",
                      "&:hover": { bgcolor: `${statusColors[status]}10` },
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
                                ? statusColors[status]
                                : "rgba(0,0,0,0.08)",
                            color:
                              activeTab === index ? "white" : "text.secondary",
                          }}
                        >
                          {statusIcons[status]}
                        </Avatar>
                        <Typography
                          sx={{
                            fontWeight: activeTab === index ? "bold" : "medium",
                            fontSize: "0.9rem",
                          }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Typography>
                      </Box>
                      <Chip
                        label={requests[status].length}
                        size="small"
                        sx={{
                          bgcolor:
                            activeTab === index
                              ? statusColors[status]
                              : "rgba(0,0,0,0.08)",
                          color:
                            activeTab === index ? "white" : "text.secondary",
                          fontWeight: "bold",
                          minWidth: 28,
                          height: 24,
                        }}
                      />
                    </Box>
                  </Button>
                ))}
              </Box>
            </Paper>
          </Collapse>
        </Grid>
      </Grid>

      {selectedRequest && (
        <ReviewModal
          open={openReviewModal}
          setOpen={(isOpen) => {
            setOpenReviewModal(isOpen);
            if (!isOpen) {
              // When the review modal closes, mark the request as completed
              handleCompleteRequest(selectedRequest._id);
            }
          }}
          providerId={
            selectedRequest.providerId?._id ||
            selectedRequest.acceptedProviders?.[0]?._id
          }
          serviceType={selectedRequest.serviceType}
        />
      )}
    </Container>
  );

  function toggleCardExpand(requestId) {
    setExpandedCards((prev) => ({
      ...prev,
      [requestId]: !prev[requestId],
    }));
  }
};

export default Requests;
