import React, { useState } from 'react';
import { FormControl, Box, FormHelperText } from '@mui/material';
import { validateForm, validateField } from '../validation/validation';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../redux/slices/authSlices';
import { useNavigate } from 'react-router-dom';
import { StyledOutlinedInput, StyledInputLabel, SubmitButton } from '../custom/StyledInput';
import styles from '../styles/signUpStyles.module.css';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    nationalId: '',
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value, formData);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    const validationErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) {
        validationErrors[field] = error;
      }
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const { confirmPassword, ...dataToSubmit } = formData;
      await dispatch(signUpUser(dataToSubmit))
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Box className={styles.formBox}>
        {['fullName', 'phone', 'password', 'confirmPassword', 'nationalId'].map((field) => (
          <FormControl key={field} error={!!errors[field]}>
            <StyledInputLabel htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</StyledInputLabel>
            <StyledOutlinedInput
              id={field}
              name={field}
              type={field.includes('password') ? 'password' : 'text'}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
            />
            {errors[field] && (
              <FormHelperText>{errors[field]}</FormHelperText>
            )}
          </FormControl>
        ))}

        {error && <FormHelperText error>{error}</FormHelperText>}

        <SubmitButton
          type="submit"
          variant="contained"
          disabled={loading}
          style={{ backgroundColor: '#FFB800', color: 'black' }}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </SubmitButton>
      </Box>
    </form>
  );
}