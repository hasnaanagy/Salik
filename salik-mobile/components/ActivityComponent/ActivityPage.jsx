import React, { useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooking, fetchProvidedRides } from "../../redux/slices/activitySlice";
import Cards from "./Card";
import appColors from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseColor = appColors.primary;

const ActivityComponent = () => {
    const { user } = useSelector((state) => state.auth);
    const {
        upcoming = [],
        completed = [],
        canceled = [],
        loading,
        error,
    } = useSelector((state) => state.activity);
    const dispatch = useDispatch();
    const userType = user?.type;

    useEffect(() => {
        const getUserType = async () => {
            try {
              const userType = await AsyncStorage.getItem("userType");  
              return userType ? JSON.parse(userType) : null;  
            } catch (error) {
              console.error("Error getting userType from AsyncStorage:", error);
              return null;
            }
          }
          const role=getUserType()
          console.log(role)

       const fetchActivities=async()=>{
        if (role === "customer") {
            console.log("from customer")
           await dispatch(fetchBooking());
        } else{
            console.log("from provider")

           await dispatch(fetchProvidedRides());
        }
       }
       fetchActivities()
    }, [dispatch, userType,user]);

    completed.map((ride) => {
        console.log(ride);
    })
    if (loading) return <ActivityIndicator size="large" color={baseColor} />;
    if (error) return <Text style={styles.error}>{error}</Text>;
    return (
        <ScrollView style={styles.container}>
            {/* Upcoming Rides */}
            <Text style={styles.heading}>Upcoming</Text>
            {upcoming.length > 0 ? (
                upcoming.map((ride) => <Cards key={ride._id} ride={ride} />)
            ) : (
                <Text style={styles.noData}>No upcoming rides</Text>
            )}

            {/* Past Rides */}
            <Text style={styles.heading}>Past</Text>
            {completed.length > 0 ? (

                completed.map((ride) => <Cards key={ride._id}ride={ride} />)
            ) : (
                <Text style={styles.noData}>No past rides</Text>
            )}

            {/* Canceled Rides */}
            <Text style={styles.heading}>Canceled</Text>
            {canceled.length > 0 ? (
                canceled.map((ride) => <Cards key={ride._id} ride={ride} />)
            ) : (
                <Text style={styles.noData}>No canceled rides</Text>
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
});

export default ActivityComponent;
