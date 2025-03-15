import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooking,
  fetchProvidedRides,
} from "../../redux/slices/activitySlice";
import { getUser } from "../../redux/slices/authSlice";
import Cards from "./Card";
import appColors from "../../constants/colors";

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

  // Fetch user data when the component mounts
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Fetch activities when user type changes
  useEffect(() => {
    if (userType === "customer") {
      dispatch(fetchBooking());
    } else if (userType === "provider") {
      dispatch(fetchProvidedRides());
    }
  }, [dispatch, userType]);

  if (loading) return <ActivityIndicator size="large" color={baseColor} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  const Divider = () => <View style={styles.divider} />;

  return (
    <ScrollView style={styles.container}>
      {upcoming.length === 0 &&
      completed.length === 0 &&
      canceled.length === 0 ? (
        <Text style={styles.noData}>No rides available</Text>
      ) : (
        <>
          <Text style={styles.heading}>Upcoming</Text>
          {upcoming.length > 0 ? (
            upcoming.map((ride) => <Cards key={ride._id} ride={ride} />)
          ) : (
            <Text style={styles.noData}>No upcoming rides</Text>
          )}
          <Divider />
          <Text style={styles.heading}>Past</Text>
          {completed.length > 0 ? (
            completed.map((ride) => <Cards key={ride._id} ride={ride} />)
          ) : (
            <Text style={styles.noData}>No past rides</Text>
          )}
          <Divider />
          <Text style={styles.heading}>Canceled</Text>
          {canceled.length > 0 ? (
            canceled.map((ride) => <Cards key={ride._id} ride={ride} />)
          ) : (
            <Text style={styles.noData}>No canceled rides</Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  noData: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  divider: {
    height: 1,
    width: "75%",
    backgroundColor: "#ccc",
    marginVertical: 20,
    alignSelf: "center",
  },
});

export default ActivityComponent;
