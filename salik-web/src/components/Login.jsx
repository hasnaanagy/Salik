import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { loginUser, clearError } from "../redux/slices/authSlice"; // Import loginUser action
import { useNavigate } from "react-router-dom";

import { loginUser } from "../redux/slices/authSlice";

import {
  FormControl,
  Box,
  FormHelperText,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { StyledOutlinedInput, StyledInputLabel } from "../custom/MainInput";
import { MainButton } from "../custom/MainButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "../styles/styles.module.css";
import { validateField } from "../validation/validation"; // Add this import statement

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const result = await dispatch(loginUser(formData));
  
    if (loginUser.fulfilled.match(result)) {
      if (result.payload.token) {
        // Show success message
        setSuccessMessage("✅ Login successful!");
        setErrors({ general: "" });
        
     
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } else {
      console.error("Login error:", result.payload);
      setErrors({ general: result.payload || "Invalid credentials" });
    }
  };
  
  
  

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordToggle = () => {
    setPasswordVisible((prev) => !prev);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      
      const error = validateField(name, value, updatedFormData);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
      
      return updatedFormData;
    });
  };
  

  


  return (
    <form  onSubmit={handleLogin} noValidate autoComplete="off">
      <Box className={styles.formBox}>
        {["phone", "password"].map((field) => (
          <FormControl key={field} error={!!errors[field]}>
            <StyledInputLabel htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </StyledInputLabel>
            <StyledOutlinedInput
              id={field}
              name={field}
              type={
                field === "password"
                  ? passwordVisible
                    ? "text"
                    : "password"
                  : "text"
              }
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              endAdornment={
                field === "password" ? (
                  <InputAdornment position="end">
                    <IconButton onClick={handlePasswordToggle} edge="end">
                      {passwordVisible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
            {errors[field] && <FormHelperText>{errors[field]}</FormHelperText>}
          </FormControl>
        ))}

        {/* Submit Button */}
        <MainButton
          type="submit"
          variant="contained"
          style={{ backgroundColor: "#FFB800", color: "black" }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </MainButton>
      </Box>
     {errors.general && <Alert severity="error">{errors.general}</Alert>}

      {successMessage && (
  <Alert severity="success" style={{ marginTop: 20 }}>
    {successMessage}
  </Alert>
)}

    </form>
  );
}
