import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { registerUser } from "../../redux/slices/authSlice";
import Icon from "react-native-vector-icons/Feather";

export default function SignupForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    nationalId: "",
  });

  const [errors, setErrors] = useState({});
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    if (name === "fullName") {
      newErrors.fullName = value.length < 3 ? "Name must be at least 3 characters" : "";
    }
    if (name === "phone") {
      newErrors.phone = !/^\d{11}$/.test(value) ? "Phone number must be 11 digits" : "";
    }
    if (name === "password") {
      if (!value.trim()) {
        newErrors.password = "Password is required";
      } else if (value.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(value)) {
        newErrors.password = "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(value)) {
        newErrors.password = "Password must contain at least one lowercase letter";
      } else if (!/[0-9]/.test(value)) {
        newErrors.password = "Password must contain at least one number";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        newErrors.password = "Password must contain at least one special character";
      } else if (/\s/.test(value)) {
        newErrors.password = "Password should not contain spaces";
      } else {
        newErrors.password = "";
      }
    }
    if (name === "confirmPassword") {
      newErrors.confirmPassword = value !== formData.password ? "Passwords do not match" : "";
    }
    if (name === "nationalId") {
      newErrors.nationalId = !/^\d{14}$/.test(value) ? "National ID must be 14 digits" : "";
    }
    setErrors(newErrors);
  };

  const handleSignUp = async () => {
    if (Object.values(errors).some(error => error !== "")) return;
    try {
      const result = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(result)) {
        router.replace("login");
      } else {
        Alert.alert("Registration Failed", result.payload || "Unexpected error");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={(text) => {
          setFormData({ ...formData, fullName: text });
          validateField("fullName", text);
        }}
      />
      {errors.fullName ? <Text style={styles.error}>{errors.fullName}</Text> : null}
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          secureTextEntry={secureConfirmText}
          value={formData.confirmPassword}
          onChangeText={(text) => {
            setFormData({ ...formData, confirmPassword: text });
            validateField("confirmPassword", text);
          }}
        />
        <TouchableOpacity onPress={() => setSecureConfirmText(!secureConfirmText)}>
          <Icon name={secureConfirmText ? "eye-off" : "eye"} size={20} color="#666" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="National ID"
        keyboardType="numeric"
        value={formData.nationalId}
        onChangeText={(text) => {
          setFormData({ ...formData, nationalId: text });
          validateField("nationalId", text);
        }}
      />
      {errors.nationalId ? <Text style={styles.error}>{errors.nationalId}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color="#FFB800" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
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
    fontSize: 16,
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
