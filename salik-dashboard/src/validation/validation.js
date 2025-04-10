export const validateForm = (formData) => {
  let errors = {};

  // Loop over formData and validate each field
  Object.keys(formData).forEach(field => {
    const error = validateField(field, formData[field], formData);
    if (error) errors[field] = error;
  });

  return errors;
};

export const validateField = (name, value, formData) => {
  let error = '';

  switch (name) {
    case 'fullName':
      if (!value.trim()) {
        error = 'User Name is required';
      } else if (value.length < 3) {
        error = 'User Name must be at least 3 characters long';
      }
      break;
    case 'phone':
      if (!value.trim()) {
        error = 'Phone is required';
      } else if (!/^[0-9]{11}$/.test(value)) {
        error = 'Invalid phone number (must be 11 digits)';
      }
      break;
    case 'password':
      if (!value.trim()) {
        error = 'Password is required';
      } else if (value.length < 8) {
        error = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(value)) {
        error = 'Password must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(value)) {
        error = 'Password must contain at least one lowercase letter';
      } else if (!/[0-9]/.test(value)) {
        error = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        error = 'Password must contain at least one special character';
      } else if (/\s/.test(value)) {
        error = 'Password should not contain spaces';
      }
      break;
    case 'confirmPassword':
      if (!value.trim()) {
        error = 'Confirm Password is required';
      } else if (value !== formData.password) {
        error = 'Passwords do not match';
      }
      break;
    case 'nationalId':
      if (!value.trim()) {
        error = 'National ID is required';
      } else if (value.length !== 14) {
        error = 'National ID must be exactly 14 characters';
      }
      break;
    default:
      break;
  }

  return error;
};
