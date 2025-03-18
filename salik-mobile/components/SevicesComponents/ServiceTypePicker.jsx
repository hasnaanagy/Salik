import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const ServiceTypePicker = ({ value, onValueChange, error }) => (
  <>
    <Text style={styles.label}>Service Type</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item label="Select Service Type" value="" enabled={false} />
        <Picker.Item label="Mechanic" value="mechanic" />
        <Picker.Item label="Fuel" value="fuel" />
      </Picker>
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </>
);

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
});

export default ServiceTypePicker;
