import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  TextInput,
  Dimensions,
  Image,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useDispatch } from "react-redux";
import {
  sendRequestAction,
  getAllFilterServices,
} from "../../redux/slices/requestServiceSlice";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import CustomText from "../CustomeComponents/CustomText";
import BackButton from "../SharedComponents/BackButton";
import { Linking } from "react-native";

const { width, height } = Dimensions.get("window");

const CustomerRequests = () => {
  const [activeTab, setActiveTab] = useState("fuel");
  const [description, setDescription] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [address, setAddress] = useState(null); // Store reverse geocoded address
  const [addressLoading, setAddressLoading] = useState(false); // Track geocoding
  const [requestMode, setRequestMode] = useState("request");
  const [nearbyProviders, setNearbyProviders] = useState([]);
  const [findingProviders, setFindingProviders] = useState(false);
  const [expandedProviders, setExpandedProviders] = useState([]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const modeAnim = useRef(new Animated.Value(0)).current;
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

        // Perform reverse geocoding
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
    Animated.timing(slideAnim, {
      toValue: tab === "fuel" ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleModeSwitch = (mode) => {
    setRequestMode(mode);
    Animated.timing(modeAnim, {
      toValue: mode === "request" ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setDescription("");
    setNearbyProviders([]);
    setExpandedProviders([]);
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.4],
  });

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
      // Prioritize name (e.g., landmark), then street, city, region, country
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

  // Update the BackButton container and add top margin to the main container
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.backButtonContainer}>
        <BackButton />
      </View>

      <TouchableWithoutFeedback
        onPress={() => {
          if (Keyboard && typeof Keyboard.dismiss === "function") {
            Keyboard.dismiss();
          }
        }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Tab Container */}
            <View style={styles.tabContainer}>
              <Animated.View
                style={[styles.tabBackground, { transform: [{ translateX }] }]}
              />
              <TouchableOpacity
                style={styles.tab}
                onPress={() => handleTabSwitch("fuel")}
              >
                <CustomText
                  style={[
                    styles.tabText,
                    activeTab === "fuel"
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                  ]}
                >
                  Fuel Request
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => handleTabSwitch("mechanic")}
              >
                <CustomText
                  style={[
                    styles.tabText,
                    activeTab === "mechanic"
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                  ]}
                >
                  Mechanic Request
                </CustomText>
              </TouchableOpacity>
            </View>
            {/* Mode Selection Buttons */}
            <View style={styles.modeContainer}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  requestMode === "request" && styles.activeModeButton,
                ]}
                onPress={() => handleModeSwitch("request")}
              >
                <Feather
                  name="send"
                  size={20}
                  color={requestMode === "request" ? "#000" : "#666"}
                  style={styles.modeIcon}
                />
                <CustomText
                  style={[
                    styles.modeButtonText,
                    requestMode === "request" && styles.activeModeText,
                  ]}
                >
                  Send Request
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  requestMode === "find" && styles.activeModeButton,
                ]}
                onPress={() => handleModeSwitch("find")}
              >
                <Feather
                  name="search"
                  size={20}
                  color={requestMode === "find" ? "#000" : "#666"}
                  style={styles.modeIcon}
                />
                <CustomText
                  style={[
                    styles.modeButtonText,
                    requestMode === "find" && styles.activeModeText,
                  ]}
                >
                  Find Provider
                </CustomText>
              </TouchableOpacity>
            </View>

            {/* Conditional Form Rendering */}
            {requestMode === "request" ? (
              <View style={styles.form}>
                <Image
                  source={require("../../assets/help.png")}
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={styles.inputContainer}>
                  <Feather
                    name="file-text"
                    size={24}
                    color="#f5c518"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.formTextArea}
                    placeholder="Describe your problem"
                    placeholderTextColor="#999"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { opacity: locationLoading ? 0.6 : 1 },
                  ]}
                  onPress={handleSubmit}
                  disabled={locationLoading}
                >
                  <Feather
                    name="send"
                    size={20}
                    color="#000"
                    style={styles.buttonIcon}
                  />
                  <CustomText style={styles.buttonText}>
                    Request Service
                  </CustomText>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.findProviderForm}>
                <Image
                  source={require("../../assets/location1.jpg")} // Note: Verify if correct
                  style={styles.locationImage}
                  resizeMode="contain"
                />
                <View style={styles.inputContainer}>
                  <Feather
                    name="map-pin"
                    size={24}
                    color="#f5c518"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.locationInput}
                    placeholder="Current Location"
                    placeholderTextColor="#999"
                    value={getLocationDisplay()}
                    editable={false}
                    textAlignVertical="center"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.findButton,
                    { opacity: locationLoading || findingProviders ? 0.6 : 1 },
                  ]}
                  onPress={handleFindProviders}
                  disabled={findingProviders || locationLoading}
                >
                  {findingProviders ? (
                    <ActivityIndicator
                      size="small"
                      color="#000"
                      style={styles.buttonIcon}
                    />
                  ) : (
                    <Feather
                      name="search"
                      size={20}
                      color="#000"
                      style={styles.buttonIcon}
                    />
                  )}
                  <CustomText style={styles.buttonText}>
                    Find Nearby Providers
                  </CustomText>
                </TouchableOpacity>

                {nearbyProviders.length > 0 ? (
                  <View style={styles.providersContainer}>
                    <CustomText style={styles.providersTitle}>
                      Available Providers
                    </CustomText>
                    {nearbyProviders.map((provider) => {
                      const isExpanded = expandedProviders.includes(
                        provider._id
                      );
                      return (
                        // Update the provider card to have better visual hierarchy
                        <View key={provider._id} style={styles.providerCard}>
                          <View style={styles.providerHeader}>
                            <View style={styles.providerProfile}>
                              <Image
                                source={{ uri: provider.userId?.profileImg }}
                                style={styles.providerImage}
                                defaultSource={require("../../assets/adaptive-icon.png")}
                              />
                              <View style={styles.providerInfo}>
                                <CustomText style={styles.providerName}>
                                  {provider.userId?.fullName || "Unknown"}
                                </CustomText>
                                <View style={styles.serviceTypeContainer}>
                                  <Feather
                                    name={
                                      provider.serviceType === "fuel"
                                        ? "droplet"
                                        : "tool"
                                    }
                                    size={14}
                                    color="#39322b"
                                    style={{ marginRight: 6 }}
                                  />
                                  <CustomText style={styles.serviceType}>
                                    {provider.serviceType
                                      ? `${provider.serviceType} Service`
                                      : "Service"}
                                  </CustomText>
                                </View>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={styles.contactButton}
                              onPress={() =>
                                handleCallProvider(provider.userId?.phone)
                              }
                            >
                              <Feather
                                name="phone"
                                size={16}
                                color="#000"
                                style={styles.contactIcon}
                              />
                              <CustomText style={styles.contactText}>
                                Call
                              </CustomText>
                            </TouchableOpacity>
                          </View>

                          <View style={styles.divider} />

                          <TouchableOpacity
                            style={[
                              styles.availabilityContainer,
                              {
                                backgroundColor: isExpanded
                                  ? "#f8f9fa"
                                  : "transparent",
                                borderRadius: 12,
                                padding: 6,
                              },
                            ]}
                            onPress={() => toggleProviderExpanded(provider._id)}
                          >
                            <Feather
                              name="calendar"
                              size={16}
                              color="#6c757d"
                            />
                            <CustomText style={styles.availabilityText}>
                              Available:
                            </CustomText>
                            {isExpanded ? (
                              <View style={styles.expandedDaysContainer}>
                                {(provider.workingDays || []).map(
                                  (day, index) => (
                                    <View key={index} style={styles.dayBadge}>
                                      <CustomText style={styles.dayBadgeText}>
                                        {day}
                                      </CustomText>
                                    </View>
                                  )
                                )}
                              </View>
                            ) : (
                              <View style={styles.collapsedDaysContainer}>
                                <CustomText style={styles.availabilityDays}>
                                  {(provider.workingDays || [])
                                    .slice(0, 3)
                                    .join(", ")}
                                  {(provider.workingDays || []).length > 3 &&
                                    ` +${
                                      (provider.workingDays || []).length - 3
                                    } more`}
                                </CustomText>
                                <Feather
                                  name="chevron-down"
                                  size={16}
                                  color="#6c757d"
                                  style={styles.expandIcon}
                                />
                              </View>
                            )}
                          </TouchableOpacity>

                          <View style={styles.workingHoursContainer}>
                            <Feather
                              name="clock"
                              size={16}
                              color="#6c757d"
                              style={styles.hoursIcon}
                            />
                            <CustomText style={styles.workingHours}>
                              Hours: {formatTime(provider.workingHours?.from)} -{" "}
                              {formatTime(provider.workingHours?.to)}
                            </CustomText>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>
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
    paddingTop: Platform.OS === "ios" ? 60 : 40, // Add padding to account for BackButton
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
  },
  modeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.025,
    borderRadius: 16,
    backgroundColor: "#e9ecef",
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.015,
    marginHorizontal: width * 0.01,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  activeModeButton: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  modeButtonText: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#6c757d",
  },
  activeModeText: {
    color: "#212529",
  },
  modeIcon: {
    marginRight: width * 0.02,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    borderRadius: 30,
    width: width * 0.8,
    height: height * 0.07,
    position: "relative",
    overflow: "hidden",
    marginBottom: height * 0.03,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBackground: {
    position: "absolute",
    backgroundColor: "#f5c518",
    width: width * 0.4,
    height: "100%",
    borderRadius: 30,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  tabText: {
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#000",
  },
  inactiveTabText: {
    color: "#495057",
  },
  form: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: width * 0.05,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  findProviderForm: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: width * 0.05,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: height * 0.02,
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 15,
    zIndex: 1,
  },
  formTextArea: {
    flex: 1,
    padding: width * 0.04,
    paddingLeft: width * 0.12,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 16,
    fontSize: width * 0.04,
    color: "#212529",
    backgroundColor: "#f8f9fa",
    height: height * 0.15,
    textAlignVertical: "top",
  },
  locationInput: {
    flex: 1,
    padding: width * 0.04,
    paddingLeft: width * 0.12,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 16,
    fontSize: width * 0.04,
    color: "#212529",
    backgroundColor: "#e9ecef",
    height: height * 0.06,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.6,
    backgroundColor: "#f5c518",
    paddingVertical: height * 0.018,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: height * 0.02,
  },
  findButton: {
    width: width * 0.7,
  },
  buttonText: {
    color: "#000",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: width * 0.02,
  },
  imageStyle: {
    width: width * 0.5,
    height: height * 0.2,
    marginBottom: height * 0.03,
  },
  locationImage: {
    width: width * 0.4,
    height: height * 0.15,
    marginBottom: height * 0.03,
  },
  providersContainer: {
    width: "100%",
    marginTop: height * 0.03,
  },
  providersTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  providerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: width * 0.04,
    marginVertical: height * 0.012,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  providerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.015,
  },
  providerProfile: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  providerImage: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    marginRight: width * 0.03,
    borderWidth: 2,
    borderColor: "#f5c518",
  },
  providerInfo: {
    justifyContent: "center",
    flex: 1,
  },
  providerName: {
    fontSize: width * 0.042,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 6,
  },
  serviceTypeContainer: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  serviceType: {
    fontSize: width * 0.032,
    color: "#F57C00",
    textTransform: "capitalize",
    fontWeight: "500",
  },
  contactButton: {
    backgroundColor: "#f5c518",
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.012,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  contactIcon: {
    marginRight: width * 0.01,
  },
  contactText: {
    color: "#000",
    fontSize: width * 0.035,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: height * 0.015,
    width: "100%",
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: height * 0.012,
    paddingVertical: 6,
  },
  availabilityText: {
    fontSize: width * 0.035,
    color: "#495057",
    marginLeft: width * 0.02,
    marginRight: width * 0.01,
    fontWeight: "500",
  },
  collapsedDaysContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  availabilityDays: {
    fontSize: width * 0.035,
    color: "#6c757d",
  },
  expandedDaysContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 4,
  },
  dayBadge: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  dayBadgeText: {
    fontSize: width * 0.032,
    color: "#495057",
    fontWeight: "500",
  },
  expandIcon: {
    marginLeft: 4,
  },
  workingHoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  hoursIcon: {
    marginRight: width * 0.02,
    color: "#6c757d",
  },
  workingHours: {
    fontSize: width * 0.035,
    color: "#495057",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    marginTop: height * 0.05,
    padding: height * 0.03,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
    width: "100%",
  },
  emptyStateText: {
    fontSize: width * 0.04,
    color: "#6c757d",
    marginTop: height * 0.02,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default CustomerRequests;
