import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Modal, Text } from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setFocusedInput, setFromLocation, setToLocation } from "../../redux/slices/locationSlice";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Map from "../MapComponent/Map"; // Import the Map component
import { GOOGLE_API_KEY } from "@env";

const LocationInputs = ({ fromLocation, toLocation, onLocationChange }) => {
  const dispatch = useDispatch();
  const fromLoc = useSelector((state) => state.location.fromLocation);
  const toLoc = useSelector((state) => state.location.toLocation);
  const focusedInput = useSelector((state) => state.location.focusedInput);

  // Local state to control input values
  const [localFromValue, setLocalFromValue] = useState(fromLoc || fromLocation || "");
  const [localToValue, setLocalToValue] = useState(toLoc || toLocation || "");

  useEffect(() => {
    console.log("From Location Updated:", fromLocation);
    console.log("To Location Updated:", toLocation);
    setLocalFromValue(fromLoc || fromLocation || "");
    setLocalToValue(toLoc || toLocation || "");
  }, [fromLocation, toLocation, fromLoc, toLoc]);

  // Handle location selection from the map
  const handleMapLocationSelect = (address) => {
    if (focusedInput === "fromLocation") {
      onLocationChange("fromLocation", address);
      dispatch(setFromLocation(address));
      setLocalFromValue(address);
    } else if (focusedInput === "toLocation") {
      onLocationChange("toLocation", address);
      dispatch(setToLocation(address));
      setLocalToValue(address);
    }
  };

  return (
    console.log("from",fromLoc,"to",toLoc),
    <View style={styles.searchForm}>
      {/* From Location Input */}
      <View style={styles.inputRow}>
        <FontAwesome5 name="dot-circle" size={20} color="black" />
        <GooglePlacesAutocomplete
          placeholder="Pickup Location"
          fetchDetails={true}
          onPress={(data, details = null) => {
            const address = data.description;
            onLocationChange("fromLocation", address);
            dispatch(setFromLocation(address));
            setLocalFromValue(address);
          }}
          onFail={(error) => console.error("Google Places Error (From):", error)}
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={200}
          minLength={2}
          textInputProps={{
            value: localFromValue||fromLoc,
            onChangeText: (text) => setLocalFromValue(text),
            onFocus: () => dispatch(setFocusedInput("fromLocation")),
          }}
          styles={{
            textInput: styles.input,
            textInputContainer: {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 16,

            },
            listView: {
              zIndex: 1000,
              elevation: 5,
            },
            container: {
              flex: 1,
              zIndex: 1000,
            },
          }}
        />
    
        {fromLoc && (
          <TouchableOpacity
            onPress={() => {
              dispatch(setFromLocation(""));
              onLocationChange("fromLocation", "");
              setLocalFromValue("");
            }}
          >
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider}></View>

      {/* To Location Input */}
      <View style={styles.inputRow}>
        <FontAwesome5 name="location-arrow" size={18} color="black" />
        <GooglePlacesAutocomplete
          placeholder="Where To?"
          fetchDetails={true}
          onPress={(data, details = null) => {
            const address = data.description;
            onLocationChange("toLocation", address);
            dispatch(setToLocation(address));
            setLocalToValue(address);
          }}
          onFail={(error) => console.error("Google Places Error (To):", error)}
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={200}
          minLength={2}
          textInputProps={{
            value: localToValue || toLoc,
            onChangeText: (text) => setLocalToValue(text),
            onFocus: () => dispatch(setFocusedInput("toLocation")),
          }}
          styles={{
            textInput: styles.input,
            textInputContainer: {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 16,
            },
            listView: {
              zIndex: 1000,
              elevation: 5,
            },
            container: {
              flex: 1,
              zIndex: 1000,
            },
          }}
        />

        {toLoc && (
          <TouchableOpacity
            onPress={() => {
              dispatch(setToLocation(""));
              onLocationChange("toLocation", "");
              setLocalToValue("");
            }}
          >
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
  mapContainer: {
    flex: 1,
    backgroundColor: "#fff",
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
    paddingVertical: 6,
    fontSize: 16,
  },
  mapActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  mapActionText: {
    fontSize: 16,
    color: "blue",
  },
});

export default LocationInputs;