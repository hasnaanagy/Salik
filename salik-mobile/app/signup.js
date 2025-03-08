import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { registerUser } from "../redux/slices/authSlice";

export default function SignUpScreen() {
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

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      console.log("Dispatching registerUser...");
      const result = await dispatch(registerUser(formData));
      console.log("Register response:", result);

      if (registerUser.fulfilled.match(result)) {
        console.log("Registration Success:", result.payload);
        router.replace("login");
      } else {
        console.log("Registration Failed:", result.payload);
        Alert.alert("Registration Failed", result.payload || "Unexpected error");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.label}>Full Name:</Text>
      <TextInput style={styles.input} value={formData.fullName} onChangeText={(text) => setFormData({ ...formData, fullName: text })} />
      
      <Text style={styles.label}>Phone:</Text>
      <TextInput style={styles.input} keyboardType="phone-pad" value={formData.phone} onChangeText={(text) => setFormData({ ...formData, phone: text })} />
      
      <Text style={styles.label}>Password:</Text>
      <TextInput style={styles.input} secureTextEntry value={formData.password} onChangeText={(text) => setFormData({ ...formData, password: text })} />
      
      <Text style={styles.label}>Confirm Password:</Text>
      <TextInput style={styles.input} secureTextEntry value={formData.confirmPassword} onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })} />
      
      <Text style={styles.label}>National ID:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={formData.nationalId} onChangeText={(text) => setFormData({ ...formData, nationalId: text })} />

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
  container: { flex: 1, padding: 20, justifyContent: "center" },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: { borderWidth: 1, padding: 12, marginBottom: 15, borderRadius: 8, borderColor: "#ccc" },
  button: { backgroundColor: "#FFB800", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  error: { color: "red", marginTop: 10 },
  link: { color: "#FFB800", textAlign: "center", marginTop: 20, fontWeight: "bold" },
});
