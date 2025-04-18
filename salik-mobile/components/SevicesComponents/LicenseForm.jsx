import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { uploadImages, setImage, clearImages } from "../../redux/slices/licenseSlice.js";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getUser } from "../../redux/slices/authSlice";

export default function LicenseForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { nationalIdImage, licenseImage, loading } = useSelector((state) => state.images);
  const { user } = useSelector((state) => state.auth);
  const [nationalIdStatus, setNationalIdStatus] = useState("not uploaded");
  const [licenseStatus, setLicenseStatus] = useState("not uploaded");
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Add this new useEffect for auto-refresh
  useEffect(() => {
    // Initial fetch
    dispatch(getUser());

    // Set up interval for periodic refresh
    const interval = setInterval(() => {
      dispatch(getUser());
    }, 5000); // Refresh every 5 seconds

    // Clean up interval on unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [dispatch]);

  // Modify handleUpload to refresh after upload
  const handleUpload = async () => {
    if (!nationalIdImage || !licenseImage) {
      Alert.alert("Error", "Please select both images before uploading.");
      return;
    }

    setUploading(true);

    try {
      await dispatch(
        uploadImages({
          nationalIdImage,
          licenseImage,
        })
      ).unwrap();

      Alert.alert("Success", "Documents uploaded successfully. Status is now pending.");
      dispatch(getUser()); // Refresh user data immediately after upload
    } catch (error) {
      Alert.alert("Upload Failed", "There was an error uploading the images.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setNationalIdStatus(user.nationalIdStatus || "not uploaded");
      setLicenseStatus(user.licenseStatus || "not uploaded");
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "green";
      case "pending":
        return "orange";
      case "rejected":
        return "red";
      case null:
      case undefined:
      case "not uploaded":
        return "gray";
      default:
        return "gray";
    }
  };

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "You need to allow access to your photos.");
      }
    })();
  }, []);

  const pickImage = async (type) => {
    if ((type === "nationalIdImage" && nationalIdStatus === "verified") ||
        (type === "licenseImage" && licenseStatus === "verified")) {
      Alert.alert("Action not allowed", "This document is already verified.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(setImage({ type, uri: result.assets[0].uri }));
    }
  };

  const handleNext = () => {
    if (nationalIdStatus === "verified" && licenseStatus === "verified") {
      router.push("addTrip");
    } else if (nationalIdStatus === "pending" || licenseStatus === "pending") {
      Alert.alert(
        "Documents Pending",
        "Your documents are still under review. Please wait for approval before proceeding."
      );
    } else if (nationalIdStatus === "rejected" || licenseStatus === "rejected") {
      Alert.alert(
        "Documents Rejected",
        "One or more of your documents were rejected. Please upload new documents."
      );
    } else {
      Alert.alert(
        "Documents Required",
        "Please upload and get approval for both National ID and License before proceeding."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: Platform.OS === "ios" ? 60 : 0 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Please Upload License</Text>
        </View>

        {/* National ID Upload */}
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => pickImage("nationalIdImage")}
        >
          {nationalIdImage ? (
            <Image source={{ uri: nationalIdImage }} style={styles.image} />
          ) : (
            <Text style={styles.uploadText}>National ID</Text>
          )}
        </TouchableOpacity>
        <Text style={[styles.statusText, { color: getStatusColor(nationalIdStatus) }]}>
          Status: {nationalIdStatus === null || nationalIdStatus === "null"? "Not Uploaded" : nationalIdStatus.charAt(0).toUpperCase() + nationalIdStatus.slice(1)}
        </Text>

        {/* License Upload */}
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => pickImage("licenseImage")}
        >
          {licenseImage ? (
            <Image source={{ uri: licenseImage }} style={styles.image} />
          ) : (
            <Text style={styles.uploadText}>License</Text>
          )}
        </TouchableOpacity>
        <Text style={[styles.statusText, { color: getStatusColor(licenseStatus) }]}>
          Status: {licenseStatus === null || nationalIdStatus === "null"? "Not Uploaded" : licenseStatus.charAt(0).toUpperCase() + licenseStatus.slice(1)}
        </Text>

        {/* Upload Button */}
        <TouchableOpacity
          style={[
            styles.uploadButton,
            { backgroundColor: uploading ? "#ccc" : "#FFB800" },
          ]}
          disabled={uploading}
          onPress={handleUpload}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.uploadButtonText}>Upload</Text>
          )}
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor:
                nationalIdStatus === "verified" && licenseStatus === "verified"
                  ? "#4CAF50"
                  : "#ccc",
            },
          ]}
          disabled={nationalIdStatus !== "verified" || licenseStatus !== "verified"}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 55,
  },
  uploadBox: {
    width: "90%",
    height: 150,
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#f0f0f0",
    alignSelf: "center",
  },
  uploadText: { fontSize: 16, color: "#888" },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  uploadButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 40,
    width: "70%",
    alignItems: "center",
    alignSelf: "center",
  },
  uploadButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    width: "70%",
    alignItems: "center",
    alignSelf: "center",
  },
  nextButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
