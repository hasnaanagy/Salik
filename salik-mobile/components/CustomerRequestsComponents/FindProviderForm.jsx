import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomText from "../CustomeComponents/CustomText";

const { width, height } = Dimensions.get("window");

const FindProviderForm = ({
  getLocationDisplay,
  handleFindProviders,
  locationLoading,
  findingProviders,
}) => {
  return (
    <View style={styles.findProviderForm}>
      <Image
        source={require("../../assets/location1.jpg")}
        style={styles.locationImage}
        resizeMode="contain"
      />
      <View style={styles.inputContainer}>
        <Feather
          name="map-pin"
          size={24}
          color="#ffb800"
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
        <CustomText style={styles.buttonText}>Find Nearby Providers</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: width * 0.7,
    backgroundColor: "#ffb800",
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
  locationImage: {
    width: width * 0.4,
    height: height * 0.15,
    marginBottom: height * 0.03,
  },
});

export default FindProviderForm;
