import React, { useState } from "react";
import {
  View, Text, Image, StyleSheet, TouchableOpacity
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelRideAction,
  deleteRideAction,
  fetchBooking,
  fetchProvidedRides,
} from "../../redux/slices/activitySlice";
import { useRouter } from "expo-router";
import car from "../../assets/car.png";
import appColors from "../../constants/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
const baseColor = appColors.primary;

const Cards = ({ ride }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [cancelled, setCancelled] = useState(ride.status === "canceled");

  const handleCancel = async () => {
    await dispatch(cancelRideAction(ride._id));
    setCancelled(true);
    dispatch(fetchBooking());
  };

  const handleDelete = async () => {
    await dispatch(deleteRideAction(ride._id));
    dispatch(fetchProvidedRides());
  };

  const rideDate = ride?.rideDateTime?.split("T")[0];
  const rideTime = ride?.rideDateTime?.split("T")[1]?.slice(0, 5);

  const handleLocationField = (data) =>
    data?.length > 13 ? `${data?.slice(0, 13)}...` : data;

  const rideColor =
    ride.status === "upcoming" ? baseColor
      : ride.status === "completed" ? "#4C585B"
        : "#F44336";

  return (
    <View style={styles.container}>
      {/* Ride Date and Time */}
      <View style={styles.dateTimeContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: rideColor }]} />
        <Text style={styles.dateText}> {rideTime}</Text>
      </View>
      {/* {rideDate} */}
      {/* Ride Card */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image source={car} style={styles.carImage} />

          <View style={styles.rideDetails}>
            <Text style={styles.title}>
              {handleLocationField(ride.fromLocation)} to {handleLocationField(ride.toLocation)}
            </Text>
            <Text style={styles.details}>
              Price: ${ride.price} | {user?.type === "customer" ? "Booked Seats:" : "Total Seats:"}{" "}
              {user?.type === "customer" ? ride.bookedSeats : ride.totalSeats}
            </Text>
            {user?.type === "provider" && (
              <Text style={styles.details}>
                Available Seats: {ride.totalSeats - ride.bookedSeats}
              </Text>
            )}
          </View>

          {/* Cancel Button (for customers) */}
          {ride.status === "upcoming" && user?.type === "customer" && (
            <TouchableOpacity
              disabled={cancelled}
              onPress={handleCancel}
              style={[styles.button, cancelled && styles.disabledButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {/* Edit & Delete Buttons (for providers) */}
          {ride.status === "upcoming" && user?.type === "provider" && (
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => router.push("addTrip", { rideId: ride._id })}
                style={styles.iconButton}
              >
                <FontAwesome name="pencil-square" size={25} color="grey" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                <FontAwesome name="trash" size={25} color="red" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  dateText: {
    color: "gray",
    fontSize: 14,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  carImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  rideDetails: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "gray",
  },
  button: {
    backgroundColor: baseColor,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  iconContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 10,
  },
  iconButton: {
    marginLeft: 5,
    padding: 5,
  },
  editIcon: {
    fontSize: 20,
    color: baseColor,
  },
  deleteIcon: {
    fontSize: 20,
    color: "#F44336",
  },
});

export default Cards;