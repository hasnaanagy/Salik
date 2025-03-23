import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logoutUser, switchRole } from "../../redux/slices/authSlice";
import { Ionicons } from "@expo/vector-icons";

const ProfileComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/login");
  };

  const handleSwitchRole = async () => {
    if (!user?.type) return;

    console.log("🔄 Previous Type:", user.type);

    const resultAction = await dispatch(switchRole());

    if (switchRole.fulfilled.match(resultAction)) {
      const newType = resultAction.payload?.newRole;
      if (newType) {
        console.log("🟢 New Type:", newType);
        Alert.alert("Role Changed", `You are now a ${newType}`);
      }
    } else {
      console.error("❌ Failed to switch role.");
      Alert.alert("Error", "Failed to switch role.");
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {user?.profileImg ? (
          <Image
            source={{ uri: user.profileImg }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {user?.fullName?.charAt(0) || "U"}
            </Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user?.fullName || "User Name"}</Text>
          <Text style={styles.phone}>
            {user?.phone || "No phone available"}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/editProfile")}
        >
          <Ionicons name="person-outline" size={24} color="#000" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => alert("Appearance settings")}
        >
          <Ionicons name="sunny-outline" size={24} color="#000" />
          <Text style={styles.buttonText}>Appearance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSwitchRole}>
          <Ionicons name="toggle-outline" size={24} color="#000" />
          <Text style={styles.buttonText}>Switch Role</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#000" />
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FFB800",
    marginRight: 15,
  },
  placeholderImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555",
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  phone: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "500",
    color: "#333",
  },
});

export default ProfileComponent;
