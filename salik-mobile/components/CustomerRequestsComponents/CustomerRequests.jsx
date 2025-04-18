import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useDispatch } from "react-redux";
import {
  sendRequestAction,
  getAllFilterServices,
} from "../../redux/slices/requestServiceSlice";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import BackButton from "../SharedComponents/BackButton";
import { Linking } from "react-native";
import TabSelector from "./TabSelector";
import ModeSelector from "./ModeSelector";
import RequestForm from "./RequestForm";
import FindProviderForm from "./FindProviderForm";
import ProviderList from "./ProviderList";

const { width, height } = Dimensions.get("window");

const CustomerRequests = () => {
  const [activeTab, setActiveTab] = useState("fuel");
  const [description, setDescription] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [requestMode, setRequestMode] = useState("request");
  const [nearbyProviders, setNearbyProviders] = useState([]);
  const [findingProviders, setFindingProviders] = useState(false);
  const [expandedProviders, setExpandedProviders] = useState([]);
  const [isSearchStarted, setIsSearchStarted] = useState(false); // Add this line
  const slideAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to proceed."
          );
          setLocationLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(coords);
        setLocationLoading(false);

        setAddressLoading(true);
        try {
          const [geocode] = await Location.reverseGeocodeAsync(coords);
          setAddress(geocode || {});
        } catch (error) {
          console.warn("Reverse geocoding failed:", error.message);
          setAddress({});
        }
        setAddressLoading(false);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch location: " + error.message);
        setLocationLoading(false);
        setAddressLoading(false);
      }
    })();
  }, []);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleModeSwitch = (mode) => {
    setRequestMode(mode);
    setDescription("");
    setNearbyProviders([]);
    setExpandedProviders([]);
  };

  const handleSubmit = async () => {
    if (!userLocation) {
      Alert.alert("Error", "Location not available. Please try again.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please describe your problem.");
      return;
    }

    try {
      const serviceType = activeTab === "fuel" ? "fuel" : "mechanic";
      const locationData = {
        type: "Point",
        coordinates: [userLocation.longitude, userLocation.latitude],
      };

      await dispatch(
        sendRequestAction({
          serviceType,
          location: locationData,
          problem: description,
        })
      ).unwrap();

      Alert.alert("Success", "Request sent successfully!");
      setDescription("");
      router.push("/requests");
    } catch (error) {
      Alert.alert("Error", "Failed to submit request: " + error.message);
    }
  };

  const handleFindProviders = async () => {
    if (!userLocation) {
      Alert.alert("Error", "Location not available. Please try again.");
      return;
    }

    setFindingProviders(true);
    setIsSearchStarted(true); // Add this line to hide other components
    try {
      const result = await dispatch(
        getAllFilterServices({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          serviceType: activeTab,
        })
      ).unwrap();
      setNearbyProviders(result || []);
      if (!result || result.length === 0) {
        Alert.alert(
          "No Providers",
          "No nearby providers found for this service."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to find providers: " + error.message);
    } finally {
      setFindingProviders(false);
    }
  };

  const handleCallProvider = (phone) => {
    if (!phone) {
      Alert.alert("Error", "Provider phone number not available.");
      return;
    }
    Linking.openURL(`tel:${phone}`).catch((err) =>
      Alert.alert("Error", "Unable to make call: " + err.message)
    );
  };

  const toggleProviderExpanded = (providerId) => {
    setExpandedProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  };
  const handleBackToSearch = () => {
    setIsSearchStarted(false);
    setNearbyProviders([]);
  };
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getLocationDisplay = () => {
    if (locationLoading) return "Fetching location...";
    if (!userLocation) return "Location unavailable";
    if (addressLoading) return "Loading address...";
    if (address) {
      const { street, city, region, country, name } = address;
      const parts = [
        name && name !== street ? name : street,
        city || region,
        country,
      ].filter(Boolean);
      return parts.length > 0
        ? parts.join(", ")
        : `${userLocation.latitude.toFixed(
            6
          )}, ${userLocation.longitude.toFixed(6)}`;
    }
    return `${userLocation.latitude.toFixed(
      6
    )}, ${userLocation.longitude.toFixed(6)}`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.backButtonContainer}>
        <BackButton />
      </View>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {!isSearchStarted && (
              <ModeSelector
                requestMode={requestMode}
                handleModeSwitch={handleModeSwitch}
              />
            )}
            {!isSearchStarted && (
              <TabSelector
                activeTab={activeTab}
                handleTabSwitch={handleTabSwitch}
              />
            )}
            {requestMode === "request" ? (
              <RequestForm
                description={description}
                setDescription={setDescription}
                handleSubmit={handleSubmit}
                locationLoading={locationLoading}
              />
            ) : (
              <>
                {!isSearchStarted && (
                  <FindProviderForm
                    getLocationDisplay={getLocationDisplay}
                    handleFindProviders={handleFindProviders}
                    locationLoading={locationLoading}
                    findingProviders={findingProviders}
                  />
                )}
                {isSearchStarted && (
                  <ProviderList
                    nearbyProviders={nearbyProviders}
                    expandedProviders={expandedProviders}
                    toggleProviderExpanded={toggleProviderExpanded}
                    handleCallProvider={handleCallProvider}
                    formatTime={formatTime}
                    onBackToSearch={handleBackToSearch}
                  />
                )}
              </>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? -30 : -30,
    left: 5,
    zIndex: 999,
    marginTop: Platform.OS === "ios" ? 40 : 10,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
  },
});

export default CustomerRequests;
