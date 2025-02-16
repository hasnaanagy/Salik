import React, { useState } from "react";
import {
  FormControl,
  Box,
  FormHelperText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { validateLoginForm } from "../validation/validation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlices";
import { useNavigate } from "react-router-dom";
import { StyledOutlinedInput, StyledInputLabel } from "../custom/MainInput";
import { MainButton } from "../custom/MainButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "../styles/styles.module.css";

export default function Login() {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors(validateLoginForm({ ...formData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      await dispatch(loginUser(formData));
      navigate("/addTrip");
    }
  };

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

        {error && <FormHelperText error>{error}</FormHelperText>}

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
