import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Alert, TouchableOpacity, StyleSheet, Image } from "react-native";
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
      
      <View style={styles.inputContainer}>
        <View style={styles.iconCircle}>
          <Icon name="user" size={20} color="#FFB800" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.fullName}
          onChangeText={(text) => {
            setFormData({ ...formData, fullName: text });
            validateField("fullName", text);
          }}
        />
      </View>
      {errors.fullName ? <Text style={styles.error}>{errors.fullName}</Text> : null}

      <View style={styles.inputContainer}>
        <View style={styles.iconCircle}>
          <Icon name="phone" size={20} color="#FFB800" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => {
            setFormData({ ...formData, phone: text });
            validateField("phone", text);
          }}
        />
      </View>
      {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

      <View style={styles.inputContainer}>
        <View style={styles.iconCircle}>
          <Icon 
            name={secureText ? "eye-off" : "eye"} 
            size={20} 
            color="#FFB800"
            onPress={() => setSecureText(!secureText)}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={secureText}
          value={formData.password}
          onChangeText={(text) => {
            setFormData({ ...formData, password: text });
            validateField("password", text);
          }}
        />
      </View>
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

      <View style={styles.inputContainer}>
        <View style={styles.iconCircle}>
          <Icon 
            name={secureConfirmText ? "eye-off" : "eye"} 
            size={20} 
            color="#FFB800"
            onPress={() => setSecureConfirmText(!secureConfirmText)}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={secureConfirmText}
          value={formData.confirmPassword}
          onChangeText={(text) => {
            setFormData({ ...formData, confirmPassword: text });
            validateField("confirmPassword", text);
          }}
        />
      </View>
      {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword}</Text> : null}

      <View style={styles.inputContainer}>
        <View style={styles.iconCircle}>
          <Icon name="credit-card" size={20} color="#FFB800" />
        </View>
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
      </View>
      {errors.nationalId ? <Text style={styles.error}>{errors.nationalId}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#FFB800" style={styles.loading} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}> <Text style={styles.linkText}>Already have an account?</Text> Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6F5",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 184, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#FFB800",
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  link: {
    color: "#FFB800",
    fontSize: 16,
    marginTop: 20,
    fontWeight: "300",
    zIndex: 1,
  },
  linkText: {
    color:"black",
  },
  error: {
    color: "#FF4444",
    fontSize: 14,
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: 17,
    zIndex: 1,
  },
  loading: {
    marginTop: 20,
  },
});