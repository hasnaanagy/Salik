import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/slices/authSlice";
import {
  FormControl,
  Box,
  FormHelperText,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  styled,
  InputLabel,
  OutlinedInput,
  Typography,
  Button
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { validateField } from "../../validation/validation";

// Styled components for form elements
const StyledAlert = styled(Alert)(() => ({
  marginTop: '16px',
  width: '100%',
  borderRadius: '8px',
  fontSize: '14px',
  '& .MuiAlert-icon': {
    fontSize: '20px'
  },
  '&.MuiAlert-standardError': {
    backgroundColor: 'rgba(211, 47, 47, 0.12)',
    color: '#d32f2f'
  },
  '&.MuiAlert-standardSuccess': {
    backgroundColor: 'rgba(46, 125, 50, 0.12)',
    color: '#2e7d32'
  }
}));

const StyledFieldLabel = styled(Typography)({
  fontSize: '14px',
  fontWeight: 500,
  color: '#666',
  marginBottom: '8px'
});

const StyledInput = styled(OutlinedInput)({
  backgroundColor: '#f7f9fc',
  borderRadius: '8px',
  border: 'none',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ffb800',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ffb800',
    borderWidth: '1px',
  }
});

const LoginButton = styled(Button)({
  backgroundColor: '#ffb800',
  color: '#000',
  fontWeight: 'bold',
  borderRadius: '8px',
  padding: '12px 0',
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: '#e6a600',
  },
  '&.Mui-disabled': {
    backgroundColor: '#ffd980',
    color: '#555',
  }
});

export default function LoginLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user, token } = useSelector((state) => state.auth);

  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    const fieldErrors = {};
    if (!formData.phone) fieldErrors.phone = "Phone number is required";
    if (!formData.password) fieldErrors.password = "Password is required";
    
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      if (result.payload.token) {
        // Check if user is admin
        if (result.payload.user && result.payload.user.type !== "admin") {
          setErrors({ 
            general: "Access denied. Only administrators can access the dashboard." 
          });
          setSuccessMessage("");
        } else {
          setSuccessMessage("✅ Login successful!");
          setErrors({ general: "" });
        }
      }
    } else {
      console.error("Login error:", result.payload);
      setErrors({ general: result.payload || "Invalid credentials" });
      setSuccessMessage("");
    }
  };

  // Navigate based on user type after successful login
  useEffect(() => {
    if (token && user) {
      if (user.type === "admin") {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
  }, [token, user, navigate]);

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

  const labelMap = {
    phone: "Phone",
    password: "Password"
  };

  return (
    <form onSubmit={handleLogin} noValidate autoComplete="off">
      <Box sx={{ width: '100%' }}>
        {/* Phone Input */}
        <Box sx={{ mb: 3 }}>
          <StyledFieldLabel>{labelMap.phone}</StyledFieldLabel>
          <StyledInput
            fullWidth
            id="phone"
            name="phone"
            placeholder="01111122222"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
          />
          {errors.phone && (
            <FormHelperText error sx={{ mt: 0.5, ml: 0 }}>
              {errors.phone}
            </FormHelperText>
          )}
        </Box>

        {/* Password Input */}
        <Box sx={{ mb: 3 }}>
          <StyledFieldLabel>{labelMap.password}</StyledFieldLabel>
          <StyledInput
            fullWidth
            id="password"
            name="password"
            type={passwordVisible ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handlePasswordToggle} edge="end" size="small">
                  {passwordVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.password && (
            <FormHelperText error sx={{ mt: 0.5, ml: 0 }}>
              {errors.password}
            </FormHelperText>
          )}
        </Box>

        {/* Login Button */}
        <LoginButton
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "LOGIN"}
        </LoginButton>
      </Box>

      {/* Error and Success Alerts */}
      {errors.general && (
        <StyledAlert 
          severity="error"
          sx={{
            fontWeight: errors.general.includes('Access denied') ? 'medium' : 'normal',
          }}
        >
          {errors.general}
        </StyledAlert>
      )}
      {successMessage && (
        <StyledAlert severity="success">
          {successMessage}
        </StyledAlert>
      )}
    </form>
  );
}