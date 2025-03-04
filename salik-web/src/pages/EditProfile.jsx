import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { validateForm } from "../validation/validation";
import { MainButton } from "../custom/MainButton";

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    profileImg: "",
    profilePreview: "",
  });

  useEffect(() => {
    if (user) {
      console.log("User data:", user);

      const profileImg = user?.profileImg
        ? user.profileImg // Use Cloudinary URL if available
        : "https://via.placeholder.com/150";

      setProfile({
        fullName: user.fullName || "",
        phone: user.phone || "",
        profilePreview: profileImg,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true); // Show loading while uploading

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "salik-preset"); // ✅ Replace with your actual Cloudinary preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dfouknww9/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setUploading(false); // Stop loading

      if (data.secure_url) {
        setProfile((prev) => ({
          ...prev,
          profileImg: data.secure_url,
          profilePreview: data.secure_url,
        }));
        console.log("✅ Uploaded to Cloudinary:", data.secure_url);
      } else {
        setMessage({ type: "error", text: "❌ Cloudinary upload failed!" });
        console.error("❌ Cloudinary upload failed:", data);
      }
    } catch (error) {
      setUploading(false);
      setMessage({ type: "error", text: "❌ Error uploading to Cloudinary!" });
      console.error("❌ Error uploading to Cloudinary:", error);
    }
  };

  const handleSave = () => {
    const validationErrors = validateForm(profile);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = {
      fullName: profile.fullName,
      phone: profile.phone,
      profileImg: profile.profileImg, // ✅ Cloudinary URL
    };

    dispatch(updateUser(formData))
      .unwrap()
      .then((response) => {
        if (!response) {
          setMessage({ type: "error", text: "No response from server." });
          return;
        }

        setMessage({ type: "success", text: "✅ Profile updated successfully!" });
        dispatch(getUser());
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error?.message || "❌ Failed to update profile.",
        });
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 4, borderRadius: 3, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Hi, {user?.fullName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Manage your info to make Salik work better for you
        </Typography>

        {/* Profile Image Upload */}
        <Box position="relative" display="inline-block" sx={{ mb: 3 }}>
          <Avatar src={profile.profilePreview} sx={{ width: 120, height: 120, mx: "auto" }} />
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 5,
              right: 5,
              bgcolor: "white",
              p: 0.7,
              borderRadius: "50%",
            }}
          >
            <PhotoCameraIcon fontSize="small" />
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </IconButton>
        </Box>

        {uploading && (
          <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={profile.fullName}
          onChange={handleChange}
          sx={{ mb: 2 }}
          error={!!errors.fullName}
          helperText={errors.fullName}
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          sx={{ mb: 3 }}
          error={!!errors.phone}
          helperText={errors.phone}
        />

        {message.text && (
          <Box sx={{ mb: 2, color: message.type === "success" ? "green" : "red" }}>
            <Typography>{message.text}</Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" gap={2}>
          <MainButton onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </MainButton>
          <Button
            variant="outlined"
            style={{ color: "#FFB800", borderColor: "#FFB800" }}
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
