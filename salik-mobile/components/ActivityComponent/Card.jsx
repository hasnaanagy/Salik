import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelRideAction,
  deleteRideAction,
  fetchBooking,
  fetchProvidedRides,
} from "../../redux/slices/activitySlice";
import { getUser } from "../../redux/slices/authSlice";
import { useRouter } from "expo-router";
import car from "../../assets/car.png";
import appColors from "../../constants/colors";
import { Feather } from "@expo/vector-icons";

// Updated color scheme
const COLORS = {
  upcoming: "#FFB800",
  completed: "#5db661",
  canceled: "#F44336",
  background: "#f8f9fa",
  text: "#333333",
};

const baseColor = appColors.primary;

const Cards = ({ ride }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector((state) => state.auth);
  const [cancelled, setCancelled] = useState(ride.status === "canceled");
  const fadeAnim = new Animated.Value(0);
  // Remove the expanded state since we're removing the click functionality
  const [expanded, setExpanded] = useState(true); // Always show expanded content

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [user, dispatch]);

  const handleCancel = async () => {
    await dispatch(cancelRideAction(ride._id));
    setCancelled(true);
    dispatch(fetchBooking());
  };

  const handleDelete = async () => {
    await dispatch(deleteRideAction(ride._id));
    dispatch(fetchProvidedRides());
  };
  const handleEdit = () => {
    router.push({
      pathname: "addTrip",
      params: {
        ride: JSON.stringify(ride),
      },
    });
  };

  // Safely handle rideDateTime
  let rideTime = "N/A"; // Default value if rideDateTime is missing
  if (ride?.rideDateTime) {
    const rideTimeRaw = ride.rideDateTime.split("T")[1]?.slice(0, 5); // e.g., "06:00"
    if (rideTimeRaw) {
      const [hours, minutes] = rideTimeRaw.split(":");
      const hourNum = parseInt(hours, 10);
      rideTime = `${hourNum % 12 || 12}:${minutes} ${
        hourNum < 12 ? "AM" : "PM"
      }`;
    }
  }

  const handleLocationField = (data) =>
    data?.length > 10 ? ` ${data?.slice(0, 10)}... ` : data;

  // Status icon and color mapping
  const getStatusInfo = () => {
    switch (ride.status) {
      case "upcoming":
        return {
          color: ride.statusColor || COLORS.upcoming,
          icon: "clock",
          label: "Upcoming",
        };
      case "completed":
        return {
          color: ride.statusColor || COLORS.completed,
          icon: "check-circle",
          label: "Completed",
        };
      case "cancelled":
        return {
          color: ride.statusColor || COLORS.canceled,
          icon: "x-circle",
          label: "Canceled",
        };
      default:
        return {
          color: "#9E9E9E",
          icon: "help-circle",
          label: "Unknown",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <View
        style={[styles.status, { backgroundColor: statusInfo.color }]}
      ></View>
      {/* Remove TouchableOpacity onPress and replace with View */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusInfo.color}20` },
            ]}
          >
            <Feather
              name={statusInfo.icon}
              size={14}
              color={statusInfo.color}
            />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>

          {ride.status === "upcoming" && user?.type === "provider" && (
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
                <Feather name="edit" size={18} color={COLORS.upcoming} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={styles.iconButton}
              >
                <Feather name="trash" size={18} color={COLORS.canceled} />
              </TouchableOpacity>
            </View>
          )}

          {/* Remove the expand/collapse chevron icon */}
        </View>

        <View style={styles.cardContent}>
          <Image source={car} style={styles.carImage} />

          <View style={styles.rideDetails}>
            <View style={styles.locationContainer}>
              <Feather
                name="map-pin"
                size={14}
                color={statusInfo.color}
                style={styles.locationIcon}
              />
              <Text style={styles.title}>
                {handleLocationField(ride.fromLocation)} to{" "}
                {handleLocationField(ride.toLocation)}
              </Text>
            </View>

            <View style={styles.dateTimeContainer}>
              <Feather
                name="calendar"
                size={14}
                color={statusInfo.color}
                style={styles.dateTimeIcon}
              />
              <Text style={[styles.rideDate, { color: statusInfo.color }]}>
                {ride?.rideDateTime?.split("T")[0] || "N/A"} | {rideTime}
              </Text>
            </View>

            {/* Always show these details since we're not collapsing anymore */}
            <View style={styles.priceSeatsContainer}>
              <View style={styles.priceContainer}>
                <Feather
                  name="dollar-sign"
                  size={14}
                  color="gray"
                  style={styles.infoIcon}
                />
                <Text style={styles.details}>${ride.price}</Text>
              </View>

              <View style={styles.seatsContainer}>
                <Feather
                  name="users"
                  size={14}
                  color="gray"
                  style={styles.infoIcon}
                />
                <Text style={styles.details}>
                  {user?.type === "customer" ? "Booked: " : "Total: "}
                  {user?.type === "customer"
                    ? ride.bookedSeats
                    : ride.totalSeats}
                </Text>
              </View>
            </View>

            {user?.type === "provider" && (
              <View style={styles.availableSeatsContainer}>
                <Feather
                  name="user-check"
                  size={14}
                  color="gray"
                  style={styles.infoIcon}
                />
                <Text style={styles.details}>
                  Available: {ride.totalSeats - ride.bookedSeats}
                </Text>
              </View>
            )}
          </View>
        </View>

        {ride.status === "upcoming" && user?.type === "customer" && (
          <TouchableOpacity
            disabled={cancelled}
            onPress={handleCancel}
            style={[styles.cancelButton, cancelled && styles.disabledButton]}
          >
            <Feather name="x" size={16} color={cancelled ? "gray" : "white"} />
            <Text style={styles.buttonText}>Cancel Ride</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

// Updated styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  expandIcon: {
    marginLeft: "auto",
    marginRight: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  carImage: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    padding: 5,
  },
  rideDetails: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  locationIcon: {
    marginRight: 5,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateTimeIcon: {
    marginRight: 5,
  },
  priceSeatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seatsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  availableSeatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
  },
  infoIcon: {
    marginRight: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  rideDate: {
    fontSize: 14,
  },
  details: {
    fontSize: 14,
    color: "gray",
  },
  cancelButton: {
    backgroundColor: COLORS.canceled,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 10,
    padding: 5,
  },
  status: {
    width: 15,
    height: 15,
    borderRadius: 7,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default Cards;
