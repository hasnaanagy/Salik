import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  Text,
  Alert,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  postServiceData,
  resetSuccess,
} from "../../redux/slices/addServiceSlice.js";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./BackButton";
import FormInput from "./FormInput";
import ServiceTypePicker from "./ServiceTypePicker";
import WorkingDaysSelector from "./WorkingDaysSelector";
import TimePicker from "./TimePicker";
import SubmitButton from "./SubmitButton";

export default function AddServiceForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.addServices);
  const [alertVisible, setAlertVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State for RefreshControl

  const [form, setForm] = useState({
    location: "",
    serviceType: "",
    workingDays: [],
    startTime: new Date(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 8)),
  });

  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    let newErrors = {};
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.serviceType.trim())
      newErrors.serviceType = "Service type is required";
    if (form.workingDays.length === 0)
      newErrors.workingDays = "Select at least one day";
    setErrors(newErrors);
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
    validateForm();
    const newErrors = {};
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.serviceType.trim())
      newErrors.serviceType = "Service type is required";
    if (form.workingDays.length === 0)
      newErrors.workingDays = "Select at least one day";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const serviceData = {
      serviceType: form.serviceType.trim(),
      location: { description: form.location.trim() },
      workingDays: form.workingDays,
      workingHours: {
        from: form.startTime.toISOString(),
        to: form.endTime.toISOString(),
      },
    };

    console.log(serviceData);
    dispatch(postServiceData(serviceData));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Reset form to initial state
    setForm({
      location: "",
      serviceType: "",
      workingDays: [],
      startTime: new Date(),
      endTime: new Date(new Date().setHours(new Date().getHours() + 8)),
    });
    setErrors({});
    setFocusedField(null);
    setShowStartTime(false);
    setShowEndTime(false);
    // Optionally clear Redux state if needed
    dispatch(clearError());
    dispatch(resetSuccess());

    // Simulate a delay for the refresh animation (optional)
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [dispatch]);

  useEffect(() => {
    if (success && !alertVisible) {
      setAlertVisible(true);
      Alert.alert("Success", "✅ Service added successfully!", [
        {
          text: "OK",
          onPress: () => {
            setAlertVisible(false);
            dispatch(resetSuccess());
            router.push("/");
          },
        },
      ]);
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
  }, [success, error, alertVisible, dispatch, router]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <BackButton />
        <Text style={styles.title}>Add Service Details</Text>
        <FormInput
          label="Location"
          value={form.location}
          onChangeText={(text) => setForm({ ...form, location: text })}
          placeholder="Enter location"
          error={errors.location}
          onFocus={setFocusedField}
          onBlur={() => setFocusedField(null)}
          focusedField={focusedField}
          fieldName="location"
        />
        <ServiceTypePicker
          value={form.serviceType}
          onValueChange={(itemValue) =>
            setForm({ ...form, serviceType: itemValue })
          }
          error={errors.serviceType}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    minHeight: 800,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});
