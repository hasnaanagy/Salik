import React, { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { TimePickerModal } from "react-native-paper-dates";

const CustomTimePicker = ({ selectedTime, onTimeChange }) => {
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const formatTime = (hours, minutes) => {
    const period = hours >= 12 ? "PM" : "AM"; 
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12AM
    return `${formattedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <View style={{ justifyContent: "center", width: "90%", alignSelf: "center", marginTop: 20 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Select Time:</Text>
      <TouchableOpacity onPress={() => setOpenTimePicker(true)} style={{ borderColor: "black", borderWidth: 2, borderRadius: 10, padding: 15 }}>
        <Text>{selectedTime || "Pick a time"}</Text>
      </TouchableOpacity>

      <TimePickerModal
        visible={openTimePicker}
        onDismiss={() => setOpenTimePicker(false)}
        onConfirm={({ hours, minutes }) => {
          const formattedTime = formatTime(hours, minutes); // Convert time format
          onTimeChange(formattedTime); 
          setOpenTimePicker(false);
        }}
        hours={12}
        minutes={0}
      />
    </View>
  );
};

export default CustomTimePicker;
