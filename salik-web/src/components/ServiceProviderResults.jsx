import React from "react";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { Avatar, Box, Stack, keyframes, Chip, Tooltip } from "@mui/material";
import Divider from "@mui/joy/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert } from "@mui/joy";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import BuildIcon from "@mui/icons-material/Build";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarIcon from "@mui/icons-material/Star";
import Button from "@mui/material/Button";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Rating from "@mui/material/Rating";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useState } from "react";

// Animation keyframes
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const buttonHover = keyframes`
  0% { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  100% { transform: scale(1.03); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
`;

// Function to get icon based on service type
const getServiceIcon = (serviceType) => {
  return serviceType === "mechanic" ? (
    <BuildIcon sx={{ color: "#FFB800", fontSize: 24 }} />
  ) : (
    <LocalGasStationIcon sx={{ color: "#FFB800", fontSize: 24 }} />
  );
};

// Function to get day abbreviation
const getDayAbbreviation = (day) => {
  const abbreviations = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };
  return abbreviations[day] || day.substring(0, 3);
};

export function ServiceProviderResults({
  loading,
  error,
  services,
  onSelectProvider,
}) {
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const handleOpenReviewDialog = (e, provider) => {
    e.stopPropagation();
    setSelectedProvider(provider);
    setReviewRating(0);
    setReviewComment("");
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setSelectedProvider(null);
  };

  const handleSubmitReview = () => {
    // Here you would implement the API call to submit the review
    console.log("Submitting review:", {
      providerId: selectedProvider?._id,
      rating: reviewRating,
      comment: reviewComment,
    });

    // Close the dialog after submission
    handleCloseReviewDialog();

    // Show success message (you can implement a toast notification here)
    alert("Thank you for your review!");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress size={40} sx={{ color: "#FFB800" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        variant="soft"
        color="danger"
        sx={{
          mb: 2,
          fontWeight: "600",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        startDecorator={<ErrorOutlineIcon sx={{ color: "#d32f2f" }} />}
      >
        {error}
      </Alert>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Alert
        variant="soft"
        color="warning"
        sx={{
          mb: 2,
          fontWeight: "600",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        No service providers found in your area.
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 1, md: 2 } }}>
      <Typography
        level="h2"
        sx={{
          mb: 3,
          fontWeight: "700",
          textAlign: { xs: "center", md: "left" },
          fontSize: { xs: "24px", sm: "28px", md: "32px" },
          color: "#333",
          letterSpacing: "0.5px",
        }}
      >
        Nearby Service Providers
      </Typography>

      <Box sx={{ mb: 4 }}>
        {services.map((provider, index) => (
          <Box
            key={provider._id}
            sx={{
              mb: 2,
              animation: `${fadeInUp} 0.5s ease-out forwards`,
              animationDelay: `${index * 0.1}s`,
              cursor: "pointer",
            }}
            // onClick={() => onSelectProvider && onSelectProvider(provider)}
          >
            <Card
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                width: "100%",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "1px solid #e0e0e0",
                bgcolor: "#fff",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  borderColor: "#FFB800",
                  transform: "translateY(-2px)",
                },
                p: { xs: 2, sm: 2.5 },
                gap: { xs: 2, sm: 0 },
              }}
            >
              {/* Left Section: Avatar, Name, Service Type, Rating */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                flexGrow={1}
                width="100%"
              >
                {/* Avatar */}
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    justifyContent: { xs: "space-between", sm: "flex-start" },
                  }}
                >
                  <Avatar
                    src={provider.userId?.profileImg}
                    sx={{
                      width: { xs: 56, md: 64 },
                      height: { xs: 56, md: 64 },
                      border: "2px solid #fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      bgcolor:
                        provider.serviceType === "mechanic"
                          ? "#e3f2fd"
                          : "#fff3e0",
                    }}
                  >
                    {getServiceIcon(provider.serviceType)}
                  </Avatar>
                </Stack>

                {/* Provider Info */}
                <Box flexGrow={1} width={{ xs: "100%", sm: "auto" }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 0.5, sm: 1 }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    mb={{ xs: 1, sm: 0 }}
                  >
                    <Typography
                      level="title-md"
                      sx={{
                        fontSize: { xs: "18px", md: "20px" },
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {provider.userId?.fullName || "Service Provider"}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Chip
                        icon={
                          provider.serviceType === "mechanic" ? (
                            <BuildIcon fontSize="small" />
                          ) : (
                            <LocalGasStationIcon fontSize="small" />
                          )
                        }
                        label={
                          provider.serviceType === "mechanic"
                            ? "Mechanic"
                            : "Fuel Service"
                        }
                        size="small"
                        sx={{
                          bgcolor:
                            provider.serviceType === "mechanic"
                              ? "#e3f2fd"
                              : "#fff3e0",
                          color:
                            provider.serviceType === "mechanic"
                              ? "#0277bd"
                              : "#e65100",
                          fontWeight: "500",
                          borderRadius: "6px",
                          fontSize: "12px",
                        }}
                      />
                      {provider.rating && (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <StarIcon
                            sx={{ color: "#FFB800", fontSize: "16px" }}
                          />
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "#555",
                            }}
                          >
                            {provider.rating}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>

                  {/* Working Days */}
                  {provider.workingDays && provider.workingDays.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mt={0.5}
                      sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}
                    >
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarMonthIcon
                          sx={{ color: "#757575", fontSize: "16px" }}
                        />
                        <Typography
                          level="body-sm"
                          sx={{
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#555",
                            display: { xs: "none", sm: "block" },
                          }}
                        >
                          Available:
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{
                          flexWrap: "wrap",
                          gap: "4px",
                          mt: { xs: 0.5, sm: 0 },
                        }}
                      >
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <Tooltip key={day} title={day} arrow>
                            <Chip
                              label={getDayAbbreviation(day)}
                              size="small"
                              sx={{
                                bgcolor: provider.workingDays.includes(day)
                                  ? "#f0f7ff"
                                  : "#f5f5f5",
                                color: provider.workingDays.includes(day)
                                  ? "#0277bd"
                                  : "#9e9e9e",
                                fontWeight: provider.workingDays.includes(day)
                                  ? "500"
                                  : "400",
                                opacity: provider.workingDays.includes(day)
                                  ? 1
                                  : 0.6,
                                fontSize: "11px",
                                height: "20px",
                              }}
                            />
                          </Tooltip>
                        ))}
                      </Stack>
                    </Stack>
                  )}
                </Box>
              </Stack>

              {/* Right Section: Buttons */}
              <Stack
                direction={{ xs: "row", sm: "row" }}
                spacing={1}
                alignItems="center"
                justifyContent={{ xs: "space-between", sm: "flex-end" }}
                width={{ xs: "100%", sm: "auto" }}
                mt={{ xs: 1, sm: 0 }}
              >
                {provider.userId?.phone && (
                  <Tooltip title={`Call ${provider.userId.phone}`} arrow>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PhoneIcon />}
                      sx={{
                        borderRadius: "8px",
                        borderColor: "#FFB800",
                        color: "#333",
                        fontSize: "12px",
                        fontWeight: "500",
                        px: 1.5,
                        py: 0.5,
                        "&:hover": {
                          borderColor: "#e6a700",
                          bgcolor: "#fff9e6",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${provider.userId.phone}`;
                      }}
                      aria-label={`Call ${provider.userId?.fullName}`}
                    >
                      Contact
                    </Button>
                  </Tooltip>
                )}

                <Tooltip title="Add Review" arrow>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<RateReviewIcon />}
                    sx={{
                      borderRadius: "8px",
                      bgcolor: "#FFB800",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "600",
                      px: 2,
                      py: 0.5,
                      "&:hover": {
                        bgcolor: "#e6a700",
                      },
                    }}
                    onClick={(e) => handleOpenReviewDialog(e, provider)}
                  >
                    Review
                  </Button>
                </Tooltip>
              </Stack>
            </Card>
          </Box>
        ))}
        <Divider sx={{ my: 2, borderColor: "#ddd" }} />
      </Box>

      {/* Review Dialog */}
      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: "600",
            fontSize: "1.2rem",
            bgcolor: "#f8f8f8",
            borderBottom: "1px solid #eee",
          }}
        >
          Review {selectedProvider?.userId?.fullName || "Service Provider"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <Stack spacing={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography level="body-md" sx={{ mb: 1, color: "#555" }}>
                How would you rate this service provider?
              </Typography>
              <Rating
                name="review-rating"
                value={reviewRating}
                onChange={(event, newValue) => {
                  setReviewRating(newValue);
                }}
                size="large"
                sx={{
                  color: "#FFB800",
                  "& .MuiRating-iconEmpty": {
                    color: "#ccc",
                  },
                }}
              />
            </Box>
            <TextField
              label="Your Review"
              multiline
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Share your experience with this service provider..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#FFB800",
                  },
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{ px: 3, py: 2, bgcolor: "#f8f8f8", borderTop: "1px solid #eee" }}
        >
          <Button
            onClick={handleCloseReviewDialog}
            variant="outlined"
            sx={{
              color: "#555",
              borderColor: "#ccc",
              "&:hover": {
                borderColor: "#999",
                bgcolor: "#f5f5f5",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={reviewRating === 0}
            sx={{
              bgcolor: "#FFB800",
              color: "#fff",
              "&:hover": {
                bgcolor: "#e6a700",
              },
              "&.Mui-disabled": {
                bgcolor: "#f5f5f5",
                color: "#999",
              },
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
