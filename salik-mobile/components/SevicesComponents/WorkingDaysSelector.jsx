import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

const WorkingDaysSelector = ({ workingDays, toggleWorkingDay, error }) => {
  const days = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  return (
    <>
      <Text style={styles.label}>Working Days:</Text>
      <View style={styles.daysContainer}>
        {days.map((day) => (
          <View key={day} style={styles.dayItem}>
            <Checkbox
              status={workingDays.includes(day) ? "checked" : "unchecked"}
              onPress={() => toggleWorkingDay(day)}
            />
            <Text>{day}</Text>
          </View>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  daysContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 15 },
  dayItem: { flexDirection: "row", alignItems: "center", width: "33%" },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
});

export default WorkingDaysSelector;
