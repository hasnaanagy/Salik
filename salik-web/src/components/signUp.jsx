import React, { useState } from "react";
import {
  FormControl,
  Box,
  FormHelperText,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { validateField } from "../validation/validation";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../redux/slices/authSlices";
import { useNavigate } from "react-router-dom";
import { StyledOutlinedInput, StyledInputLabel } from "../custom/MainInput";
import { MainButton } from "../custom/MainButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import styles from "../styles/styles.module.css";

export default function SignUp() {
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
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) formErrors[field] = error;
    });

    setErrors(formErrors);
    setErrorMessage(null);

    if (Object.keys(formErrors).length === 0) {
      const { confirmPassword, ...dataToSubmit } = formData;

      try {
        await dispatch(signUpUser(dataToSubmit)).unwrap();
        toast.success("Signup successful! Redirecting...");
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        setErrorMessage(error?.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Box className={styles.formBox}>
        {["fullName", "phone", "password", "confirmPassword", "nationalId"].map((field) => (
          <FormControl key={field} error={!!errors[field]}>
            <StyledInputLabel htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </StyledInputLabel>
            <StyledOutlinedInput
              id={field}
              name={field}
              type={field === "password" ? (passwordVisible ? "text" : "password") :
                field === "confirmPassword" ? (confirmPasswordVisible ? "text" : "password") : "text"}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              endAdornment={
                (field === "password" || field === "confirmPassword") ? (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handlePasswordToggle(field)} edge="end">
                      {field === "password" ? (passwordVisible ? <VisibilityOff /> : <Visibility />) :
                        (confirmPasswordVisible ? <VisibilityOff /> : <Visibility />)}
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
            {errors[field] && <FormHelperText>{errors[field]}</FormHelperText>}
          </FormControl>
        ))}

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2">{errorMessage}</Typography>
          </Alert>
        )}

        <MainButton
          type="submit"
          variant="contained"
          disabled={loading}
          style={{ backgroundColor: "#FFB800", color: "black" }}
        >
          {loading ? <CircularProgress size={24} style={{ color: "black" }} /> : "Sign Up"}
        </MainButton>
      </Box>
    </form>
  );
}