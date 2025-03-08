import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Checkbox } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import appColors from "../../constants/colors.js";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  postServiceData,
  resetSuccess,
} from "../../redux/slices/addServiceSlice.js";

export default function AddServiceForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.addServices);

  const [form, setForm] = useState({
    location: "",
    serviceType: "",
    workingDays: [],
    startTime: new Date(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
  });

  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (success) {
      alert("Service added successfully!");
      dispatch(resetSuccess());
      router.push("/services");
    }
  }, [success]);

  const validateForm = useCallback(() => {
    let newErrors = {};
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.serviceType.trim())
      newErrors.serviceType = "Service type is required";
    if (form.workingDays.length === 0)
      newErrors.workingDays = "Select at least one day";
    if (form.startTime >= form.endTime)
      newErrors.time = "End time must be after start time";

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
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
    validateForm(); // تأكد من التحقق قبل الإرسال
    if (!isValid) {
      console.log("🚨 Validation Errors:", errors);
      alert("❌ Please fix the errors before submitting!");
      return;
    }
    const serviceData = {
      serviceType: form.serviceType.trim(),
      location: {
        description: form.location.trim(),
      },
      workingDays: form.workingDays,
      workingHours: {
        from: form.startTime.toISOString(),
        to: form.endTime.toISOString(),
      },
    };
    console.log(serviceData);
    dispatch(postServiceData(serviceData));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Add Service Details</Text>

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={[styles.input, errors.location && styles.errorInput]}
        placeholder="Enter location"
        value={form.location}
        onChangeText={(text) => setForm({ ...form, location: text })}
      />
      {errors.location && (
        <Text style={styles.errorText}>{errors.location}</Text>
      )}

      <Text style={styles.label}>Service Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.serviceType}
          onValueChange={(itemValue) =>
            setForm({ ...form, serviceType: itemValue })
          }
          style={styles.picker}
        >
          <Picker.Item label="Select Service Type" value="" />
          <Picker.Item label="Mechanic" value="mechanic" />
          <Picker.Item label="Fuel" value="fuel" />
        </Picker>
      </View>

      {errors.serviceType && (
        <Text style={styles.errorText}>{errors.serviceType}</Text>
      )}

      <Text style={styles.label}>Working Days:</Text>
      <View style={styles.daysContainer}>
        {[
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ].map((day) => (
          <View key={day} style={styles.dayItem}>
            <Checkbox
              status={form.workingDays.includes(day) ? "checked" : "unchecked"}
              onPress={() => toggleWorkingDay(day)}
            />
            <Text>{day}</Text>
          </View>
        ))}
      </View>
      {errors.workingDays && (
        <Text style={styles.errorText}>{errors.workingDays}</Text>
      )}

      <Text style={styles.label}>Working Hours:</Text>
      <View style={styles.timeContainer}>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowStartTime(true)}
        >
          <Ionicons name="time-outline" size={20} color="black" />
          <Text>
            {form.startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowEndTime(true)}
        >
          <Ionicons name="time-outline" size={20} color="black" />
          <Text>
            {form.endTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
      </View>
      {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}

      {showStartTime && (
        <DateTimePicker
          value={form.startTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) =>
            handleTimeChange(event, selectedTime, "startTime")
          }
        />
      )}

      {showEndTime && (
        <DateTimePicker
          value={form.endTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) =>
            handleTimeChange(event, selectedTime, "endTime")
          }
        />
      )}

      <TouchableOpacity
        style={[styles.submitButton]}
        onPress={handleSubmit}
        // disabled={!isValid}
      >
        <Text style={styles.submitButtonText}>Add Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 10,
    minHeight: 800,
  },
  backButton: { position: "absolute", top: 15, left: 15, zIndex: 10 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
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
  daysContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 15 },
  dayItem: { flexDirection: "row", alignItems: "center", width: "33%" },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "45%",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: appColors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: { backgroundColor: "#ccc" },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  pickerContainer: {
    borderWidth: 1, // سمك الإطار
    borderColor: "#ccc", // لون الإطار
    borderRadius: 10, // تدوير الحواف
    backgroundColor: "#fff", // لون الخلفية
    marginBottom: 20, // هامش سفلي
    overflow: "hidden", // إخفاء الحواف الداخلية الزائدة
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
