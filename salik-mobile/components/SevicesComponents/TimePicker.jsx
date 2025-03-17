import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const TimePicker = ({
  startTime,
  endTime,
  showStartTime,
  showEndTime,
  setShowStartTime,
  setShowEndTime,
  handleTimeChange,
  error,
}) => (
  <>
    <Text style={styles.label}>Working Hours:</Text>
    <View style={styles.timeContainer}>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowStartTime(true)}
      >
        <Ionicons name="time-outline" size={20} color="black" />
        <Text>
          {startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowEndTime(true)}
      >
        <Ionicons name="time-outline" size={20} color="black" />
        <Text>
          {endTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
    {showStartTime && (
      <DateTimePicker
        value={startTime}
        mode="time"
        display="default"
        onChange={(event, selectedTime) =>
          handleTimeChange(event, selectedTime, "startTime")
        }
      />
    )}
    {showEndTime && (
      <DateTimePicker
        value={endTime}
        mode="time"
        display="default"
        onChange={(event, selectedTime) =>
          handleTimeChange(event, selectedTime, "endTime")
        }
      />
    )}
  </>
);

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "45%",
    justifyContent: "center",
  },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
});

export default TimePicker;
