import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  TextInput,
  Dimensions,
  Image,
  Alert,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { sendRequestAction } from "../../redux/slices/requestServiceSlice";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import CustomText from "../CustomeComponents/CustomText"; // Assuming this is now correct
const { width, height } = Dimensions.get("window");
import BackButton from "../SharedComponents/BackButton";
const CustomerRequests = () => {
  const [activeTab, setActiveTab] = useState("fuel");
  const [description, setDescription] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
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

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.4],
  });

  const handleSubmit = async () => {
    if (!userLocation) {
      Alert.alert("Error", "Location not available yet");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    try {
      const serviceType = activeTab === "fuel" ? "fuel" : "mechanic";
      const locationData = {
        type: "Point", // Add if required by your backend
        coordinates: [userLocation.longitude, userLocation.latitude],
      };

      await dispatch(
        sendRequestAction({
          serviceType,
          location: locationData,
          problem: description,
        })
      ).unwrap();

      setDescription("");
      router.push("/requests");
    } catch (error) {
      Alert.alert("Error", "Failed to submit request: " + error.message);
    }
  };

  return (
    <>
    <View style={{marginBottom:Platform.OS === "ios" ? 0 : height * 0.02}}>
            <BackButton />
            </View>

    <View style={styles.container}>
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

      <View style={styles.form}>
        <Image
          source={require("../../assets/help.png")}
          style={styles.imageStyle}
        />
        <TextInput
          style={styles.formTextArea}
          placeholder="Describe your problem"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <CustomText style={styles.buttonText}>Request Service</CustomText>
        </TouchableOpacity>
      </View>
    </View>
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
    marginTop: height * 0.07,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: Platform.OS === "ios" ? 36 : 26,
    width: width * 0.8,
    height: Platform.OS === "ios" ? height * 0.06 : height * 0.07,
    position: "relative",
    overflow: "hidden",
    marginBottom: height * 0.03,
    alignSelf: "center",
    
  },
  tabBackground: {
    position: "absolute",
    backgroundColor: "#f5c518",
    width: width * 0.4,
    height: "100%",
    borderRadius: Platform.OS === "ios" ? 36 : 26,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },
  tabText: {
    fontSize: Platform.OS === "ios" ? width * 0.03 : width * 0.04,
    fontWeight: "600",
    marginRight: Platform.OS === "ios" ? width * 0.02 : width * 0.01,
  },
  activeTabText: {
    color: "#000",
  },
  inactiveTabText: {
    color: "#666",
  },
  form: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    padding: width * 0.05,
  },
  formTextArea: {
    width: "100%",
    padding: width * 0.03,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    fontSize: width * 0.04,
    color: "#333",
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
    marginBottom: height * 0.02,
    height: height * 0.15,
  },
  button: {
    alignSelf: "center",
    width: width * 0.5,
    backgroundColor: "#f5c518",
    paddingVertical: height * 0.015,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: "#000",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  imageStyle: {
    width: "65%",
    height: "50%",
    alignSelf: "center",
  },
});

export default CustomerRequests;
