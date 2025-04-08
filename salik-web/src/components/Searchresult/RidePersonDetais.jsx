import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Input,
  CircularProgress,
  Alert,
} from "@mui/joy";
import { Avatar, Box, Stack, useMediaQuery, keyframes } from "@mui/material";
import Badge, { badgeClasses } from "@mui/joy/Badge";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PersonIcon from "@mui/icons-material/Person";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { bookRide } from "../../redux/slices/activitySlice";
import { getAllReviewsAction } from "../../redux/slices/reviewsSlice";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const buttonScale = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

const starPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const DynamicStars = ({ rating, maxRating = 5 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <StarIcon
        key={`full-${i}`}
        sx={{
          color: "#ffb800",
          fontSize: { xs: "20px", sm: "22px" },
          transition: "all 0.2s",
          "&:hover": { animation: `${starPulse} 0.5s ease` },
        }}
      />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <StarHalfIcon
        key="half"
        sx={{
          color: "#ffb800",
          fontSize: { xs: "20px", sm: "22px" },
          transition: "all 0.2s",
          "&:hover": { animation: `${starPulse} 0.5s ease` },
        }}
      />
    );
  }

  const remainingStars = maxRating - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <StarBorderIcon
        key={`empty-${i}`}
        sx={{
          color: "#ffb800",
          fontSize: { xs: "20px", sm: "22px" },
          transition: "all 0.2s",
          "&:hover": { animation: `${starPulse} 0.5s ease` },
        }}
      />
    );
  }

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {stars}
    </Stack>
  );
};

