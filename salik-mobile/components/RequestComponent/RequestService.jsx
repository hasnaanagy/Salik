import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import Geolocation from '@react-native-community/geolocation';
import { useDispatch } from "react-redux";
import { sendRequestAction } from "../redux/slices/requestServiceSlice";
import useRouter from "expo-router";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with your backend URL

const RequestService = ({ serviceType }) => {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [problem, setProblem] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Error getting location:", error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }, []);

    const handleSubmit = async () => {
        const type = serviceType === "Mechanic" ? "mechanic" : "fuel";

        if (!problem || !location.lat || !location.lng) {
            Alert.alert("Error", "Please provide a problem description and location.");
            return;
        }

        const requestData = {
            serviceType: type,
            location: {
                type: "Point",
                coordinates: [location.lng, location.lat],
            },
            problem,
        };

        await dispatch(sendRequestAction(requestData));
        // rouyter.push("/");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Request {serviceType} Service</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Describe your problem"
                value={problem}
                onChangeText={setProblem}
                multiline
            />
            <Button title="Send" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    textInput: {
        height: 100,
        backgroundColor: "#F3F3F3",
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 12,
        textAlignVertical: "top",
    },
});

export default RequestService;
