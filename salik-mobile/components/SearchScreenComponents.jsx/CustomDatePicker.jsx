import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";

const CustomDatePicker = ({ selectedDate, onDateChange }) => {
  const [date, setDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selected) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selected) {
      setDate(selected);
      onDateChange(selected.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }
  };

  const handleShowPicker = () => {
    const today = new Date();
    setDate(today); // Set the date to the current date
    onDateChange(today.toISOString().split("T")[0]); // Update the text field with today's date
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Date:</Text>
      <TouchableOpacity onPress={handleShowPicker} style={styles.inputContainer}>
        <Text style={styles.inputText}>{selectedDate || "Pick a date"}</Text>
      </TouchableOpacity>

      {/* DateTime Picker Modal (For Android & iOS) */}
      {showPicker && (
        <View style={styles.pickerContainer}>
          <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.closeButton}>
            <FontAwesome name="times-circle" size={24} color="gray" />
          </TouchableOpacity>

          <DateTimePicker
            value={date}
            mode="date"
            minimumDate={new Date()} // Prevent past dates
            display={Platform.OS === "ios" ? "spinner" : "calendar"} // Android uses "calendar"
            onChange={handleDateChange}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  inputText: {
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Pushes close button to the right
    marginTop: 10,
  },
  closeButton: {
    paddingHorizontal: 10,
  },
});

export default CustomDatePicker;