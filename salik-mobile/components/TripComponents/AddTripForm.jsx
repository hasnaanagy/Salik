import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  RefreshControl,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  postRideData,
  clearError,
  resetSuccess,
  updateRideAction,
} from "../../redux/slices/RideSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import Map from "../MapComponent/Map.jsx";
import Header from "./Header";
import FormInput from "./FormInput";
import DateTimePickerButton from "./DateTimePickerButton";
import SubmitButton from "./SubmitButton";
import appColors from "../../constants/colors.js";
import { GOOGLE_API_KEY } from "@env";

// Utility function to format time in 'hh:mm AM/PM' format
const formatTimeToHHMMAMPM = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM/PM
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

// Utility function to parse 'hh:mm AM/PM' string into a Date object
const parseTimeFromHHMMAMPM = (timeStr) => {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Memoized component for Departure Location field
const DepartureLocationField = React.memo(
  ({ form, updateForm, error, editable, openMapModal }) => {
    const [inputValue, setInputValue] = useState(form.fromLocation);

    useEffect(() => {
      setInputValue(form.fromLocation);
      console.log("DepartureLocationField updated with:", form.fromLocation);
    }, [form.fromLocation]);

    const handlePlaceSelect = (data, details = null) => {
      console.log("handlePlaceSelect triggered with data:", data);
      const address = data.description;
      console.log("Selected Departure Address:", address, "Details:", details);
      setInputValue(address);
      updateForm("fromLocation", address);
    };

    const handleTextChange = (text) => {
      console.log("Text changed to:", text);
      setInputValue(text);
    };

    return (
      <>
        <Text style={styles.label}>Departure Location</Text>
        <View style={styles.inputWithIconContainer}>
          <GooglePlacesAutocomplete
            placeholder="Enter departure location"
            onPress={(data, details) => {
              console.log("onPress called with:", data);
              handlePlaceSelect(data, details);
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: "en",
            }}
            styles={{
              container: styles.autocompleteContainer,
              textInput: [
                styles.autocompleteInput,
                error && styles.errorInput,
              ],
              listView: styles.autocompleteList,
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
            textInputProps={{
              value: inputValue,
              onChangeText: handleTextChange,
              onBlur: () => {
                console.log("Blur with value:", inputValue);
                updateForm("fromLocation", inputValue);
              },
              editable,
            }}
            listViewDisplayed="auto"
            keyboardShouldPersistTaps="always"
            onFail={(error) => console.log("Autocomplete error:", error)}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              console.log("Map icon pressed");
              openMapModal("fromLocation");
            }}
            disabled={!editable}
          >
            <Ionicons name="location-outline" size={20} color={appColors.primary} />
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </>
    );
  }
);

// Memoized component for Destination field
const DestinationField = React.memo(
  ({ form, updateForm, error, editable, openMapModal }) => {
    const [inputValue, setInputValue] = useState(form.toLocation);

    useEffect(() => {
      setInputValue(form.toLocation);
      console.log("DestinationField updated with:", form.toLocation);
    }, [form.toLocation]);

    const handlePlaceSelect = (data, details = null) => {
      console.log("handlePlaceSelect triggered with data:", data);
      const address = data.description;
      console.log("Selected Destination Address:", address, "Details:", details);
      setInputValue(address);
      updateForm("toLocation", address);
    };

    const handleTextChange = (text) => {
      console.log("Text changed to:", text);
      setInputValue(text);
    };

    return (
      <>
        <Text style={styles.label}>Destination</Text>
        <View style={styles.inputWithIconContainer}>
          <GooglePlacesAutocomplete
            placeholder="Enter destination"
            onPress={(data, details) => {
              console.log("onPress called with:", data);
              handlePlaceSelect(data, details);
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: "en",
            }}
            styles={{
              container: styles.autocompleteContainer,
              textInput: [
                styles.autocompleteInput,
                error && styles.errorInput,
              ],
              listView: styles.autocompleteList,
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
            textInputProps={{
              value: inputValue,
              onChangeText: handleTextChange,
              onBlur: () => {
                console.log("Blur with value:", inputValue);
                updateForm("toLocation", inputValue);
              },
              editable,
            }}
            listViewDisplayed="auto"
            keyboardShouldPersistTaps="always"
            onFail={(error) => console.log("Autocomplete error:", error)}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              console.log("Map icon pressed");
              openMapModal("toLocation");
            }}
            disabled={!editable}
          >
            <Ionicons name="location-outline" size={20} color={appColors.primary} />
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </>
    );
  }
);

// Memoized component for other form fields
const OtherFields = React.memo(
  ({ form, errors, focusedField, setFocusedField, updateForm, editable }) => (
    <>
      <Text style={styles.label}>Available Seats</Text>
      <FormInput
        placeholder="Enter available seats"
        value={form.totalSeats}
        onChangeText={(text) => updateForm("totalSeats", text)}
        error={errors.totalSeats}
        keyboardType="numeric"
        onFocus={() => setFocusedField("totalSeats")}
        onBlur={() => setFocusedField(null)}
        focused={focusedField === "totalSeats"}
        icon="people-outline"
        autoFocus={false}
        blurOnSubmit={false}
      />

      <Text style={styles.label}>Price</Text>
      <FormInput
        placeholder="Enter price"
        value={form.price}
        onChangeText={(text) => updateForm("price", text)}
        error={errors.price}
        keyboardType="numeric"
        onFocus={() => setFocusedField("price")}
        onBlur={() => setFocusedField(null)}
        focused={focusedField === "price"}
        icon="cash-outline"
        autoFocus={false}
        blurOnSubmit={false}
      />

      <Text style={styles.label}>Car Type</Text>
      <FormInput
        placeholder="Enter car type"
        value={form.carType}
        onChangeText={(text) => updateForm("carType", text)}
        error={errors.carType}
        editable={editable}
        onFocus={() => setFocusedField("carType")}
        onBlur={() => setFocusedField(null)}
        focused={focusedField === "carType"}
        icon="car-outline"
        autoFocus={false}
        blurOnSubmit={false}
      />
    </>
  )
);

// Memoized component for Date and Time fields
const DateTimeFields = React.memo(
  ({ form, updateForm, disabled }) => (
    <>
      <Text style={styles.label}>Time</Text>
      <DateTimePickerButton
        value={form.time}
        mode="time"
        onChange={(time) => updateForm("time", time)}
        displayFormat={formatTimeToHHMMAMPM} // Use the utility function for display
        disabled={disabled}
      />

      <Text style={styles.label}>Date</Text>
      <DateTimePickerButton
        value={form.date}
        mode="date"
        onChange={(date) => updateForm("date", date)}
        displayFormat={(date) => date.toLocaleDateString()}
        disabled={disabled}
      />
    </>
  )
);

export default function AddTripForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { loading, success, error, isEditMode } = useSelector(
    (state) => state.rideService
  );
  const { ride } = useLocalSearchParams();
  const editRide = useMemo(() => (ride ? JSON.parse(ride) : null), [ride]);

  const [form, setForm] = useState({
    fromLocation: "",
    toLocation: "",
    totalSeats: "",
    price: "",
    carType: "",
    date: new Date(),
    time: new Date(),
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedLocationField, setSelectedLocationField] = useState(null);

  useEffect(() => {
    if (editRide) {
      const newForm = {
        fromLocation: editRide.fromLocation || "",
        toLocation: editRide.toLocation || "",
        totalSeats: editRide.totalSeats ? editRide.totalSeats.toString() : "",
        price: editRide.price ? editRide.price.toString() : "",
        carType: editRide.carType || "",
        date: editRide.date ? new Date(editRide.date) : new Date(),
        time: editRide.time
          ? parseTimeFromHHMMAMPM(editRide.time) // Parse the 'hh:mm AM/PM' format
          : new Date(),
      };
      setForm(newForm);
    }
  }, [editRide]);

  useEffect(() => {
    if (success && !alertVisible) {
      setAlertVisible(true);
      Alert.alert(
        "Success",
        isEditMode
          ? "✅ Ride updated successfully!"
          : "✅ Ride added successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              setAlertVisible(false);
              dispatch(resetSuccess());
              router.push("/");
            },
          },
        ]
      );
    }
    if (error && !alertVisible) {
      setAlertVisible(true);
      Alert.alert("Error", `❌ ${error.message}`, [
        {
          text: "OK",
          onPress: () => {
            setAlertVisible(false);
            dispatch(clearError());
          },
        },
      ]);
    }
  }, [success, error, isEditMode, dispatch, router, alertVisible]);

  const validateForm = useCallback(() => {
    let newErrors = {};
    if (!form.fromLocation) newErrors.fromLocation = "Required";
    if (!form.toLocation) newErrors.toLocation = "Required";
    if (!form.totalSeats || isNaN(form.totalSeats))
      newErrors.totalSeats = "Valid number required";
    if (!form.price || isNaN(form.price))
      newErrors.price = "Valid price required";
    if (!form.carType) newErrors.carType = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;
    const rideData = {
      carType: form.carType,
      fromLocation: form.fromLocation,
      toLocation: form.toLocation,
      totalSeats: parseInt(form.totalSeats, 10),
      price: parseFloat(form.price),
      date: form.date.toISOString().split("T")[0],
      time: formatTimeToHHMMAMPM(form.time), // Use the utility function for submission
    };
    console.log("Submitting ride data:", rideData); // Log the data being sent
    if (editRide) {
      dispatch(updateRideAction({ id: editRide._id, form: rideData }));
    } else {
      dispatch(postRideData(rideData));
    }
  }, [form, editRide, dispatch, validateForm]);

  const updateForm = useCallback((key, value) => {
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
    if (errors[key]) setErrors((prevErrors) => ({ ...prevErrors, [key]: undefined }));
  }, [errors]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (!editRide) {
      const newForm = {
        fromLocation: "",
        toLocation: "",
        totalSeats: "",
        price: "",
        carType: "",
        date: new Date(),
        time: new Date(),
      };
      setForm(newForm);
      setErrors({});
      setFocusedField(null);
      dispatch(clearError());
      dispatch(resetSuccess());
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [editRide, dispatch]);

  const openMapModal = useCallback((field) => {
    setSelectedLocationField(field);
    setMapModalVisible(true);
  }, []);

  const handleMapLocationSelect = useCallback((address) => {
    updateForm(selectedLocationField, address);
    setMapModalVisible(false);
  }, [selectedLocationField, updateForm]);

  const renderFormContent = useCallback(() => (
    <View style={styles.formContainer}>
      <Header title={editRide ? "Edit Trip Details" : "Add Trip Details"} />

      <DepartureLocationField
        form={form}
        updateForm={updateForm}
        error={errors.fromLocation}
        editable={!editRide}
        openMapModal={openMapModal}
      />

      <DestinationField
        form={form}
        updateForm={updateForm}
        error={errors.toLocation}
        editable={!editRide}
        openMapModal={openMapModal}
      />

      <OtherFields
        form={form}
        errors={errors}
        focusedField={focusedField}
        setFocusedField={setFocusedField}
        updateForm={updateForm}
        editable={!editRide}
      />

      <DateTimeFields
        form={form}
        updateForm={updateForm}
        disabled={!!editRide}
      />

      <SubmitButton
        loading={loading}
        onPress={handleSubmit}
        isEditMode={!!editRide}
      />
    </View>
  ), [
    editRide,
    errors,
    focusedField,
    form,
    loading,
    updateForm,
    openMapModal,
    handleSubmit,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <FlatList
          data={[{}]}
          renderItem={() => null}
          ListHeaderComponent={renderFormContent}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.flatListContent}
          keyboardShouldPersistTaps="always"
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={mapModalVisible}
          onRequestClose={() => setMapModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setMapModalVisible(false)}>
                <Ionicons name="close" size={30} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                Select {selectedLocationField === "fromLocation" ? "Departure" : "Destination"} Location
              </Text>
            </View>
            <Map onLocationSelect={handleMapLocationSelect} />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  inputWithIconContainer: {
    position: "relative",
    marginBottom: 20,
  },
  autocompleteContainer: {
    flex: 1,
  },
  autocompleteInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingRight: 45,
    backgroundColor: "#fff",
  },
  autocompleteList: {
    borderWidth: 0,
    borderRadius: 10,
    elevation: 2,
  },
  iconButton: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});