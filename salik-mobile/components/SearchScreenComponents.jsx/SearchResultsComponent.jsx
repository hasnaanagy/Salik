import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons';

const SearchResultsComponent = ({ setDisplayResults, setSelectedRide }) => {
  const { rides, error, loading } = useSelector((state) => state.rideService);

  useEffect(() => {
    console.log("Rerendering with new rides:", rides);
  }, [rides]);

  // Filter rides to include only those with available seats
  const availableRides = rides.filter(ride => ride.totalSeats - ride.bookedSeats > 0);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setDisplayResults(false)} >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFB800" />
          <Text>Loading rides...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}

      {!loading && !error && availableRides.length > 0 && (
        <FlatList
          data={availableRides}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.rideContainer}
              onPress={() => setSelectedRide(item)} // Set the selected ride
            >
              <View style={styles.timeContainer}>
                <View style={styles.yellowCircle} />
                <Text style={styles.rideTime}>
                  {new Date(item.rideDateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <Image source={require("../../assets/car.png")} style={styles.carImage} />
              <View style={styles.detailsContainer}>
                <Text style={styles.rideText}>{item.providerId?.fullName}</Text>
                <Text style={styles.rideDetails}>
                  {item.price} EGP | {item.totalSeats - item.bookedSeats} Seats
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {!loading && !error && availableRides.length === 0 && (
        <View style={styles.noRidesContainer}>
          <Text style={styles.noRidesText}>No rides available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
  },
  errorText: {
    position: "absolute",
    top: "30%",
    color: "#666",
    fontSize: 16,
  },
  rideContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  timeContainer: {
    alignItems: "center",
    marginRight: 10,
    flexDirection: "row",
    gap: 10,
    marginRight: 30,
  },
  yellowCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFB800",
    marginBottom: 4,
  },
  rideTime: {
    fontSize: 14,
    fontWeight: "bold",
  },
  carImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  rideText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rideDetails: {
    fontSize: 14,
    color: "#666",
  },
  noRidesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noRidesText: {
    fontSize: 16,
    color: "#666",
  },
});

export default SearchResultsComponent;