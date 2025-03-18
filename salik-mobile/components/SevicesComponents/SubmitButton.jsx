import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import appColors from "../../constants/colors.js";

const SubmitButton = ({ onPress, loading }) => (
  <TouchableOpacity
    style={[styles.submitButton, loading && styles.disabledButton]}
    onPress={onPress}
    disabled={loading}
  >
    {loading ? (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#fff" />
        <Text style={styles.submitButtonText}>Adding...</Text>
      </View>
    ) : (
      <Text style={styles.submitButtonText}>Add Service</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: appColors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: { backgroundColor: "#ccc" },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default SubmitButton;
