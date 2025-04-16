import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchBooking,
  fetchProvidedRides,
} from "../../redux/slices/activitySlice";
import { getUser } from "../../redux/slices/authSlice";
import Cards from "./Card";
import appColors from "../../constants/colors";
import { Feather } from "@expo/vector-icons";

// Updated color scheme
const COLORS = {
  upcoming: "#FFB800",
  completed: "#5db661",
  canceled: "#F44336",
  background: "#f8f9fa",
  text: "#333333",
  lightGray: "#e0e0e0",
};

const baseColor = appColors.primary;

const ActivityComponent = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    upcoming = [],
    completed = [],
    canceled = [],
    loading,
    error,
  } = useSelector((state) => state.activity);

  const userType = user?.type;

  const [refreshing, setRefreshing] = useState(false);
  // Changed default filter from "all" to "upcoming"
  const [activeFilter, setActiveFilter] = useState("upcoming");
  const [showFilterBox, setShowFilterBox] = useState(false);

  // Animation value for filter box
  const filterBoxOpacity = useState(new Animated.Value(0))[0];
  const filterBoxScale = useState(new Animated.Value(0.8))[0];

  const toggleFilterBox = () => {
    if (showFilterBox) {
      // Close animation
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
      // Open animation
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

  const fetchData = useCallback(() => {
    dispatch(getUser());
    if (userType === "customer") {
      dispatch(fetchBooking());
    } else if (userType === "provider") {
      dispatch(fetchProvidedRides());
    }
  }, [dispatch, userType]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) return <ActivityIndicator size="large" color={baseColor} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  const Divider = () => <View style={styles.divider} />;

  // Filter options with icons and updated colors
  const filterOptions = [
    {
      id: "upcoming",
      label: "Upcoming",
      icon: "clock",
      color: COLORS.upcoming,
    },
    {
      id: "completed",
      label: "Completed",
      icon: "check-circle",
      color: COLORS.completed,
    },
    {
      id: "canceled",
      label: "Canceled",
      icon: "x-circle",
      color: COLORS.canceled,
    },
  ];

  // Show sections based on active filter - removed "all" condition
  const shouldShowSection = (sectionId) => {
    return activeFilter === sectionId;
  };

  // Handle filter selection with reload
  const handleFilterSelect = async (id) => {
    setActiveFilter(id);
    toggleFilterBox(); // Close the filter box after selection

    // Reload data when filter changes
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header with title and filter icon */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilterBox}>
          <Feather name="filter" size={22} color={baseColor} />
        </TouchableOpacity>
      </View>

      {/* Animated filter box */}
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {upcoming.length === 0 &&
        completed.length === 0 &&
        canceled.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Feather name="calendar" size={50} color="#ccc" />
            <Text style={styles.noData}>No rides available</Text>
            <Text style={styles.noDataSubtext}>
              Your ride history will appear here
            </Text>
          </View>
        ) : (
          <>
            {shouldShowSection("upcoming") && (
              <>
            <View style={{flexDirection: "row", alignItems: "center",gap: 10,marginBottom: 16}}>
            <Feather
                    name="clock"
                    size={20}
                    color={COLORS.upcoming}
                    style={styles.headingIcon}
                  />
                <Text style={styles.heading}>
                  Upcoming
                </Text>
                </View>
                {upcoming.length > 0 ? (
                  upcoming.map((ride) => (
                    <Cards
                      key={ride._id}
                      ride={{ ...ride, statusColor: COLORS.upcoming }}
                    />
                  ))
                ) : (
                  <View style={styles.emptySection}>
                    <Text style={styles.noData}>No upcoming rides</Text>
                  </View>
                )}
                {/* Removed divider condition that checked for activeFilter === "all" */}
              </>
            )}

            {shouldShowSection("completed") && (
              <>
          <View style={{flexDirection: "row", alignItems: "center",gap: 10,marginBottom: 16}}>
          <Feather
                    name="check-circle"
                    size={20}
                    color={COLORS.completed}
                    style={styles.headingIcon}
                  />
                <Text style={styles.heading}>
                  Completed
                </Text>
                </View>
                {completed.length > 0 ? (
                  completed.map((ride) => (
                    <Cards
                      key={ride._id}
                      ride={{ ...ride, statusColor: COLORS.completed }}
                    />
                  ))
                ) : (
                  <View style={styles.emptySection}>
                    <Text style={styles.noData}>No completed rides</Text>
                  </View>
                )}
                {/* Removed divider condition that checked for activeFilter === "all" */}
              </>
            )}

            {shouldShowSection("canceled") && (
              <>
              <View style={{flexDirection: "row", alignItems: "center",gap: 10,marginBottom: 16}}>
              <Feather
                    name="x-circle"
                    size={22}
                    color={COLORS.canceled}
                  />
                <Text style={styles.heading}>  
                  Canceled
                </Text>
                </View>
                {canceled.length > 0 ? (
                  canceled.map((ride) => (
                    <Cards
                      key={ride._id}
                      ride={{ ...ride, statusColor: COLORS.canceled }}
                    />
                  ))
                ) : (
                  <View style={styles.emptySection}>
                    <Text style={styles.noData}>No canceled rides</Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  filterButton: {
    position: "absolute",
    right: 16,
    top: -50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  container: {
    padding: 16,
    flex: 1,
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
    zIndex: 1000,
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
  heading: {
    fontSize: 22,
    marginLeft: 10,
  },

  noData: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  noDataSubtext: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginTop: 5,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
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
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    padding: 20,
  },
  divider: {
    height: 1,
    width: "75%",
    backgroundColor: COLORS.lightGray,
    marginVertical: 20,
    alignSelf: "center",
  },
});

export default ActivityComponent;
