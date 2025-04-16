import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { validateField } from "../validation/validation";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user, token } = useSelector((state) => state.auth);

  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      if (result.payload.token) {
        setSuccessMessage("✅ Login successful!");
        setErrors({ general: "" });
      }
    } else {
      console.error("Login error:", result.payload);
      setErrors({ general: result.payload || "Invalid credentials" });
    }
  };

  // Navigate based on user type after successful login
  useEffect(() => {
    if (token && user) {
      console.log("User after login:", user); // Debug log
      setTimeout(() => {
        if (user.userType === "admin") { // Use user.userType instead of user.type
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 2000);
    }
  }, [token, user, navigate]); // Depend on token and user

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
    <form onSubmit={handleLogin} noValidate autoComplete="off">
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

        <MainButton
          type="submit"
          style={{ width: "100%",backgroundColor: "#ffb800" }}
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