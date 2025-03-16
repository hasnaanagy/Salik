import React, { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { TimePickerModal } from "react-native-paper-dates";

const CustomTimePicker = ({ selectedTime, onTimeChange }) => {
  const [openTimePicker, setOpenTimePicker] = useState(false);

  // Function to format time correctly
  const convertTo24HourFormat = (hours, minutes, period) => {
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0; // ✅ Midnight case
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`; // Format HH:mm
  };

  return (
    <View style={{ justifyContent: "center", width: "90%", alignSelf: "center", marginTop: 20 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Select Time:</Text>
      <TouchableOpacity onPress={() => {setOpenTimePicker(true)}} style={{ borderColor: "black", borderWidth: 2, borderRadius: 10, padding: 15 }}>
        <Text>{selectedTime || "Pick a time"}</Text>
      </TouchableOpacity>

      <TimePickerModal
        visible={openTimePicker}
        onDismiss={() => setOpenTimePicker(false)}
        onConfirm={({ hours, minutes }) => {
          const period = hours >= 12 ? "PM" : "AM";
          const formattedTime12H = `${(hours % 12 || 12).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
          const formattedTime24H = convertTo24HourFormat(hours, minutes, period); // ✅ Convert to HH:mm

          onTimeChange(formattedTime12H); // ✅ Store & show 12-hour format
          console.log("Stored in 24H format:", formattedTime24H); // ✅ Debugging

          setOpenTimePicker(false);
        }}
        hours={12}
        minutes={0}
      />
    </View>
  );
};

export default CustomTimePicker;
