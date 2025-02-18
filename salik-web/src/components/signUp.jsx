import React, { useState } from "react";
import {
  FormControl,
  Box,
  FormHelperText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { validateField } from "../validation/validation"; // Import validateField
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../redux/slices/authSlices";
import { useNavigate } from "react-router-dom";
import { StyledOutlinedInput, StyledInputLabel } from "../custom/MainInput";
import { MainButton } from "../custom/MainButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field as user types
    const error = validateField(name, value, formData);
    setErrors({ ...errors, [name]: error });
  };

  const handlePasswordToggle = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    // Perform validation for each field
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) formErrors[field] = error;
    });

    // Additional validation to check if passwords match
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const { confirmPassword, ...dataToSubmit } = formData;

      // Add a log here to see the data being sent
      console.log("Sending data to server:", dataToSubmit);

      try {
        const { user } = await dispatch(signUpUser(dataToSubmit));

        navigate("/login");
      } catch (error) {
        console.error("Error registering user:", error);
      }
    }
  };

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
                  field.includes("password") && !showPassword[field]
                    ? "password"
                    : "text"
                }
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                endAdornment={
                  field.includes("password") && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handlePasswordToggle(field)}
                        edge="end"
                      >
                        {showPassword[field] ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              />
              {errors[field] && (
                <FormHelperText>{errors[field]}</FormHelperText>
              )}
            </FormControl>
          )
        )}

        {error && <FormHelperText error>{error}</FormHelperText>}

        <MainButton
          type="submit"
          variant="contained"
          disabled={loading}
          style={{ backgroundColor: "#FFB800", color: "black" }}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </MainButton>
      </Box>
    </form>
  );
}
