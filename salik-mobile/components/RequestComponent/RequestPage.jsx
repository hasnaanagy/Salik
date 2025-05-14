import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import {
  getAllResquestsAction,
  confirmRequestAction,
  updateRequestStateAction,
} from "../../redux/slices/requestServiceSlice";
import { getAllReviewsAction } from "../../redux/slices/reviewsSlice";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Animated,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import appColors from "../../constants/colors";
import AddRate from "../ReviewsComponents/addRate";

const statusColors = {
  pending: "#FFC107",
  accepted: "#2196F3",
  confirmed: "#4CAF50",
  completed: "#673AB7",
};
const baseColor = appColors.primary;

const statusIcons = {
  pending: "clock",
  accepted: "user-check",
  confirmed: "check-circle",
  completed: "award",
};

const emptyStateMessages = {
  pending: "No pending requests found",
  accepted: "No accepted requests found",
  confirmed: "No confirmed requests found",
  completed: "No completed requests found",
};

const RequestPage = () => {
  const dispatch = useDispatch();
  const { requests = {}, isLoading } = useSelector(
    (state) => state.requestSlice || {}
  );

  const [providerRatings, setProviderRatings] = useState({}); // { providerId: { serviceType: rating } }
  const [selectedProvider, setSelectedProvider] = useState({});
  const [locations, setLocations] = useState({});
  const [userType, setUserType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("pending");
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState({});
  const [dropdownAnimation] = useState(new Animated.Value(0));
  const [isAddRateVisible, setIsAddRateVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  useFocusEffect(
    useCallback(() => {
      dispatch(getAllResquestsAction()).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          updateLocations(result.payload);
        }
      });
    }, [dispatch])
  );
  const toggleFilterBox = () => {
    if (showFilterBox) {
      Animated.parallel([
        Animated.timing(filterBoxOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(filterBoxScale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShowFilterBox(false));
    } else {
      setShowFilterBox(true);
      Animated.parallel([
        Animated.timing(filterBoxOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(filterBoxScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const filterBoxOpacity = useState(new Animated.Value(0))[0];
  const filterBoxScale = useState(new Animated.Value(0.8))[0];

  const toggleDropdown = (requestId) => {
    if (dropdownVisible[requestId]) {
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setDropdownVisible((prev) => ({ ...prev, [requestId]: false }));
      });
    } else {
      setDropdownVisible((prev) => ({ ...prev, [requestId]: true }));
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const selectProvider = (requestId, providerId) => {
    setSelectedProvider((prev) => ({ ...prev, [requestId]: providerId }));
    toggleDropdown(requestId);
  };

  const fetchUserType = async () => {
    try {
      const storedUserType = await AsyncStorage.getItem("userType");
      if (storedUserType) {
        setUserType(JSON.parse(storedUserType));
      }
    } catch (error) {
      console.error("Error fetching user type:", error);
    }
  };

  const fetchLocationName = async (coords) => {
    if (!coords || !Array.isArray(coords) || coords.length !== 2) {
      console.warn("Invalid coordinates:", coords);
      return "Invalid location";
    }

    const lat = coords[1];
    const lng = coords[0];
    const apiKey = "2d4b78c5799a4d8292da41dce45cadde";

    try {
      const cacheKey = `location_${lat}_${lng}`;
      const cachedLocation = await AsyncStorage.getItem(cacheKey);
      if (cachedLocation) {
        console.log(
          `Using cached location for ${lat}, ${lng}: ${cachedLocation}`
        );
        return cachedLocation;
      }

      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=en&pretty=1`
      );
      const address = response.data.results[0]?.formatted || `${lat}, ${lng}`;
      console.log(`Geocoded ${lat}, ${lng} to: ${address}`);

      await AsyncStorage.setItem(cacheKey, address);
      return address;
    } catch (error) {
      console.error("Geocoding error:", error);
      return `${lat}, ${lng}`;
    }
  };

  const updateLocations = async (reqs) => {
    const newLocations = { ...locations };
    for (const reqList of Object.values(reqs)) {
      for (const req of reqList) {
        if (req.location?.coordinates && !newLocations[req._id]) {
          newLocations[req._id] = await fetchLocationName(
            req.location.coordinates
          );
        }
      }
    }
    setLocations(newLocations);
  };

  const fetchProviderRatings = async (providers, serviceType) => {
    if (!providers || !Array.isArray(providers)) return {};

    const ratings = {};
    for (const provider of providers) {
      if (!provider?._id) continue;

      try {
        const result = await dispatch(
          getAllReviewsAction({
            providerId: provider._id,
            serviceType, // Fuel or Mechanic
          })
        );

        if (result?.payload?.reviews?.length > 0) {
          const totalRating = result.payload.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const averageRating = (
            totalRating / result.payload.reviews.length
          ).toFixed(1);
          ratings[provider._id] = {
            ...ratings[provider._id],
            [serviceType]: averageRating, // Store rating under serviceType
          };
        }
      } catch (error) {
        console.error(
          `Error fetching ratings for provider ${provider._id}, service ${serviceType}:`,
          error
        );
      }
    }
    return ratings;
  };

  const fetchData = async () => {
    await fetchUserType();
    await dispatch(getAllResquestsAction()).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        updateLocations(result.payload);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [dispatch])
  );

  useEffect(() => {
    if (Object.keys(requests).length > 0) {
      updateLocations(requests);
    }
  }, [requests]);

  useEffect(() => {
    const updateProviderRatings = async () => {
      if (requests && requests.accepted && Array.isArray(requests.accepted)) {
        let allRatings = {};
        for (const request of requests.accepted) {
          if (request.acceptedProviders?.length > 0) {
            const ratings = await fetchProviderRatings(
              request.acceptedProviders,
              request.serviceType
            );
            // Merge ratings, preserving existing service types
            Object.entries(ratings).forEach(([providerId, serviceRatings]) => {
              allRatings[providerId] = {
                ...allRatings[providerId],
                ...serviceRatings,
              };
            });
          }
        }
        setProviderRatings(allRatings);
      }
    };

    updateProviderRatings();
  }, [requests?.accepted]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleAcceptRequest = async (requestId) => {
    await dispatch(updateRequestStateAction({ requestId, action: "accept" }));
    fetchData();
  };

  const handleConfirmProvider = async (requestId) => {
    if (!selectedProvider[requestId]) return;
    await dispatch(
      confirmRequestAction({
        requestId,
        action: "confirm",
        providerId: selectedProvider[requestId],
      })
    );
    fetchData();
  };

  const handleCompleteRequest = async (requestId) => {
    const request = requests.confirmed.find((req) => req._id === requestId);
    if (request) {
      setCurrentRequest({
        _id: requestId,
        providerId: request.confirmedProvider,
        serviceType: request.serviceType,
      });
      setIsAddRateVisible(true);
    }
  };

  const handleReviewSubmitted = async () => {
    try {
      if (currentRequest?._id) {
        await dispatch(
          updateRequestStateAction({
            requestId: currentRequest._id,
            action: "complete",
          })
        );
        await fetchData();
      }
    } catch (error) {
      console.error("Error completing request:", error);
    }
    setIsAddRateVisible(false);
    setCurrentRequest(null);
  };

  const filterOptions = [
    {
      id: "pending",
      label: "Pending",
      icon: statusIcons.pending,
      color: statusColors.pending,
    },
    {
      id: "accepted",
      label: "Accepted",
      icon: statusIcons.accepted,
      color: statusColors.accepted,
    },
    {
      id: "confirmed",
      label: "Confirmed",
      icon: statusIcons.confirmed,
      color: statusColors.confirmed,
    },
    {
      id: "completed",
      label: "Completed",
      icon: statusIcons.completed,
      color: statusColors.completed,
    },
  ];

  const handleFilterSelect = (id) => {
    setActiveFilter(id);
    toggleFilterBox();
  };

  const shouldShowSection = (status) => {
    return activeFilter === status;
  };

  const renderProviderItem = ({ item, requestId }) => {
    // Find the request to get its serviceType
    const request = requests.accepted.find((req) => req._id === requestId);
    const serviceType = request?.serviceType;

    if (!item._id) {
      return (
        <TouchableOpacity style={[styles.providerItem, { opacity: 0.7 }]}>
          <Text style={[styles.providerText, { color: "#666" }]}>
            Available providers
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.providerItem}
        onPress={() => selectProvider(requestId, item._id)}
      >
        <Text style={styles.providerText}>
          {item.fullName} ({item.phone})
        </Text>
        {providerRatings[item._id]?.[serviceType] && (
          <View style={styles.ratingContainer}>
            <Feather name="star" size={16} color="#FFA000" />
            <Text style={styles.ratingText}>
              {providerRatings[item._id][serviceType]}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading requests...</Text>
      </View>
    );
  }

  if (!requests || Object.values(requests).every((arr) => arr.length === 0)) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.noDataText}>No requests found.</Text>
        <Feather
          name="inbox"
          size={50}
          color="#ccc"
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilterBox}>
          <Feather name="filter" size={22} color={baseColor} />
        </TouchableOpacity>
      </View>

      {showFilterBox && (
        <Animated.View
          style={[
            styles.filterBox,
            {
              opacity: filterBoxOpacity,
              transform: [{ scale: filterBoxScale }],
            },
          ]}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterBoxOption,
                activeFilter === option.id && {
                  backgroundColor: option.color,
                },
              ]}
              onPress={() => handleFilterSelect(option.id)}
            >
              <Feather
                name={option.icon}
                size={18}
                color={activeFilter === option.id ? "white" : option.color}
              />
              <Text
                style={[
                  styles.filterBoxText,
                  {
                    color: activeFilter === option.id ? "white" : option.color,
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[baseColor, statusColors.pending, statusColors.accepted]}
            progressBackgroundColor="#ffffff"
            progressViewOffset={20}
          />
        }
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        overScrollMode="always"
        scrollEventThrottle={16}
        decelerationRate="normal"
        snapToAlignment="start"
        indicatorStyle="black"
        persistentScrollbar={true}
        alwaysBounceVertical={true}
        removeClippedSubviews={true}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
      >
        {Object.entries(requests).map(
          ([status, reqList]) =>
            shouldShowSection(status) && (
              <View key={status}>
                <Text
                  style={[styles.statusHeader, { color: statusColors[status] }]}
                >
                  <Feather
                    name={statusIcons[status]}
                    size={20}
                    color={statusColors[status]}
                    style={styles.statusIcon}
                  />
                  {status.charAt(0).toUpperCase() + status.slice(1)} Requests
                </Text>
                {reqList.length > 0 ? (
                  reqList.map((req) => (
                    <View
                      key={req._id}
                      style={[
                        styles.card,
                        { borderLeftColor: statusColors[status] },
                      ]}
                    >
                      <View style={styles.cardHeader}>
                        <View style={styles.titleContainer}>
                          <Text style={styles.title}>{req.serviceType}</Text>
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: `${statusColors[status]}20` },
                            ]}
                          >
                            <Feather
                              name={statusIcons[status]}
                              size={14}
                              color={statusColors[status]}
                            />
                            <Text
                              style={[
                                styles.statusText,
                                { color: statusColors[status] },
                              ]}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.cardContent}>
                        <View style={styles.infoRow}>
                          <Feather
                            name="map-pin"
                            size={16}
                            color={statusColors[status]}
                            style={styles.infoIcon}
                          />
                          <Text style={styles.infoText}>
                            {locations[req._id] || "Fetching location..."}
                          </Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Feather
                            name="file-text"
                            size={16}
                            color={statusColors[status]}
                            style={styles.infoIcon}
                          />
                          <Text style={styles.infoText}>
                            {req.problemDescription}
                          </Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Feather
                            name="clock"
                            size={16}
                            color={statusColors[status]}
                            style={styles.infoIcon}
                          />
                          <Text style={styles.infoText}>
                            {new Date(req.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.cardActions}>
                        {userType === "provider" && status === "pending" && (
                          <TouchableOpacity
                            style={[
                              styles.button,
                              { backgroundColor: statusColors.pending },
                            ]}
                            onPress={() => handleAcceptRequest(req._id)}
                          >
                            <Feather
                              name="check"
                              size={16}
                              color="white"
                              style={styles.buttonIcon}
                            />
                            <Text style={styles.buttonText}>
                              Accept Request
                            </Text>
                          </TouchableOpacity>
                        )}

                        {userType === "customer" &&
                          status === "accepted" &&
                          req.acceptedProviders?.length > 0 && (
                            <View style={styles.providerSelection}>
                              <Text style={styles.label}>
                                Select a Provider:
                              </Text>
                              <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => toggleDropdown(req._id)}
                              >
                                <Text style={styles.dropdownText}>
                                  {selectedProvider[req._id]
                                    ? req.acceptedProviders.find(
                                        (p) =>
                                          p._id === selectedProvider[req._id]
                                      )?.fullName || "Select a provider"
                                    : "Select a provider"}
                                </Text>
                                <Feather
                                  name={
                                    dropdownVisible[req._id]
                                      ? "chevron-up"
                                      : "chevron-down"
                                  }
                                  size={20}
                                  color="#555"
                                />
                              </TouchableOpacity>
                              <Modal
                                visible={dropdownVisible[req._id] || false}
                                transparent={true}
                                animationType="none"
                                onRequestClose={() => toggleDropdown(req._id)}
                              >
                                <TouchableOpacity
                                  style={styles.modalOverlay}
                                  onPress={() => toggleDropdown(req._id)}
                                >
                                  <Animated.View
                                    style={[
                                      styles.dropdownContainer,
                                      {
                                        opacity: dropdownAnimation,
                                        transform: [
                                          {
                                            translateY:
                                              dropdownAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [20, 0],
                                              }),
                                          },
                                        ],
                                      },
                                    ]}
                                  >
                                    <FlatList
                                      data={[
                                        { fullName: "Available providers" },
                                        ...req.acceptedProviders,
                                      ]}
                                      renderItem={({ item }) =>
                                        renderProviderItem({
                                          item,
                                          requestId: req._id,
                                        })
                                      }
                                      keyExtractor={(item) =>
                                        item._id || "static-header"
                                      }
                                      style={styles.dropdownList}
                                    />
                                  </Animated.View>
                                </TouchableOpacity>
                              </Modal>
                              <TouchableOpacity
                                style={[
                                  styles.button,
                                  {
                                    backgroundColor: selectedProvider[req._id]
                                      ? statusColors.accepted
                                      : "#ccc",
                                  },
                                ]}
                                onPress={() => handleConfirmProvider(req._id)}
                                disabled={!selectedProvider[req._id]}
                              >
                                <Feather
                                  name="user-check"
                                  size={16}
                                  color="white"
                                  style={styles.buttonIcon}
                                />
                                <Text style={styles.buttonText}>
                                  Confirm Provider
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        {userType === "customer" && status === "confirmed" && (
                          <TouchableOpacity
                            style={[
                              styles.button,
                              { backgroundColor: statusColors.confirmed },
                            ]}
                            onPress={() => handleCompleteRequest(req._id)}
                          >
                            <Feather
                              name="check-circle"
                              size={16}
                              color="white"
                              style={styles.buttonIcon}
                            />
                            <Text style={styles.buttonText}>
                              Mark as Completed
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptySection}>
                    <Text style={styles.noData}>
                      {emptyStateMessages[status]}
                    </Text>
                  </View>
                )}
              </View>
            )
        )}
        <View style={styles.scrollEndPadding} />
      </ScrollView>

      {isAddRateVisible && currentRequest && (
        <AddRate
          onClose={() => {
            setIsAddRateVisible(false);
            setCurrentRequest(null);
          }}
          onSubmitReview={handleReviewSubmitted}
          initialRating={0}
          initialReviewText=""
          mode="add"
          providerId={
            typeof currentRequest.providerId === "object"
              ? currentRequest.providerId._id
              : currentRequest.providerId
          }
          serviceType={currentRequest.serviceType}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: "#f8f9fa",
    zIndex: 9998,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "absolute",
    right: 16,
    top: -42,
  },
  filterBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 16,
    marginTop: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: "absolute",
    top: 60,
    right: 16,
    width: 180,
    zIndex: 9999,
  },
  filterBoxOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 4,
  },
  filterBoxText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  statusHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    marginRight: 8,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
  },
  cardHeader: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  cardContent: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  cardActions: {
    marginTop: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
    color: "#555",
  },
  providerSelection: {
    marginTop: 8,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "80%",
    maxHeight: 300,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownList: {
    flexGrow: 0,
  },
  providerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  providerText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  ratingText: {
    color: "#FFA000",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  emptySection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  noData: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  scrollEndPadding: {
    height: 60,
  },
});

export default RequestPage;
