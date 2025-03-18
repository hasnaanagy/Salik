import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const RideDetailesComponent = ({ ride, setSelectedRide }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setSelectedRide(null)}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Ride Details</Text>
      <Text>Provider: {ride.providerId?.fullName}</Text>
      <Text>Time: {new Date(ride.rideDateTime).toLocaleString()}</Text>
      <Text>Price: {ride.price} EGP</Text>
      <Text>Seats: {ride.totalSeats}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
});

export default RideDetailesComponent;