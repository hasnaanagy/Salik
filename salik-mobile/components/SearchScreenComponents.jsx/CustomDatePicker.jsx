import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";

const CustomDatePicker = ({ selectedDate, onDateChange }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const today = new Date();
  const formattedToday = getFormatedDate(today, "YYYY/MM/DD");

  const handleDateChange = (date) => {
    if (date !== selectedDate) { 
      onDateChange(date);
    }
  };

  return (
    <View style={styles.dateTimeContainer}>
      <Text style={styles.labelText}>Select Date:</Text>
      <TouchableOpacity onPress={() => setOpenDatePicker(true)} style={styles.label}>
        <Text>{selectedDate || "Pick a date"}</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={openDatePicker}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DatePicker
              mode="calendar"
              minimumDate={formattedToday}
              selected={selectedDate || formattedToday}
              onSelectedChange={handleDateChange} // ✅ Prevent infinite updates
              options={{
                backgroundColor: "#fff",
                textHeaderColor: "#000",
                textDefaultColor: "#000",
                selectedTextColor: "#fff",
                selectedBackgroundColor: "#FFB800",
                mainColor: "#FFB800",
                textSecondaryColor: "#808080",
                borderColor: "rgba(122,146,165,0.1)",
              }}
            />
            <TouchableOpacity onPress={() => setOpenDatePicker(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dateTimeContainer: {
    justifyContent: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  label: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
  },
  labelText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#f8f8f8",
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    width: "80%",
  },
  closeText: {
    color: "black",
    fontSize: 16,
    marginTop: 10,
  },
});

export default CustomDatePicker;
