import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Text,
  Alert,
  StyleSheet,
  RefreshControl,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  postServiceData,
  resetSuccess,
  updateService,
} from "../../redux/slices/ServiceSlice.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Map from "../MapComponent/Map.jsx";
import BackButton from "./BackButton";
import FormInput from "./FormInput";
import WorkingDaysSelector from "./WorkingDaysSelector";
import TimePicker from "./TimePicker";
import SubmitButton from "./SubmitButton";
import appColors from "../../constants/colors.js";
import { GOOGLE_API_KEY } from "@env";

// Memoized Location Field Component
const LocationField = React.memo(
  ({
    form,
    setForm,
    error,
    openMapModal,
    isMapSelection,
    setIsMapSelection,
  }) => {
    const [inputValue, setInputValue] = useState(form.location);

    useEffect(() => {
      console.log("Syncing inputValue with form.location:", form.location);
      setInputValue(form.location);
    }, [form.location]);

    const handlePlaceSelect = (data) => {
      const address = data.description;
      console.log("Selected Service Location (Autocomplete):", address);
      setIsMapSelection(false);
      setInputValue(address);
      setForm((prevForm) => ({ ...prevForm, location: address }));
    };

    const handleTextChange = (text) => {
      console.log(
        "Text input changed to:",
        text,
        "| Previous inputValue:",
        inputValue,
        "| form.location:",
        form.location,
        "| isMapSelection:",
        isMapSelection
      );
      if (isMapSelection && text !== form.location) {
        console.log("Preserving map selection:", form.location);
        setInputValue(form.location);
        return;
      }
      setIsMapSelection(false);
      setInputValue(text);
    };

    const clearLocation = () => {
      console.log("Clearing location input");
      setInputValue("");
      setForm((prevForm) => ({ ...prevForm, location: "" }));
    };

    return (
      <View>
        <Text style={styles.label}>Location</Text>
        <View style={styles.inputWithIconContainer}>
          <GooglePlacesAutocomplete
            placeholder="Enter service location"
            onPress={handlePlaceSelect}
            query={{
              key: GOOGLE_API_KEY,
              language: "en",
            }}
            styles={{
              container: styles.autocompleteContainer,
              textInput: [styles.autocompleteInput, error && styles.errorInput],
              listView: styles.autocompleteList,
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
            textInputProps={{
              value: inputValue,
              onChangeText: handleTextChange,
              onBlur: () => {
                console.log(
                  "Blur triggered, setting form.location to:",
                  inputValue
                );
                setForm((prev) => ({ ...prev, location: inputValue }));
              },
            }}
            listViewDisplayed="auto"
            keyboardShouldPersistTaps="always"
            onFail={(error) => console.log("Autocomplete error:", error)}
          />
          <TouchableOpacity style={styles.iconButton} onPress={openMapModal}>
            <Ionicons
              name="location-outline"
              size={20}
              color={appColors.primary}
            />
          </TouchableOpacity>
          {inputValue ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearLocation}
            >
              <Ionicons name="close-circle" size={20} color="red" />
            </TouchableOpacity>
          ) : null}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

// Custom Service Type Dropdown Component
const ServiceTypeInput = ({ value, onValueChange, error, disabled }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const options = [
    { label: "Select a service type", value: "" },
    { label: "Fuel", value: "fuel" },
    { label: "Mechanic", value: "mechanic" },
  ];

  const displayValue =
    options.find((option) => option.value === value)?.label ||
    "Select a service type";

  const handleSelect = (selectedValue) => {
    if (selectedValue === "" || disabled) return;
    onValueChange(selectedValue);
    setModalVisible(false);
  };

  return (
    <View>
      <Text style={styles.label}>Service Type</Text>
      {Platform.OS === "android" ? (
        <View
          style={[
            styles.pickerContainer,
            error && styles.errorInput,
            disabled && styles.disabledInput,
          ]}
        >
          <Picker
            selectedValue={value}
            onValueChange={(itemValue) => {
              if (itemValue !== "" && !disabled) onValueChange(itemValue);
            }}
            style={styles.picker}
            mode="dropdown"
            dropdownIconColor={appColors.primary}
            enabled={!disabled}
          >
            {options.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
                enabled={option.value !== "" && !disabled}
              />
            ))}
          </Picker>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.input,
            error && styles.errorInput,
            disabled && styles.disabledInput,
          ]}
          onPress={() => !disabled && setModalVisible(true)}
          disabled={disabled}
        >
          <Text
            style={[
              styles.inputText,
              !value && styles.placeholderText,
              disabled && styles.disabledText,
            ]}
          >
            {displayValue}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={disabled ? "#999" : appColors.primary}
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {Platform.OS === "ios" && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.modalItem,
                    option.value === "" && styles.disabledItem,
                  ]}
                  onPress={() => handleSelect(option.value)}
                  disabled={option.value === "" || disabled}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      option.value === "" && styles.disabledText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

function AddServiceForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const { loading, success, error } = useSelector((state) => state.service);
  const [alertVisible, setAlertVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [isMapSelection, setIsMapSelection] = useState(false);
  const [hasShownSuccess, setHasShownSuccess] = useState(false);

  // Determine if in edit mode
  const isEditMode = params.mode === "edit" || !!params.serviceId;

  // Initialize form state, pre-filling with params if in edit mode
  const [form, setForm] = useState({
    location: params.location || "",
    serviceType: params.serviceType || "",
    workingDays: params.workingDays ? JSON.parse(params.workingDays) : [],
    startTime: params.workingHoursFrom
      ? new Date(params.workingHoursFrom)
      : new Date(),
    endTime: params.workingHoursTo
      ? new Date(params.workingHoursTo)
      : new Date(new Date().setHours(new Date().getHours() + 8)),
  });

  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [errors, setErrors] = useState({});

  // Clear success state on mount to prevent stale success triggers
  useEffect(() => {
    console.log("AddServiceForm mounted, params:", params);
    dispatch(resetSuccess());
    setHasShownSuccess(false);
    setAlertVisible(false);
  }, [dispatch]);

  const validateForm = useCallback(() => {
    let newErrors = {};
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.serviceType)
      newErrors.serviceType = "Please select a service type";
    if (form.workingDays.length === 0)
      newErrors.workingDays = "Select at least one day";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const toggleWorkingDay = (day) => {
    setForm((prevForm) => {
      const updatedDays = prevForm.workingDays.includes(day)
        ? prevForm.workingDays.filter((d) => d !== day)
        : [...prevForm.workingDays, day];
      return { ...prevForm, workingDays: updatedDays };
    });
  };

  const handleTimeChange = (event, selectedTime, type) => {
    if (selectedTime) {
      setForm((prevForm) => ({ ...prevForm, [type]: selectedTime }));
    }
    setShowStartTime(false);
    setShowEndTime(false);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setHasShownSuccess(false);

    const serviceData = {
      serviceType: form.serviceType,
      location: {
        description: form.location.trim(),
      },
      addressOnly: form.location.trim(),

      workingDays: form.workingDays,
      workingHours: {
        from: form.startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        to: form.endTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      },
    };

    console.log("Submitting service data:", serviceData);

    if (isEditMode) {
      dispatch(
        updateService({
          serviceId: params.serviceId,
          ...serviceData,
        })
      );
    } else {
      dispatch(postServiceData(serviceData));
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setForm({
      location: isEditMode ? params.location || "" : "",
      serviceType: isEditMode ? params.serviceType || "" : "",
      workingDays: isEditMode ? JSON.parse(params.workingDays || "[]") : [],
      startTime: isEditMode
        ? new Date(params.workingHoursFrom || new Date())
        : new Date(),
      endTime: isEditMode
        ? new Date(params.workingHoursTo || new Date())
        : new Date(new Date().setHours(new Date().getHours() + 8)),
    });
    setErrors({});
    setFocusedField(null);
    setShowStartTime(false);
    setShowEndTime(false);
    dispatch(clearError());
    dispatch(resetSuccess());
    setHasShownSuccess(false);
    setAlertVisible(false);
    setTimeout(() => setRefreshing(false), 1000);
  }, [dispatch, isEditMode, params]);

  useEffect(() => {
    if (success && !alertVisible && !hasShownSuccess) {
      setAlertVisible(true);
      setHasShownSuccess(true); // Prevent multiple alerts
      Alert.alert(
        "Success",
        isEditMode
          ? "✅ Service updated successfully!"
          : "✅ Service added successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              setAlertVisible(false);
              dispatch(resetSuccess());
              router.push("/servicesProvider");
            },
          },
        ]
      );
    }

    if (error && !alertVisible) {
      setAlertVisible(true);
      const errorMessage =
        error?.message ||
        (typeof error === "string"
          ? error
          : "❌ An unexpected error occurred. Please try again.");
      Alert.alert("Error", `❌ ${errorMessage}`, [
        {
          text: "OK",
          onPress: () => {
            setAlertVisible(false);
            dispatch(clearError());
          },
        },
      ]);
    }
  }, [
    success,
    error,
    alertVisible,
    hasShownSuccess,
    dispatch,
    router,
    isEditMode,
  ]);
  const openMapModal = () => {
    console.log("Opening map modal");
    setMapModalVisible(true);
  };

  const handleMapLocationSelect = useCallback((address) => {
    console.log("Map location selected:", address);
    setIsMapSelection(true);
    setForm((prevForm) => {
      const newForm = { ...prevForm, location: address };
      console.log("Updated form with map selection:", newForm);
      return newForm;
    });
    setMapModalVisible(false);
  }, []);

  const renderFormContent = () => (
    <View style={styles.formContainer}>
      <BackButton />
      <Text style={styles.title}>
        {isEditMode ? "Edit Service Details" : "Add Service Details"}
      </Text>

      <LocationField
        form={form}
        setForm={setForm}
        error={errors.location}
        openMapModal={openMapModal}
        isMapSelection={isMapSelection}
        setIsMapSelection={setIsMapSelection}
      />

      <ServiceTypeInput
        value={form.serviceType}
        onValueChange={(itemValue) =>
          setForm({ ...form, serviceType: itemValue })
        }
        error={errors.serviceType}
        disabled={isEditMode}
      />

      <WorkingDaysSelector
        workingDays={form.workingDays}
        toggleWorkingDay={toggleWorkingDay}
        error={errors.workingDays}
      />
      <TimePicker
        startTime={form.startTime}
        endTime={form.endTime}
        showStartTime={showStartTime}
        showEndTime={showEndTime}
        setShowStartTime={setShowStartTime}
        setShowEndTime={setShowEndTime}
        handleTimeChange={handleTimeChange}
        error={errors.time}
      />
      <SubmitButton onPress={handleSubmit} loading={loading} />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <FlatList
        data={[{}]}
        renderItem={() => renderFormContent()}
        keyExtractor={() => "form"}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.container}
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
            <Text style={styles.modalTitle}>Select Service Location</Text>
          </View>
          <Map onLocationSelect={handleMapLocationSelect} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    minHeight: 800,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
  clearButton: {
    position: "absolute",
    right: 45,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  pickerContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  dropdownIcon: {
    marginRight: 5,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "80%",
    padding: 10,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  disabledItem: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#999",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 30,
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

export default AddServiceForm;
