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
} from "react-native";
import { useDispatch } from "react-redux";
import { sendRequestAction } from "../../redux/slices/requestServiceSlice";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import CustomText from "../CustomeComponents/CustomText";
import BackButton from "../SharedComponents/BackButton";

const { width, height } = Dimensions.get("window");

const CustomerRequests = () => {
  const [activeTab, setActiveTab] = useState("fuel");
  const [description, setDescription] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

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
    Animated.spring(slideAnim, {
      toValue: tab === "fuel" ? 0 : 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.45],
  });

  const handleSubmit = async () => {
    if (!userLocation || !description.trim()) {
      Alert.alert("Error", "Please provide location and description");
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
      setDescription("");
      router.push("/requests");
    } catch (error) {
      Alert.alert("Error", "Failed to submit request: " + error.message);
    }
  };

  return (
    <>
      <View style={styles.backButtonContainer}>
        <BackButton />
      </View>

      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <Animated.View style={[styles.tabBackground, { transform: [{ translateX }] }]}>
            <LinearGradient
              colors={["#f5c518", "#ffd700"]}
              style={styles.gradientTab}
            />
          </Animated.View>
          <TouchableOpacity style={styles.tab} onPress={() => handleTabSwitch("fuel")}>
            <MaterialIcons
              name="local-gas-station"
              size={width * 0.06}
              color={activeTab === "fuel" ? "#000" : "#666"}
            />
            <CustomText
              style={[
                styles.tabText,
                activeTab === "fuel" ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              Fuel
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => handleTabSwitch("mechanic")}>
            <MaterialIcons
              name="build"
              size={width * 0.06}
              color={activeTab === "mechanic" ? "#000" : "#666"}
            />
            <CustomText
              style={[
                styles.tabText,
                activeTab === "mechanic" ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              Mechanic
            </CustomText>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
          <Image source={require("../../assets/help.png")} style={styles.imageStyle} />
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
          <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8}>
            <LinearGradient
              colors={["#f5c518", "#ffd700"]}
              style={styles.button}
            >
              <CustomText style={styles.buttonText}>Request Service</CustomText>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    marginBottom: Platform.OS === "ios" ? height * 0.01 : height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 30,
    width: width * 0.9,
    height: height * 0.08,
    position: "relative",
    overflow: "hidden",
    margin: height * 0.06,
    alignSelf: "center",
    elevation: 2,
  },
  tabBackground: {
    position: "absolute",
    width: width * 0.45,
    height: "100%",
  },
  gradientTab: {
    flex: 1,
    borderRadius: 30,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  tabText: {
    fontSize: width * 0.045,
    fontWeight: "700",
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
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    padding: width * 0.06,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  formTextArea: {
    width: "100%",
    padding: width * 0.04,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    fontSize: width * 0.045,
    color: "#333",
    backgroundColor: "#fafafa",
    textAlignVertical: "top",
    marginBottom: height * 0.03,
    height: height * 0.18,
  },
  button: {
    alignSelf: "center",
    width: width * 0.6,
    paddingVertical: height * 0.02,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    color: "#000",
    fontSize: width * 0.045,
    fontWeight: "700",
  },
  imageStyle: {
    width: "70%",
    height: height * 0.25,
    alignSelf: "center",
    marginBottom: height * 0.03,
  },
});

export default CustomerRequests;