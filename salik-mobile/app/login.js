import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ phone: "", password: "" });

  const handleLogin = async () => {
    try {
      const result = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(result)) {
        console.log("Login Success:", result.payload);
        await AsyncStorage.setItem("token", result.payload.token);
        router.replace("/(tabs)");
      } else {
        console.log("Login Failed:", result.payload);
        Alert.alert("Login Failed", result.payload || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone:</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#FFB800" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
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
