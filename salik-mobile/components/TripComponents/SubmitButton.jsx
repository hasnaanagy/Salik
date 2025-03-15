import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import appColors from "../../constants/colors.js";

const SubmitButton = ({ loading, onPress, isEditMode }) => {
  return (
    <TouchableOpacity
      style={[styles.addButton, loading && styles.disabledButton]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={[styles.addButtonText, { marginLeft: 10 }]}>
            {isEditMode ? "Editing..." : "Adding..."}
          </Text>
        </View>
      ) : (
        <Text style={styles.addButtonText}>
          {isEditMode ? "Edit Trip" : "Add Trip"}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: appColors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SubmitButton;
