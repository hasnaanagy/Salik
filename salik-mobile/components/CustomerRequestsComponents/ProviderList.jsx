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
      {/* Back Arrow and Title in One Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToSearch}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <CustomText style={styles.providersTitle}>Available Providers</CustomText>
      </View>

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
    marginTop: -30,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
    justifyContent: "flex-start", // Align items to the start
  },
  providersTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#212529",
    marginLeft: 10, // Add spacing between the back arrow and the text
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
});

export default ProviderList;
