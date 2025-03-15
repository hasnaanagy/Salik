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

const SearchResultsComponent = ({ setDisplayResults }) => {
  const { rides, error, loading } = useSelector((state) => state.rideService);

  useEffect(() => {
    console.log("Rerendering with new rides:", rides);
  }, [rides]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB800" />
        <Text>Loading rides...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}> Error loading rides</Text>
      </View>
    );
  }

  if (rides.length === 0) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>No rides found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() =>setDisplayResults(false)}>
           <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <FlatList
        data={rides}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.rideContainer}
            onPress={() => console.log(" Ride selected:", item)}
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
                {item.price} EGP | {item.totalSeats} Seats
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
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
});

export default SearchResultsComponent;
