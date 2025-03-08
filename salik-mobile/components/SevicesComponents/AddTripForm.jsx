import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  postRideData,
  clearError,
  resetSuccess,
} from "../../redux/slices/addRideSlice";
import appColors from "../../constants/colors.js";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTripForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.rideService);

  const [form, setForm] = useState({
    fromLocation: "",
    toLocation: "",
    seats: "",
    price: "",
    carType: "",
    date: new Date(),
    time: new Date(),
  });

  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!form.fromLocation) newErrors.fromLocation = "Required";
    if (!form.toLocation) newErrors.toLocation = "Required";
    if (!form.seats || isNaN(form.seats))
      newErrors.seats = "Valid number required";
    if (!form.price || isNaN(form.price))
      newErrors.price = "Valid price required";
    if (!form.carType) newErrors.carType = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // إرجاع true إذا لم يكن هناك أخطاء
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const rideData = {
      carType: form.carType,
      fromLocation: form.fromLocation,
      toLocation: form.toLocation,
      totalSeats: parseInt(form.seats, 10),
      price: parseFloat(form.price),
      date: form.date.toISOString().split("T")[0],
      time: form.time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    dispatch(postRideData(rideData));
  };

  useEffect(() => {
    if (success) {
      Alert.alert("Success", "Trip added successfully!", [
        {
          text: "OK",
          onPress: () => {
            dispatch(resetSuccess()); // إعادة ضبط الحالة
            setForm({
              fromLocation: "",
              toLocation: "",
              seats: "",
              price: "",
              carType: "",
              date: new Date(),
              time: new Date(),
            });
            router.push("/"); // العودة إلى الصفحة الرئيسية
          },
        },
      ]);
    }

    if (error) {
      Alert.alert("Error", error);
      dispatch(clearError());
    }
  }, [success, error]);
  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setForm({ ...form, date: selectedDate });
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setForm({ ...form, time: selectedTime });
    }
    setShowTimePicker(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.title}>Add Trip Details</Text>
            </View>

            <TextInput
              style={[styles.input, errors.fromLocation && styles.errorInput]}
              placeholder="Enter departure location"
              value={form.fromLocation}
              onChangeText={(text) => {
                setForm({ ...form, fromLocation: text });
                if (errors.fromLocation) {
                  setErrors({ ...errors, fromLocation: undefined });
                }
              }}
            />
            {errors.fromLocation && (
              <Text style={styles.errorText}>{errors.fromLocation}</Text>
            )}

            <TextInput
              style={[styles.input, errors.toLocation && styles.errorInput]}
              placeholder="Enter destination"
              value={form.toLocation}
              onChangeText={(text) => {
                setForm({ ...form, toLocation: text });
                if (errors.toLocation) {
                  setErrors({ ...errors, toLocation: undefined });
                }
              }}
            />
            {errors.toLocation && (
              <Text style={styles.errorText}>{errors.toLocation}</Text>
            )}

            <TextInput
              style={[styles.input, errors.seats && styles.errorInput]}
              placeholder="Enter available seats"
              keyboardType="numeric"
              value={form.seats}
              onChangeText={(text) => {
                setForm({ ...form, seats: text });
                if (errors.seats) {
                  setErrors({ ...errors, seats: undefined });
                }
              }}
            />
            {errors.seats && (
              <Text style={styles.errorText}>{errors.seats}</Text>
            )}

            <TextInput
              style={[styles.input, errors.price && styles.errorInput]}
              placeholder="Enter price"
              keyboardType="numeric"
              value={form.price}
              onChangeText={(text) => {
                setForm({ ...form, price: text });
                if (errors.price) {
                  setErrors({ ...errors, price: undefined });
                }
              }}
            />
            {errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}

            <TextInput
              style={[styles.input, errors.carType && styles.errorInput]}
              placeholder="Enter car type"
              value={form.carType}
              onChangeText={(text) => {
                setForm({ ...form, carType: text });
                if (errors.carType) {
                  setErrors({ ...errors, carType: undefined });
                }
              }}
            />
            {errors.carType && (
              <Text style={styles.errorText}>{errors.carType}</Text>
            )}

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.placeholderText}>
                {form.time.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={form.time}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.placeholderText}>
                {form.date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={form.date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <TouchableOpacity
              style={[styles.addButton]}
              onPress={handleSubmit}
              // disabled={!isFormValid}
            >
              <Text style={styles.addButtonText}>Add Trip</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    minHeight: 900,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 50,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    justifyContent: "center",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  placeholderText: {
    color: "#888",
  },
  addButton: {
    backgroundColor: appColors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 5,
    left: 0,
    zIndex: 10,
  },
});
