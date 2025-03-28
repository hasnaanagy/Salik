import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import CustomAlert from "../../components/CustomeComponents/CustomAlert";
import Logo from "../../assets/logo.svg"; 

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
      {/* Use the imported SVG component */}
      <Logo width={120} height={120} style={styles.logo} />

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

      {loading ? (
        <ActivityIndicator size="large" color="#FFB800" style={styles.loading} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      )}
     
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}> <Text style={styles.linkText}> Don't have an account? </Text>Sign Up</Text>
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
    marginBottom: 20,
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
    color: "black",
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