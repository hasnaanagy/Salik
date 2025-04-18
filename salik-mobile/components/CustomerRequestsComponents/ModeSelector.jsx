import React from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomText from "../CustomeComponents/CustomText";

const { width, height } = Dimensions.get("window");

const ModeSelector = ({ requestMode, handleModeSwitch }) => {
  return (
    <View style={styles.modeContainer}>
      <TouchableOpacity
        style={[
          styles.modeButton,
          requestMode === "request" && styles.activeModeButton,
        ]}
        onPress={() => handleModeSwitch("request")}
      >
        <Feather
          name="send"
          size={20}
          color={requestMode === "request" ? "#000" : "#666"}
          style={styles.modeIcon}
        />
        <CustomText
          style={[
            styles.modeButtonText,
            requestMode === "request" && styles.activeModeText,
          ]}
        >
          Send Request
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.modeButton,
          requestMode === "find" && styles.activeModeButton,
        ]}
        onPress={() => handleModeSwitch("find")}
      >
        <Feather
          name="search"
          size={20}
          color={requestMode === "find" ? "#000" : "#666"}
          style={styles.modeIcon}
        />
        <CustomText
          style={[
            styles.modeButtonText,
            requestMode === "find" && styles.activeModeText,
          ]}
        >
          Find Provider
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.025,
    borderRadius: 16,
    backgroundColor: "#e9ecef",
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.015,
    marginHorizontal: width * 0.01,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  activeModeButton: {
    backgroundColor: "#ffb800",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  modeButtonText: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#6c757d",
  },
  activeModeText: {
    color: "#212529",
  },
  modeIcon: {
    marginRight: width * 0.02,
  },
});

export default ModeSelector;