export default function RidePersonDetails({ ride }) {
  if (!ride) {
    return (
      <Typography color="danger" sx={{ textAlign: "center", mt: 4 }}>
        No ride details available
      </Typography>
    );
  }

  const [passengerCount, setPassengerCount] = useState(1);
  const [animateButton, setAnimateButton] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch();

  const {
    loading: bookingLoading,
    error: bookingError,
    successMessage,
  } = useSelector((state) => state.activity);

  const {
    reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useSelector((state) => state.reviewsSlice);

  useEffect(() => {
    console.log("Provider ID:", ride?.providerId?._id);
    if (ride?.providerId?._id) {
      dispatch(getAllReviewsAction({ providerId: ride.providerId._id, serviceType: "ride" }));
    }
  }, [dispatch, ride]);

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const rideReviews = reviews.filter((review) => review.serviceType === "ride");
    if (rideReviews.length === 0) return 0;
    const totalRating = rideReviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    return totalRating / rideReviews.length;
  };

  const averageRating = calculateAverageRating();

  console.log("Ride Details:", ride);
  console.log("Reviews:", reviews);
  console.log("Average Rating:", averageRating);

  const handleBookRide = () => {
    setAnimateButton(true);
    dispatch(bookRide({ rideId: ride._id, counterSeats: passengerCount })).then(
      () => setAnimateButton(false)
    );
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: { xs: 2, md: 0 } }}>
      <Typography
        level="h2"
        sx={{
          fontWeight: "700",
          mb: 3,
          textAlign: { xs: "center", md: "left" },
          fontSize: { xs: "24px", sm: "28px", md: "32px" },
          color: "#333",
        }}
      >
        Confirm Your Ride
      </Typography>

      <Card
        sx={{
          width: "100%",
          p: { xs: 2, md: 3 },
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          animation: `${fadeIn} 0.5s ease-out`,
          background: "linear-gradient(135deg, #fff, #f9f9f9)",
        }}
      >
        <Link state={{ providerId: ride.providerId }} to="/reviews">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              p: 2,
              mt: 1,
              bgcolor: "#fafafa",
              transition: "all 0.3s",
              "&:hover": { bgcolor: "#f0f0f0", transform: "translateY(-2px)" },
            }}
          >
            <Badge
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeInset="14%"
              color="success"
              sx={{
                [`& .${badgeClasses.badge}`]: {
                  "&::after": {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    animation: "ripple 1.2s infinite ease-in-out",
                    border: "2px solid",
                    borderColor: "success.500",
                    content: '""',
                  },
                },
                "@keyframes ripple": {
                  "0%": { transform: "scale(1)", opacity: 1 },
                  "100%": { transform: "scale(2)", opacity: 0 },
                },
              }}
            >
              <Avatar
                alt="Driver"
                src={ride?.providerId?.profileImg || ""}
                sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }}
              />
            </Badge>

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                level="title-md"
                sx={{
                  fontSize: { xs: "16px", sm: "18px", md: "20px" },
                  fontWeight: "600",
                  color: "#444",
                }}
              >
                {ride?.providerId?.fullName
                  ?.toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase()) || "Unknown Driver"}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                {reviewsLoading ? (
                  <Typography sx={{ fontSize: "14px", color: "#666" }}>
                    Loading reviews...
                  </Typography>
                ) : reviewsError ? (
                  <Typography sx={{ fontSize: "14px", color: "#d32f2f" }}>
                    Error loading reviews: {reviewsError}
                  </Typography>
                ) : averageRating > 0 ? (
                  <DynamicStars rating={averageRating} />
                ) : (
                  <Typography
                    sx={{ fontSize: "14px", color: "#666", fontStyle: "italic" }}
                  >
                    No ride reviews yet
                  </Typography>
                )}
              </Box>
            </Box>

            <NavigateNextIcon sx={{ fontSize: isMobile ? "24px" : "28px", color: "#666" }} />
          </Box>
        </Link>

        <Typography
          level="body-md"
          sx={{ mt: 2, fontWeight: "600", fontSize: { xs: "15px", sm: "16px" }, color: "#555" }}
        >
          Car Type: <span style={{ fontWeight: "400" }}>{ride?.carType}</span>
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ mt: 2, bgcolor: "#f5f5f5", p: 1.5, borderRadius: "8px" }}
        >
          <PersonIcon sx={{ color: "#666" }} />
          <Input
            type="number"
            value={passengerCount}
            onChange={(e) =>
              setPassengerCount(Math.max(1, Math.min(ride.totalSeats || 10, Number(e.target.value))))
            }
            slotProps={{ input: { min: 1, max: ride.totalSeats || 10 } }}
            sx={{
              width: 80,
              bgcolor: "#fff",
              borderRadius: "6px",
              fontSize: { xs: "14px", sm: "16px" },
              "& input": { textAlign: "center" },
            }}
            aria-label="Number of passengers"
          />
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            sx={{ fontSize: { xs: "15px", sm: "16px" }, fontWeight: "500", color: "#333" }}
          >
            EGP {ride?.price?.toFixed(2) || "N/A"} $
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 2, p: 1.5, bgcolor: "#f5f5f5", borderRadius: "8px" }}
        >
          <Typography sx={{ fontSize: { xs: "14px", sm: "16px" }, color: "#555" }}>
            Date: {ride?.rideDateTime?.split("T")[0]}
          </Typography>
          <Typography sx={{ fontSize: { xs: "14px", sm: "16px" }, color: "#555" }}>
            Time: {ride?.rideDateTime?.split("T")[1]?.slice(0, 5)}
          </Typography>
        </Stack>

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          justifyContent="center"
          mt={3}
        >
          <Button
            sx={{
              bgcolor: "#ffb800",
              color: "#000",
              width: isMobile ? "100%" : "45%",
              py: 1.5,
              fontWeight: "600",
              fontSize: { xs: "14px", sm: "16px" },
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(255,184,0,0.3)",
              transition: "all 0.2s",
              animation: animateButton ? `${buttonScale} 0.3s ease` : "none",
              "&:hover": {
                bgcolor: "#fff",
                color: "#ffb800",
                boxShadow: "0 6px 16px rgba(255,184,0,0.3)",
                border: "2px solid #ffb800",
              },
              "&:disabled": { bgcolor: "#ffb800", opacity: 0.7, boxShadow: "none" },
            }}
            onClick={handleBookRide}
            disabled={bookingLoading}
            startDecorator={bookingLoading && <CircularProgress size="sm" color="neutral" />}
            aria-label="Book ride"
          >
            {bookingLoading ? "Booking" : "Book Now"}
          </Button>
          <Button
            sx={{
              bgcolor: "#fff",
              color: "#ffb800",
              width: isMobile ? "100%" : "45%",
              py: 1.5,
              fontWeight: "600",
              fontSize: { xs: "14px", sm: "16px" },
              borderRadius: "8px",
              border: "2px solid #ffb800",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "all 0.2s",
              "&:hover": { bgcolor: "#ffb800", color: "#000", boxShadow: "0 6px 16px rgba(255,184,0,0.3)" },
            }}
            aria-label="Call driver"
          >
            Call Driver
          </Button>
        </Stack>

        {bookingError && (
          <Alert variant="soft" color="danger" sx={{ mt: 2, borderRadius: "8px" }}>
            {bookingError}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="soft" color="success" sx={{ mt: 2, borderRadius: "8px" }}>
            {successMessage}
          </Alert>
        )}
      </Card>
    </Box>
  );
}