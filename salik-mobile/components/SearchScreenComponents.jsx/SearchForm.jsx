import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import appColors from "../../constants/colors";
import CustomDatePicker from "./CustomDatePicker";
import CustomTimePicker from "./CustomTimePicker";
import LocationInputs from "./LocationInputs";
import { useSelector } from "react-redux";

const SearchForm = () => {
  const fromLoc = useSelector((state) => state.location.fromLocation);
  const toLoc = useSelector((state) => state.location.toLocation);
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
  
const isActive= formData.fromLocation && formData.toLocation && formData.date || fromLoc && toLoc && formData.date

  return (
    <View>
      {/* Location Inputs */}
      <LocationInputs
        fromLocation={formData.fromLocation}
        toLocation={formData.toLocation}
        onChange={handleFormData}
      />

      {/* DatePicker */}
      <CustomDatePicker selectedDate={formData.date} onDateChange={(date) => handleFormData("date", date)} />

      {/* Time */}
      <CustomTimePicker selectedTime={formData.time} onTimeChange={(time) => handleFormData("time", time)} />

      {/* Submit Button */}
      <TouchableOpacity
        disabled={!formData.fromLocation || !formData.toLocation || !formData.date}
      >
        <Text
          style={[
            {
              backgroundColor:
                isActive ? appColors.primary : "#eee",
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
});

export default SearchForm;
