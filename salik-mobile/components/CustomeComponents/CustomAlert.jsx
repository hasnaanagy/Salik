import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomAlert = ({ visible, message, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  alertBox: {
    width: 300,
    padding: 30,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, 
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "red"
  },
  button: {
    backgroundColor: "#FFB800",
    paddingVertical: 7,
    paddingHorizontal: 25,
    borderRadius: 2,
    elevation: 3,
    fontSize: 12,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomAlert;
