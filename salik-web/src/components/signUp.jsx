import React, { useState, useEffect } from "react";
import {
  FormControl,
  Box,
  FormHelperText,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { validateField, validateForm } from "../validation/validation";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/slices/authSlice";

import { StyledOutlinedInput, StyledInputLabel } from "../custom/MainInput";
import { MainButton } from "../custom/MainButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "../styles/styles.module.css";

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
  
 
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    try {
      const result = await dispatch(signupUser(formData)).unwrap();
      console.log("Signup successful:", result);
  

      setSuccessMessage("Signup successful! ");
      
    
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      console.error("Signup error:", err);
      
      setErrors({ general: err.message || "Signup failed. Please try again." });
    }
  };
  
  
  
  
  
  



  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    nationalId: "",
  });






  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handlePasswordToggle = (field) => {
    if (field === "password") setPasswordVisible((prev) => !prev);
    if (field === "confirmPassword") setConfirmPasswordVisible((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value, formData);
    setErrors({ ...errors, [name]: error });
  };



  return (
    <form onSubmit={handleSignup} noValidate autoComplete="off">

      <Box className={styles.formBox}>
        {["fullName", "phone", "password", "confirmPassword", "nationalId"].map(
          (field) => (
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
                    : field === "confirmPassword"
                      ? confirmPasswordVisible
                        ? "text"
                        : "password"
                      : "text"
                }
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                endAdornment={
                  field === "password" || field === "confirmPassword" ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handlePasswordToggle(field)}
                        edge="end"
                      >
                        {field === "password" ? (
                          passwordVisible ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )
                        ) : confirmPasswordVisible ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
              {errors[field] && (
                <FormHelperText>{errors[field]}</FormHelperText>
              )}
            </FormControl>
          )
        )}

        <MainButton
          type="submit"
          style={{ width:'100%'}}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
        </MainButton>
      </Box>

      {error && (
        <Alert severity="error" style={{ marginTop: 20 }}>
          {error}
        </Alert>
      )}
      {successMessage && (
  <Alert severity="success" style={{ marginTop: 20 }}>
    {successMessage}
  </Alert>
)}

    </form>
  );
}

