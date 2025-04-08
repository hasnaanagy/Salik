import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { uploadImages, setImage } from "../../redux/slices/licenseSlice.js";
import appColors from "../../constants/colors.js";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function LicenceForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { nationalIdImage, licenseImage, loading } = useSelector(
    (state) => state.images
  );

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

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(setImage({ type, uri: result.assets[0].uri }));
    }
  };

  const handleUpload = () => {
    if (!nationalIdImage || !licenseImage) {
      Alert.alert("Error", "Please select both images before uploading.");
      return;
    }

    dispatch(
      uploadImages({
        nationalIdImage: nationalIdImage,
        licenseImage: licenseImage,
      })
    )
      .then(() => {
        router.push("addTrip"); // Navigate after successful upload
      })
      .catch((error) => {
        Alert.alert(
          "Upload Failed",
          "There was an error uploading the images."
        );
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop:Platform.OS === "ios" ? 60 : 0,}}>
        <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.push("/")}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Please Upload Licence</Text>
      </View>
      <TouchableOpacity
        style={styles.uploadBox}
        onPress={() => pickImage("nationalIdImage")}
      >
        {nationalIdImage ? (
          <Image source={{ uri: nationalIdImage }} style={styles.image} />
        ) : (
          <Text style={styles.uploadText}>ID ⬆</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.uploadBox}
        onPress={() => pickImage("licenseImage")}
      >
        {licenseImage ? (
          <Image source={{ uri: licenseImage }} style={styles.image} />
        ) : (
          <Text style={styles.uploadText}>Licence ⬆</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.uploadButton,
          { backgroundColor: loading ? "#ccc" : appColors.primary },
        ]}
        disabled={loading}
        onPress={handleUpload}
      >
        <Text style={styles.uploadButtonText}>
          {loading ? "Uploading..." : "Upload"}
        </Text>
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
    marginTop: 40,
    backgroundColor: "#f0f0f0",
    alignSelf: "center",
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
    alignSelf: "center",
  },
  uploadButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  header:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"start",
  }
});
