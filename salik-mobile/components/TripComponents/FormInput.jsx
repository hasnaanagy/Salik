import React from "react";
import { TextInput, Text, StyleSheet, View } from "react-native";
import appColors from "../../constants/colors.js";

const FormInput = ({
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType,
  editable = true,
  onFocus,
  onBlur,
  focused,
}) => {
  return (
    <View>
      <TextInput
        style={[
          styles.input,
          error && styles.errorInput,
          focused && styles.focusedInput,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || "default"}
        editable={editable}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
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
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  focusedInput: {
    borderColor: appColors.primary,
    borderWidth: 2,
  },
});

export default FormInput;
