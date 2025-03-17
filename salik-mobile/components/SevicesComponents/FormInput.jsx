import React from "react";
import { TextInput, Text, StyleSheet } from "react-native";
import appColors from "../../constants/colors.js";

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  onFocus,
  onBlur,
  focusedField,
  fieldName,
}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        error && styles.errorInput,
        focusedField === fieldName && styles.focusedInput,
      ]}
      placeholder={placeholder}
      value={value}
      onFocus={() => onFocus(fieldName)}
      onBlur={onBlur}
      onChangeText={onChangeText}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </>
);

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
  focusedInput: {
    borderColor: appColors.primary,
    borderWidth: 2,
  },
});

export default FormInput;
