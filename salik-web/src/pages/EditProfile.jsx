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
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { MainButton } from "../custom/MainButton";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";


export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { user, loading } = useSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Local state for form
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    profilePic: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Update profile state when user data is available
  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        phone: user.phone || "",
        profilePic: user.profileImg || "https://via.placeholder.com/150",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    console.log("Updated Profile:", { ...profile, [name]: value }); // ✅ Debugging
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        profilePic: file, // ✅ Store File
        profilePreview: URL.createObjectURL(file), // ✅ Image preview
      }));
      console.log("New Profile Pic:", file); // ✅ Debugging
    }
  };
  
  const goToHome =()=>{
    navigate("/")
  }
  
  
const handleSave = () => {
  const formData = new FormData();
  formData.append("fullName", profile.fullName);
  formData.append("phone", profile.phone);

  if (profile.profilePic instanceof File) {
    formData.append("profileImg", profile.profilePic);
  }

  dispatch(updateUser(formData))
    .unwrap()
    .then((response) => {
      setSuccessMessage("✅ Profile updated successfully!");
      setErrorMessage("");

      // ✅ Update local state immediately with new data
      setProfile((prev) => ({
        ...prev,
        fullName: response.updatedUser.fullName,
        phone: response.updatedUser.phone,
        profilePic: response.updatedUser.profileImg || prev.profilePic,
      }));

      // ✅ Fetch latest user data to update Redux state
      dispatch(getUser());
    })
    .catch((error) => {
      setErrorMessage(error || "Failed to update profile.");
    });
};

  
  
  
  


  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 4, borderRadius: 3, textAlign: "center", bgcolor: "#ffffff" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome, {profile.fullName}!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Manage your information to enhance your Salik experience and ensure seamless service.
        </Typography>

        {/* Profile Picture Upload */}
        <Box position="relative" display="inline-block" sx={{ mb: 3 }}>
          <Avatar src={profile.profilePic} sx={{ width: 120, height: 120, mx: "auto" }} />
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 5,
              right: 5,
              bgcolor: "white",
              p: 0.7,
              borderRadius: "50%",
              boxShadow: 1,
            }}
          >
            <PhotoCameraIcon fontSize="small" />
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </IconButton>
        </Box>

        {/* Add success and error messages */}
        {successMessage && (
          <Box sx={{ mb: 2, color: 'green' }}>
            <Typography>{successMessage}</Typography>
          </Box>
        )}
        
        {errorMessage && (
          <Box sx={{ mb: 2, color: 'red' }}>
            <Typography>{errorMessage}</Typography>
          </Box>
        )}

        {/* Form Fields */}
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={profile.fullName}
          onChange={handleChange}
          sx={{ mb: 2 }}
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          sx={{ mb: 3 }}
          variant="outlined"
        />

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" gap={2}>
          <MainButton
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#FFB800", color: "black" }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </MainButton>
          <Button 
            variant="outlined" 
            sx={{ color: "#ffb800", borderColor: "#ffb800" }} 
            fullWidth
            onClick={goToHome}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
