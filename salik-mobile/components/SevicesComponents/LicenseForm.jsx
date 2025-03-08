import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import appColors from "../../constants/colors.js";

export default function LicenceForm() {
  const [licenseImage, setLicenseImage] = useState(null);
  const [idImage, setIdImage] = useState(null);

  // ✅ Request permission when component mounts
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "You need to allow access to your photos."
        );
      }
    })();
  }, []);

  // ✅ Function to pick an image
  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ✅ Handle Upload (Dummy function)
  const handleUpload = () => {
    Alert.alert("Upload Successful", "Your images have been uploaded.");
  };

  const isUploadDisabled = !licenseImage || !idImage;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please Upload Licence</Text>

      <TouchableOpacity
        style={[styles.uploadBox, { marginTop: 10 }]}
        onPress={() => pickImage(setLicenseImage)}
      >
        {licenseImage ? (
          <Image source={{ uri: licenseImage }} style={styles.image} />
        ) : (
          <Text style={styles.uploadText}>Licence ⬆</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.uploadBox}
        onPress={() => pickImage(setIdImage)}
      >
        {idImage ? (
          <Image source={{ uri: idImage }} style={styles.image} />
        ) : (
          <Text style={styles.uploadText}>ID ⬆</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.uploadButton,
          { backgroundColor: isUploadDisabled ? "#ccc" : appColors.primary },
        ]}
        disabled={isUploadDisabled}
        onPress={handleUpload}
      >
        <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  uploadBox: {
    width: "90%",
    height: 150,
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "#f0f0f0",
  },
  uploadText: { fontSize: 16, color: "#888" },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  uploadButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 40,
    width: "70%",
    alignItems: "center",
  },
  uploadButtonText: { color: "#000", fontSize: 16, fontWeight: "bold" },
});
