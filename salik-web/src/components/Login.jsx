import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  Box,
  FormHelperText,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { validateField } from "../validation/validation";  
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlices";
import { useNavigate } from "react-router-dom";
import { StyledOutlinedInput, StyledInputLabel } from "../custom/MainInput";
import { MainButton } from "../custom/MainButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "../styles/styles.module.css";
import { validateField } from "../validation/validation"; // Add this import statement
import { clearError, loginUser } from "../redux/slices/authSlices";
export default function Login() {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [errors, setErrors] = useState({}); 
  const [showPassword, setShowPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    const error = validateField(name, value, formData);
    setErrors({ ...errors, [name]: error }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};
    
    // Validate fields before submitting
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) formErrors[field] = error;
    });

    setErrors(formErrors);

    // If there are no validation errors
    if (Object.keys(formErrors).length === 0) {
      try {
        // Attempt to log in
        await dispatch(loginUser(formData)).unwrap();
        navigate("/addTrip");
      } catch (error) {
        // Handle login errors by showing alert
        setAlertVisible(true);
      }
    }
  };

  useEffect(() => {
    if (alertVisible) {
      const timer = setTimeout(() => {
        navigate("/signup");
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [alertVisible, navigate]);

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Box className={styles.formBox}>
        {["phone", "password"].map((field) => (
          <FormControl key={field} error={!!errors[field]}>
            <StyledInputLabel htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </StyledInputLabel>
            <StyledOutlinedInput
              id={field}
              name={field}
              type={field === "password" ? (showPassword ? "text" : "password") : "text"}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              endAdornment={
                field === "password" && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            />
            {errors[field] && <FormHelperText>{errors[field]}</FormHelperText>}
          </FormControl>
        ))}

        {alertVisible && (
          <Alert severity="error" sx={{ mt: 2 }}>
            You do not have an account. Redirecting to signup...
          </Alert>
        )}

        <MainButton
          type="submit"
          variant="contained"
          disabled={loading}
          style={{ backgroundColor: "#FFB800", color: "black" }}
        >
          {loading ? "Logging In..." : "Log In"}
        </MainButton>
      </Box>
    </form>
  );
}