import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DateTimePickerButton = ({
  value,
  mode,
  onChange,
  displayFormat,
  disabled,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selectedValue) => {
    setShowPicker(false);
    if (selectedValue) {
      onChange(selectedValue);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
        disabled={disabled}
      >
        <Text style={styles.placeholderText}>{displayFormat(value)}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={handleChange}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  placeholderText: {
    color: "#888",
  },
});

export default DateTimePickerButton;
