import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native"; // Added Alert import
import { Ionicons } from "@expo/vector-icons";
import "react-native-get-random-values";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchBar = () => {
  const router = useRouter();
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
  console.log("Token:", token);

  const handlePress = () => {
    if (isLoading) {
      Alert.alert("Please Wait", "Checking authentication status...");
      return;
    }

    if (token) {
      try {
        router.push("search");
      } catch (error) {
        console.error("Navigation error:", error);
        Alert.alert("Navigation Error", "Failed to navigate to search screen.");
      }
    } else {
      Alert.alert(
        "Login Required",
        "🚀 Hold on! You need to log in first. Go ahead, log in, and come back! 😉",
        [{ text: "OK", onPress: () => router.push("login") }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={handlePress}
          disabled={isLoading} // Disable button while loading
        >
          <Text
            style={[styles.placeholderText, isLoading && { color: "#ccc" }]}
          >
            {isLoading ? "Loading..." : "Where to ?"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  searchContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
    height: 50,
  },
  placeholderText: {
    fontSize: 16,
    color: "#888",
  },
  searchIcon: {
    marginRight: 10,
  },
});

export default SearchBar;
