import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { Avatar, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUser } from "../../redux/slices/authSlice";
import { useRouter } from "expo-router";

export default function EditProfileForm({ navigation }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    profileImg: "",
    profilePreview: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        phone: user.phone || "",
        profilePreview: user.profileImg || "https://via.placeholder.com/150",
      });
    }
  }, [user]);

  const handleChange = (name, value) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    console.log("ImagePicker Result:", result); // Log the result of image picking
    
    if (!result.canceled) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "profile.jpg",
        });
        formData.append("upload_preset", "salik-preset");
  
        console.log("FormData:", formData); // Log the FormData being sent to Cloudinary
  
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dfouknww9/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        console.log("Cloudinary Response:", data); // Log the response from Cloudinary
  
        setUploading(false);
  
        if (data.secure_url) {
          setProfile((prev) => ({
            ...prev,
            profileImg: data.secure_url,
            profilePreview: data.secure_url,
          }));
        } else {
          Alert.alert("Error", "Cloudinary upload failed!");
        }
      } catch (error) {
        setUploading(false);
        console.error("Error uploading image:", error); // Log the error if upload fails
        Alert.alert("Error", "Error uploading image!");
      }
    }
  };
  
  const handleSave = () => {
    console.log("Saving profile with data:", profile); // Log profile data being saved
  
    const formData = new FormData();
    formData.append("fullName", profile.fullName);
    formData.append("phone", profile.phone);
    if (profile.profileImg) {
      formData.append("profileImg", profile.profileImg);
    }
  
    console.log("FormData before sending:", formData); // Log FormData before dispatching
  
    dispatch(updateUser(formData))
      .unwrap()
      .then(() => {
        console.log("Profile updated successfully!");
        setMessage("Profile updated successfully!");
        dispatch(getUser());
      })
      .catch((error) => {
        console.error("Profile update failed:", error); // Log error if update fails
        setMessage(error?.message || "Failed to update profile.");
      });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hi, {user?.fullName}</Text>
      <Text style={styles.subtitle}>Manage your info to make Salik work better for you</Text>
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        <Avatar.Image source={{ uri: profile.profilePreview }} size={120} backgroundColor="#FFB800" />
      </TouchableOpacity>
      {uploading && <ActivityIndicator size="small" color="#FFB800" />}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={profile.fullName}
        onChangeText={(text) => handleChange("fullName", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={profile.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />

      {message !== "" && <Text style={styles.message}>{message}</Text>}

      <View style={styles.buttonContainer}>
        <Button mode="contained" buttonColor="#FFB800" onPress={handleSave} loading={loading} disabled={loading}>
          Save Changes
        </Button>
        <Button mode="outlined" textColor="#FFB800" onPress={() => router.push("(tabs)/profile")} disabled={loading}>
          Cancel
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
    textAlign: "center",
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: "center",
   
    },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    color: "green",
    marginBottom: 15,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});   