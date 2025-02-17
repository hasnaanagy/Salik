import React, { useState } from "react";
import { FormControl, Box, FormHelperText, InputAdornment, IconButton } from "@mui/material";
import { validateField } from "../validation/validation";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../redux/slices/authSlices";
import { useNavigate } from "react-router-dom";
import { StyledOutlinedInput, StyledInputLabel } from "../custom/MainInput";
import { MainButton } from "../custom/MainButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import styles from "../styles/styles.module.css";
import { Alert, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";


export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    nationalId: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value, formData);
    setErrors({ ...errors, [name]: error });
  };

  const handlePasswordToggle = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
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
  
      try {
        console.log("Data to be submitted:", dataToSubmit);
      
        const response = await dispatch(signUpUser(dataToSubmit)).unwrap();
      
        console.log("Signup Response:", response);
      
       
        setErrors({ general: "User registered successfully!" });
  
        toast.success("Signup successful! Redirecting...");
      
        setTimeout(() => navigate("/login"), 3000);
      } 
      catch (error) {
        console.error("Signup Error:", error);
      
        let errorMessage = "An error occurred. Please try again.";
      
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 400) {
          errorMessage = "Invalid input. Please check your details.";
        }
      
        setErrors((prevErrors) => ({ ...prevErrors, general: errorMessage }));
        toast.error(errorMessage);
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
              type={field.includes("password") && !showPassword[field] ? "password" : "text"}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              endAdornment={
                field.includes("password") && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handlePasswordToggle(field)} edge="end">
                      {showPassword[field] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            />
            {errors[field] && <FormHelperText>{errors[field]}</FormHelperText>}
          </FormControl>
        ))}

{errors.general && (
  <Alert
    severity={errors.general === "User registered successfully!" ? "success" : "error"}
    icon={errors.general === "User registered successfully!" ? <CheckCircleIcon /> : <ErrorIcon />}
    sx={{
      mt: 2,
      display: "flex",
      alignItems: "center",
      // justifyContent: "space-between",
      fontSize: "14px",
      fontWeight: "bold",
    }}
  >
    <Typography variant="body2">{errors.general}</Typography>
    {errors.general !== "User registered successfully!" && (
      <a href="/login" style={{ color: "#FFB800", textDecoration: "underline", marginLeft: "10px" }}>
        Login
      </a>
    )}
  </Alert>
)}


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
