import React, { useState, useEffect, useRef, memo } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import appColors from "../../constants/colors.js";

const FormInput = memo(
  ({ placeholder, value, onChangeText, error, keyboardType, onFocus, onBlur, focused, icon, editable = true }) => {
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState(value);

    // Sync local input value with the prop value when it changes
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleFocus = () => {
      inputRef.current?.focus();
      onFocus();
    };

    return (
      <View style={styles.inputContainer}>
        <View style={styles.inputWithIcon}>
          <Ionicons
            name={icon}
            size={20}
            color={focused ? appColors.primary : "#666"}
            style={styles.inputIcon}
          />
          <TextInput
            ref={inputRef}
            placeholder={placeholder}
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text); // Update local state while typing
            }}
            onBlur={() => {
              onChangeText(inputValue); // Update form state on blur
              onBlur();
            }}
            onFocus={handleFocus}
            keyboardType={keyboardType}
            editable={editable}
            style={[
              styles.input,
              focused && styles.inputFocused,
              error && styles.errorInput,
            ]}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    color: "#333",
  },
  inputFocused: {
    borderColor: appColors.primary,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default FormInput;