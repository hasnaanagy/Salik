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

const baseColor = appColors.primary;

const Cards = ({ ride }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector((state) => state.auth);
  const [cancelled, setCancelled] = useState(ride.status === "canceled");
  const fadeAnim = new Animated.Value(0);

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
  const rideTime = ride?.rideDateTime?.split("T")[1]?.slice(0, 5);
  const handleLocationField = (data) =>
    data?.length > 10 ? ` ${data?.slice(0, 10)}... ` : data;

  const rideColor =
    ride.status === "upcoming"
      ? baseColor
      : ride.status === "completed"
      ? "#4C585B"
      : "#F44336";

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <View style={[styles.status, { backgroundColor: rideColor }]}></View>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image source={car} style={styles.carImage} />

          <View style={styles.rideDetails}>
            <Text style={styles.title}>
              {handleLocationField(ride.fromLocation)} to{" "}
              {handleLocationField(ride.toLocation)}
            </Text>

            {/* Ride Date Section */}
            <Text style={styles.rideDate}>
              {ride?.rideDateTime?.split("T")[0]} | {rideTime}
            </Text>

            <Text style={styles.details}>
              Price: ${ride.price} |{" "}
              {user?.type === "customer" ? "Booked Seats:" : "Total Seats:"}{" "}
              {user?.type === "customer" ? ride.bookedSeats : ride.totalSeats}
            </Text>
            {user?.type === "provider" && (
              <Text style={styles.details}>
                Available Seats: {ride.totalSeats - ride.bookedSeats}
              </Text>
            )}
          </View>

          {ride.status === "upcoming" && user?.type === "customer" && (
            <TouchableOpacity
              disabled={cancelled}
              onPress={handleCancel}
              style={[styles.button, cancelled && styles.disabledButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {ride.status === "upcoming" && user?.type === "provider" && (
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => handleEdit()}
                style={styles.iconButton}
              >
                <Feather name="edit" size={18} color="black" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={styles.iconButton}
              >
                <Feather name="trash" size={18} color="#F44336" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
  rideDate: {
    fontSize: 14,
    color: appColors.primary,
    marginBottom: 5,
    marginTop: 5,
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
    color: "black",
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
