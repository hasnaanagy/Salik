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
import { validateForm } from "../validation/validation";

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { user, loading } = useSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    profileImg: "",
    profilePreview: "",
  });

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        phone: user.phone || "",
        profileImg: "",
        profilePreview: user.profileImg || "https://via.placeholder.com/150",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        profileImg: file,
        profilePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = () => {
    const validationErrors = validateForm(profile);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    if (profile.fullName) formData.append("fullName", profile.fullName);
    if (profile.phone) formData.append("phone", profile.phone);
    if (profile.profileImg instanceof File) formData.append("profileImg", profile.profileImg);

    dispatch(updateUser(formData))
      .unwrap()
      .then((response) => {
        setSuccessMessage("✅ Profile updated successfully!");
        setErrorMessage("");
        setProfile({
          fullName: "",
          phone: "",
          profileImg: "",
          profilePreview: response.profileImg || "https://via.placeholder.com/150",
        });
        dispatch(getUser());
      })
      .catch((error) => {
        setErrorMessage(error || "Failed to update profile.");
      });
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 4, borderRadius: 3, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome, {profile.fullName}!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Manage your information to enhance your experience and ensure seamless service.
        </Typography>

        <Box position="relative" display="inline-block" sx={{ mb: 3 }}>
          <Avatar src={profile.profilePreview} sx={{ width: 120, height: 120, mx: "auto" }} />
          <IconButton
            component="label"
            sx={{ position: "absolute", bottom: 5, right: 5, bgcolor: "white", p: 0.7, borderRadius: "50%", boxShadow: 1 }}
          >
            <PhotoCameraIcon fontSize="small" />
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </IconButton>
        </Box>

        {successMessage && <Box sx={{ mb: 2, color: 'green' }}><Typography>{successMessage}</Typography></Box>}
        {errorMessage && <Box sx={{ mb: 2, color: 'red' }}><Typography>{errorMessage}</Typography></Box>}

        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={profile.fullName}
          onChange={handleChange}
          sx={{ mb: 2 }}
          variant="outlined"
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
          variant="outlined"
          error={!!errors.phone}
          helperText={errors.phone}
        />

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
