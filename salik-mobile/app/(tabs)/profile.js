import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logoutUser, switchRole } from "../../redux/slices/authSlice";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
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
        return <ActivityIndicator size="large" color="#FFB800" style={{ marginTop: 50 }} />;
    }

    return (
        <View style={styles.container}>
            {/* صورة المستخدم */}
            {user?.profileImg ? (
                <Image source={{ uri: user.profileImg }} style={styles.profileImage} />
            ) : (
                <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>{user?.fullName?.charAt(0) || "U"}</Text>
                </View>
            )}

            {/* معلومات المستخدم */}
            <Text style={styles.name}>{user?.fullName || "User Name"}</Text>
            <Text style={styles.phone}>{user?.phone || "No phone available"}</Text>
            

            {/* أزرار التحكم */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => router.push("/edit-profile")}>
                    <Ionicons name="person-circle-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => alert("Appearance settings")}>
                    <Ionicons name="color-palette-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Appearance</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleSwitchRole}>
                    <Ionicons name="sync-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Switch Role</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
      
        alignItems: "center",
        padding: 45,
        backgroundColor: "#f5f5f5",
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: "#FFB800",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    placeholderText: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#555",
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    phone: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
    },
    role: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#444",
        marginBottom: 20,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFB800",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: "80%",
        justifyContent: "center",
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    logoutButton: {
        backgroundColor: "#D9534F",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
});

export default Profile;
