import React from "react";
import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
import CustomText from "../CustomeComponents/CustomText";
import ProviderCard from "./ProviderCard";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ProviderList = ({
  nearbyProviders,
  expandedProviders,
  toggleProviderExpanded,
  handleCallProvider,
  formatTime,
  onBackToSearch,
}) => {
  if (!nearbyProviders.length) return null;

  return (
    <View style={styles.providersContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onBackToSearch}>
        <Ionicons name="arrow-back" size={24} color="#FFB800" />
        <CustomText style={styles.backButtonText}>Back to Search</CustomText>
      </TouchableOpacity>
      <CustomText style={styles.providersTitle}>Available Providers</CustomText>
      {nearbyProviders.map((provider) => (
        <ProviderCard
          key={provider._id}
          provider={provider}
          isExpanded={expandedProviders.includes(provider._id)}
          toggleProviderExpanded={toggleProviderExpanded}
          handleCallProvider={handleCallProvider}
          formatTime={formatTime}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  providersContainer: {
    width: "100%",
    marginTop: height * 0.03,
  },
  providersTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
  },
  backButtonText: {
    marginLeft: 10,
    color: "#FFB800",
    fontSize: 16,
  },
});

export default ProviderList;
