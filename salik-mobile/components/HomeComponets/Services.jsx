import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import CustomText from "../CustomeComponents/CustomText";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window"); // Get screen width
const numItems = 3;

const Services = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true); // Set loading to true while fetching
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);
      } catch (error) {
        console.error("Error fetching token:", error);
        Alert.alert(
          "Error",
          "Failed to fetch authentication token. Please try again."
        );
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    console.log("Token:", token);
    console.log(
      "User Data Updated:",
      user?.nationalIdImage,
      user?.licenseImage
    );
    console.log("user", user);
  }, [user, token]);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handlePress = (navigationAction) => {
    if (isLoading) {
      Alert.alert("Please Wait", "Checking authentication status...");
      return;
    }

    if (!token) {
      Alert.alert(
        "Login Required",
        "🚀 Hold on! You need to log in first. Go ahead, log in, and come back! 😉",
        [{ text: "OK", onPress: () => router.push("login") }]
      );
      return;
    }

    // Check document verification status for providers
    if (user?.type === "provider") {
      const hasDocuments = user?.nationalIdImage && user?.licenseImage;
      const areDocumentsVerified = 
        user?.nationalIdStatus === "verified" && 
        user?.licenseStatus === "verified";

      if (!hasDocuments || !areDocumentsVerified) {
        router.push("license");
        return;
      }
    }

    // If all checks pass, proceed with navigation
    navigationAction();
  };

  const data = [
    {
      id: "1",
      title: "Ride",
      image: require("../../assets/car.png"),
      onPress: () => {
        handlePress(() => {
          if (user?.type === "provider") {
            router.push("addTrip");
          } else {
            router.push("search");
          }
        });
      },
    },
    {
      id: "2",
      title: "Fuel",
      image: require("../../assets/gas-pump.png"),
      onPress: () => {
        if (user?.type === "provider") {
          handlePress(() => router.push("addService"));
        } else {
          handlePress(() => router.push("request"));
        }
      },
    },
    {
      id: "3",
      title: "Mechanic",
      image: require("../../assets/technician.png"),
      onPress: () => {
        if (user?.type === "provider") {
          handlePress(() => router.push("addService"));
        } else {
          handlePress(() => router.push("request"));
        }
      },
    },
  ];

  return (
    <View>
      <CustomText>Services</CustomText>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={item.onPress}
              disabled={isLoading}
            >
              <Image source={item.image} style={styles.image} />
              <Text style={styles.text}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: width / numItems - 30, // Each item takes 1/3 of the screen width (minus margin)
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 5,
    display: "flex",
    gap: 8,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  image: {
    width: 40,
    height: 40,
  },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
  },
});

export default Services;
