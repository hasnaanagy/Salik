import React from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import CustomText from "../CustomeComponents/CustomText";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const TabSelector = ({ activeTab, handleTabSwitch }) => {
  return (
    <View style={styles.container}>
      <CustomText style={styles.sectionTitle}>Service Type</CustomText>

      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => handleTabSwitch("fuel")}
        >
          <View style={styles.radioRow}>
            <View style={styles.radioButtonContainer}>
              <View
                style={[
                  styles.radioOuterCircle,
                  activeTab === "fuel" && styles.radioOuterCircleActive,
                ]}
              >
                {activeTab === "fuel" && (
                  <View style={styles.radioInnerCircle} />
                )}
              </View>
            </View>
            <CustomText style={styles.radioLabel}>Fuel Request</CustomText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => handleTabSwitch("mechanic")}
        >
          <View style={styles.radioRow}>
            <View style={styles.radioButtonContainer}>
              <View
                style={[
                  styles.radioOuterCircle,
                  activeTab === "mechanic" && styles.radioOuterCircleActive,
                ]}
              >
                {activeTab === "mechanic" && (
                  <View style={styles.radioInnerCircle} />
                )}
              </View>
            </View>
            <CustomText style={styles.radioLabel}>Mechanic Request</CustomText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    marginBottom: 20,
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  radioContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  radioOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButtonContainer: {
    marginRight: 12,
  },
  radioOuterCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterCircleActive: {
    borderColor: "#ffb800",
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#ffb800",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
});

export default TabSelector;
