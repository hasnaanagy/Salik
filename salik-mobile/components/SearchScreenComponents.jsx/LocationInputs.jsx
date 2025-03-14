import React, { useEffect } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons"; // Import AntDesign for 'X' button
import { useDispatch, useSelector } from "react-redux";
import { setFocusedInput, setFromLocation, setToLocation } from "../../redux/slices/locationSlice";

const LocationInputs = ({ fromLocation, toLocation, onChange }) => {
  const dispatch = useDispatch();
  const fromLoc = useSelector((state) => state.location.fromLocation);
  const toLoc = useSelector((state) => state.location.toLocation);
  const focusedInput = useSelector((state) => state.location.focusedInput); // Get focused input from Redux

  useEffect(() => {
    console.log("From Location Updated:", fromLocation);
    console.log("To Location Updated:", toLocation);
  }, [fromLocation, toLocation]);

  return (
    <View style={styles.searchForm}>
      {/* From Location Input */}
      <View style={styles.inputRow}>
        <FontAwesome5 name="dot-circle" size={20} color="black" />
        <TextInput
          placeholder="Pickup Location"
          value={fromLoc || fromLocation}
          onChangeText={(text) => onChange("fromLocation", text)}
          onFocus={() => dispatch(setFocusedInput("fromLocation"))} // Dispatch focus change
          style={[
            styles.input,
            focusedInput === "fromLocation" && styles.focusedInput, // Highlight active field
          ]}
        />
        {fromLoc && ( // Show clear button only if there's a location
          <TouchableOpacity onPress={() => dispatch(setFromLocation(""))}>
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider}></View>

      {/* To Location Input */}
      <View style={styles.inputRow}>
        <FontAwesome5 name="location-arrow" size={18} color="black" />
        <TextInput
          placeholder="Where To?"
          value={toLoc || toLocation}
          onChangeText={(text) => onChange("toLocation", text)}
          onFocus={() => dispatch(setFocusedInput("toLocation"))} // Dispatch focus change
          style={[
            styles.input,
            focusedInput === "toLocation" && styles.focusedInput, // Highlight active field
          ]}
        />
        {toLoc && ( // Show clear button only if there's a location
          <TouchableOpacity onPress={() => dispatch(setToLocation(""))}>
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchForm: {
    flexDirection: "column",
    gap: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    width: "90%",
    alignSelf: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#eee",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 16,
  },

});

export default LocationInputs;
