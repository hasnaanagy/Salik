import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import appColors from "../../constants/colors";
import { useDispatch } from "react-redux";
import { bookRideAction, getRideById } from "../../redux/slices/addRideSlice";
import { useNavigation } from "@react-navigation/native";

const RideDetailesComponent = ({ ride, setSelectedRide }) => {
  const [seatsToBook, setSeatsToBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const animation = useSharedValue(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  React.useEffect(() => {
    animation.value = 1;
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withSpring(animation.value),
    transform: [{ translateY: withSpring(animation.value === 1 ? 0 : 50) }],
  }));

  const handleBookRide = async () => {
    setLoading(true);
    await dispatch(bookRideAction({ rideId: ride._id, bookedSeats: parseInt(seatsToBook, 10) }));
    await dispatch(getRideById({ rideId: ride._id }));
    setLoading(false);
    navigation.goBack();
  };

  const handleCallProvider = () => {
    const phoneNumber = ride.providerId.phone;
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Phone call is not supported on this device");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const handleProviderPress = () => {
    navigation.navigate("reviews", { providerId: ride.providerId._id });
  };

  const image = ride?.providerId?.profileImg
    ? { uri: ride.providerId.profileImg }
    : require("../../assets/adaptive-icon.png");

  const availableSeats = ride ? ride.totalSeats - ride.bookedSeats : 0;
  const seatOptions = Array.from({ length: Math.min(availableSeats) }, (_, i) => (i + 1).toString());

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[animatedStyle]}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedRide(null)}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        {/* Header Section */}
        {ride ? (
          <>
            <TouchableOpacity style={styles.header} onPress={handleProviderPress}>
              <Image source={image} style={styles.providerImage} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.providerName}>{ride.providerId.fullName}</Text>
                <Text style={styles.price}>{ride.price} EGP</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={18} color={appColors.primary} />
              <Text style={styles.locationText}>
                {ride.fromLocation} → {ride.toLocation}
              </Text>
            </View>

            {/* Seats Selection */}
            <View style={styles.seatsContainer}>
              <Text style={styles.sectionTitle}>Select Number of Seats:</Text>
              <View style={styles.seatButtons}>
                {seatOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.seatButton,
                      seatsToBook === option && styles.seatButtonSelected,
                    ]}
                    onPress={() => setSeatsToBook(option)}
                  >
                    <Text
                      style={[
                        styles.seatButtonText,
                        seatsToBook === option && styles.seatButtonTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>
                Ride provided by {ride.providerId.fullName}. From {ride.fromLocation} to{" "}
                {ride.toLocation}. This ride offers a comfortable experience with a {ride.carType}.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={handleCallProvider}
                activeOpacity={0.8}
              >
                <Ionicons name="call-outline" size={20} color={appColors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.bookButton,
                  !seatsToBook && styles.disabledButton,
                ]}
                onPress={handleBookRide}
                disabled={!seatsToBook || loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.bookButtonText}>Book Trip Now</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.arrowIcon} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.noRideContainer}>
            <Text style={styles.noRideText}>Ride not found</Text>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  container: {
    // paddingTop: Platform.OS === "ios" ? 0 : 20,
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  providerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  providerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColors.primary,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: appColors.primary,
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  seatsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  seatButtons: {
    flexDirection: "row",
    gap: 10,
  },
  seatButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  seatButtonSelected: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  seatButtonText: {
    fontSize: 16,
    color: "#333",
  },
  seatButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  callButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  bookButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: appColors.primary,
    paddingVertical: 14,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 5,
  },
  arrowIcon: {
    marginLeft: 5,
  },
  noRideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noRideText: {
    fontSize: 16,
    color: "#666",
  },
});

export default RideDetailesComponent;