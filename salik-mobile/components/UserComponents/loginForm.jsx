import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import CustomAlert from "../../components/CustomeComponents/CustomAlert";

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [secureText, setSecureText] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    if (name === "phone") {
      newErrors.phone = !/^\d{11}$/.test(value) ? "Phone number must be 11 digits" : "";
    }
    if (name === "password") {
      newErrors.password = value.length < 8 ? "Password must be at least 8 characters" : "";
    }
    setErrors(newErrors);
  };

  const handleLogin = async () => {
    if (Object.values(errors).some((error) => error !== "")) return;
    try {
      const result = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(result)) {
        await AsyncStorage.setItem("token", result.payload.token);
        router.replace("/(tabs)");
      } else {
        setAlertMessage(result.payload || "Invalid credentials");
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage(error.message || "Something went wrong");
      setAlertVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => {
          setFormData({ ...formData, phone: text });
          validateField("phone", text);
        }}
      />
      {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={secureText}
          value={formData.password}
          onChangeText={(text) => {
            setFormData({ ...formData, password: text });
            validateField("password", text);
          }}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Icon name={secureText ? "eye-off" : "eye"} size={20} color="#666" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color="#FFB800" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      {/* Alert Component */}
      <CustomAlert visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: "#ddd",
    backgroundColor: "#FFF",
    fontSize: 16,
    elevation: 3,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 4,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,padding:10
  },
  icon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#FFB800",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
  },
  link: {
    color: "#FFB800",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
    fontSize: 16,
  },
});
