import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import appColors from "../../constants/colors";
import CustomDatePicker from "./CustomDatePicker";
import CustomTimePicker from "./CustomTimePicker";
import LocationInputs from "./LocationInputs";
import { useDispatch, useSelector } from "react-redux";
import { searchRidesAction } from "../../redux/slices/addRideSlice";
import SearchResultsComponent from "./SearchResultsComponent";
import RideDetailesComponent from "./RideDetailesComponent";

const SearchForm = () => {
  const [displayResults, setDisplayResults] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null); // Track selected ride
  const dispatch = useDispatch();
  const fromLoc = useSelector((state) => state.location.fromLocation);
  const toLoc = useSelector((state) => state.location.toLocation);
  const { rides } = useSelector((state) => state.rideService);

  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    date: "",
    time: "",
  });

  const handleFormData = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    const searchParams = {
      fromLocation: formData.fromLocation || fromLoc,
      toLocation: formData.toLocation || toLoc,
      date: formData.date,
      time: formData.time,
    };
    await dispatch(searchRidesAction(searchParams));
    setDisplayResults(true);
  };

  const isActive =
    (formData.fromLocation && formData.toLocation && formData.date) ||
    (fromLoc && toLoc && formData.date);

  const renderForm = () => (
    <View>
      <LocationInputs
        fromLocation={formData.fromLocation}
        toLocation={formData.toLocation}
        onLocationChange={handleFormData}
      />
      <CustomDatePicker
        selectedDate={formData.date}
        onDateChange={(date) => handleFormData("date", date)}
      />
      <CustomTimePicker
        selectedTime={formData.time}
        onTimeChange={(time) => handleFormData("time", time)}
      />
      <TouchableOpacity onPress={handleSearch} disabled={!isActive}>
        <Text
          style={[
            {
              backgroundColor: isActive ? appColors.primary : "#eee",
              color: isActive ? "black" : "#ccc",
            },
            styles.button,
          ]}
        >
          Confirm PickUp
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {!displayResults ? (
        renderForm() // Direct rendering without FlatList
      ) : selectedRide ? (
        <RideDetailesComponent ride={selectedRide} setSelectedRide={setSelectedRide} />
      ) : (
        <SearchResultsComponent
          setDisplayResults={setDisplayResults}
          setSelectedRide={setSelectedRide}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 14,
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default SearchForm;