// components/UserComponents/ProfileComponent.jsx
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logoutUser, switchRole } from "../../redux/slices/authSlice";
import { Ionicons } from "@expo/vector-icons";

const ProfileComponent = ({ navigation }) => {
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
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>MENU</Text>
                <TouchableOpacity onPress={() => navigation.closeDrawer()}>
                    <Ionicons name="close-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {/* User Profile Section */}
            <View style={styles.profileSection}>
                {user?.profileImg ? (
                    <Image source={{ uri: user.profileImg }} style={styles.profileImage} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>{user?.fullName?.charAt(0) || "U"}</Text>
                    </View>
                )}
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{user?.fullName || "User Name"}</Text>
                    <Text style={styles.phone}>{user?.phone || "No phone available"}</Text>
                </View>
                <TouchableOpacity style={styles.settingsIcon}>
                    <Ionicons name="settings-outline" size={20} color="#FFB800" />
                </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push("/editProfile")}
                >
                    <Ionicons name="person-outline" size={24} color="#FFB800" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Edit Profile</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#ccc" style={styles.chevron} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => alert("Appearance settings")}
                >
                    <Ionicons name="sunny-outline" size={24} color="#FFB800" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Appearance</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#ccc" style={styles.chevron} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleSwitchRole}
                >
                    <Ionicons name="toggle-outline" size={24} color="#FFB800" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Switch Role</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#ccc" style={styles.chevron} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push("/help")}
                >
                    <Ionicons name="help-circle-outline" size={24} color="#FFB800" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Help</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#ccc" style={styles.chevron} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push("/terms")}
                >
                    <Ionicons name="document-text-outline" size={24} color="#FFB800" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Terms & Policies</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#ccc" style={styles.chevron} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color="#FFB800" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Log Out</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#ccc" style={styles.chevron} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 40,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    placeholderImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    placeholderText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#555",
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    phone: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    settingsIcon: {
        padding: 5,
    },
    menuContainer: {
        marginTop: 10,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    menuIcon: {
        width: 24,
        height: 24,
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    chevron: {
        marginLeft: 10,
    },
});

export default ProfileComponent;