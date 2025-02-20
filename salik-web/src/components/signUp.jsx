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
import { validateField } from "../validation/validation";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { StyledOutlinedInput, StyledInputLabel } from "../custom/MainInput";
import { MainButton } from "../custom/MainButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "../styles/styles.module.css";
import { clearError, signupUser } from "../redux/slices/authSlices";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get loading, user, and error from Redux store
  const { loading, user, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    nationalId: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);

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

    if (Object.keys(formErrors).length === 0) {
      const { confirmPassword, ...dataToSubmit } = formData;

      dispatch(signupUser(dataToSubmit));
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

    if (error && error.toLowerCase().includes("already exists")) {
      setTimeout(() => {
        navigate("/login");

        dispatch(clearError());
      }, 2000);
    }
  }, [user, error, navigate, dispatch]);

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
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

        {/* Submit Button */}
        <MainButton
          type="submit"
          variant="contained"
          style={{ backgroundColor: "#FFB800", color: "black" }}
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
      {user && (
        <Alert severity="success" style={{ marginTop: 20 }}>
          ✅ User Registered Successfully!
        </Alert>
      )}
    </form>
  );
}
