import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/authSlice"; // Import loginUser action
import { useNavigate } from "react-router-dom";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, user, error } = useSelector((state) => state.auth);

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
      dispatch(loginUser(formData));
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }

    if (error) {
      if (
        error.toLowerCase().includes("does not exist") ||
        error.toLowerCase().includes("incorrect")
      ) {
        setTimeout(() => {
          navigate("/signup");
          dispatch(clearError());
        }, 4000);
      }
    }
  }, [user, error, navigate, dispatch]);

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

      {error && (
        <Alert severity="error" style={{ marginTop: 20 }}>
          {error}
        </Alert>
      )}
      {user && (
        <Alert severity="success" style={{ marginTop: 20 }}>
          ✅ Login Successful!
        </Alert>
      )}
    </form>
  );
}
