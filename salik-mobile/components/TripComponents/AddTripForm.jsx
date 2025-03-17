import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  postRideData,
  clearError,
  resetSuccess,
  updateRideAction,
} from "../../redux/slices/addRideSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./Header";
import FormInput from "./FormInput";
import DateTimePickerButton from "./DateTimePickerButton";
import SubmitButton from "./SubmitButton";

export default function AddTripForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State for RefreshControl
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

  useEffect(() => {
    if (editRide) {
      setForm({
        fromLocation: editRide.fromLocation || "",
        toLocation: editRide.toLocation || "",
        totalSeats: editRide.totalSeats ? editRide.totalSeats.toString() : "",
        price: editRide.price ? editRide.price.toString() : "",
        carType: editRide.carType || "",
        date: editRide.date ? new Date(editRide.date) : new Date(),
        time: editRide.time
          ? new Date(`1970-01-01T${editRide.time.padStart(5, "0")}:00`)
          : new Date(),
      });
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
      Alert.alert("Error", ` ❌ ${error.message}`, [
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

  const validateForm = () => {
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
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const rideData = {
      carType: form.carType,
      fromLocation: form.fromLocation,
      toLocation: form.toLocation,
      totalSeats: parseInt(form.totalSeats, 10),
      price: parseFloat(form.price),
      date: form.date.toISOString().split("T")[0],
      time: form.time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
    if (editRide) {
      dispatch(updateRideAction({ id: editRide._id, form: rideData }));
    } else {
      dispatch(postRideData(rideData));
    }
  };

  const updateForm = (key, value) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Reset form to initial state (only if not in edit mode)
    if (!editRide) {
      setForm({
        fromLocation: "",
        toLocation: "",
        totalSeats: "",
        price: "",
        carType: "",
        date: new Date(),
        time: new Date(),
      });
      setErrors({});
      setFocusedField(null);
      dispatch(clearError());
      dispatch(resetSuccess());
    }
    // Simulate a delay for the refresh animation
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, minHeight: 900 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={{ flex: 1, padding: 20 }}>
              <Header title="Add Trip Details" />
              <FormInput
                placeholder="Enter departure location"
                value={form.fromLocation}
                onChangeText={(text) => updateForm("fromLocation", text)}
                error={errors.fromLocation}
                editable={!editRide}
                onFocus={() => setFocusedField("fromLocation")}
                onBlur={() => setFocusedField(null)}
                focused={focusedField === "fromLocation"}
              />
              <FormInput
                placeholder="Enter destination"
                value={form.toLocation}
                onChangeText={(text) => updateForm("toLocation", text)}
                error={errors.toLocation}
                editable={!editRide}
                onFocus={() => setFocusedField("toLocation")}
                onBlur={() => setFocusedField(null)}
                focused={focusedField === "toLocation"}
              />
              <FormInput
                placeholder="Enter available totalSeats"
                value={form.totalSeats}
                onChangeText={(text) => updateForm("totalSeats", text)}
                error={errors.totalSeats}
                keyboardType="numeric"
                onFocus={() => setFocusedField("totalSeats")}
                onBlur={() => setFocusedField(null)}
                focused={focusedField === "totalSeats"}
              />
              <FormInput
                placeholder="Enter price"
                value={form.price}
                onChangeText={(text) => updateForm("price", text)}
                error={errors.price}
                keyboardType="numeric"
                onFocus={() => setFocusedField("price")}
                onBlur={() => setFocusedField(null)}
                focused={focusedField === "price"}
              />
              <FormInput
                placeholder="Enter car type"
                value={form.carType}
                onChangeText={(text) => updateForm("carType", text)}
                error={errors.carType}
                editable={!editRide}
                onFocus={() => setFocusedField("carType")}
                onBlur={() => setFocusedField(null)}
                focused={focusedField === "carType"}
              />
              <DateTimePickerButton
                value={form.time}
                mode="time"
                onChange={(time) => updateForm("time", time)}
                displayFormat={(time) =>
                  time.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                }
                disabled={!!editRide}
              />
              <DateTimePickerButton
                value={form.date}
                mode="date"
                onChange={(date) => updateForm("date", date)}
                displayFormat={(date) => date.toLocaleDateString()}
                disabled={!!editRide}
              />
              <SubmitButton
                loading={loading}
                onPress={handleSubmit}
                isEditMode={!!editRide}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
