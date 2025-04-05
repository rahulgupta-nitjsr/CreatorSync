// Validation rules for form fields

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return null;
};

// Password confirmation validation
export const validatePasswordConfirmation = (password: string, confirmation: string): string | null => {
  if (!confirmation) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmation) {
    return 'Passwords do not match';
  }
  
  return null;
};

// Username validation
export const validateUsername = (username: string): string | null => {
  if (!username) {
    return 'Username is required';
  }
  
  if (username.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  
  if (username.length > 20) {
    return 'Username must be less than 20 characters long';
  }
  
  // Only allow alphanumeric characters, underscores, and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return 'Username can only contain letters, numbers, underscores, and hyphens';
  }
  
  return null;
};

// Name validation
export const validateName = (name: string): string | null => {
  if (!name) {
    return 'Name is required';
  }
  
  if (name.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  if (name.length > 50) {
    return 'Name must be less than 50 characters long';
  }
  
  return null;
};

// URL validation
export const validateUrl = (url: string): string | null => {
  if (!url) {
    return null; // URL might be optional
  }
  
  try {
    new URL(url);
    return null;
  } catch (e) {
    return 'Please enter a valid URL';
  }
};

// Phone validation
export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return null; // Phone might be optional
  }
  
  // Basic phone validation - customize based on your requirements
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s()-]/g, ''))) {
    return 'Please enter a valid phone number';
  }
  
  return null;
};

// Required field validation
export const validateRequired = (value: string, fieldName: string = 'This field'): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  
  return null;
};

// Length validation
export const validateLength = (
  value: string, 
  min: number, 
  max: number, 
  fieldName: string = 'This field'
): string | null => {
  if (!value) {
    return null; // Let validateRequired handle empty values
  }
  
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters long`;
  }
  
  if (value.length > max) {
    return `${fieldName} must be less than ${max} characters long`;
  }
  
  return null;
};

// Number validation
export const validateNumber = (value: string): string | null => {
  if (!value) {
    return null; // Let validateRequired handle empty values
  }
  
  if (isNaN(Number(value))) {
    return 'Please enter a valid number';
  }
  
  return null;
};

// Range validation
export const validateRange = (
  value: string, 
  min: number, 
  max: number, 
  fieldName: string = 'This value'
): string | null => {
  if (!value) {
    return null; // Let validateRequired handle empty values
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    return 'Please enter a valid number';
  }
  
  if (num < min) {
    return `${fieldName} must be at least ${min}`;
  }
  
  if (num > max) {
    return `${fieldName} must be at most ${max}`;
  }
  
  return null;
};

// Form validation helper
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string | null>;
}

// Generic form validator function
export const validateForm = <T extends Record<string, any>>(
  data: T,
  validationRules: Record<keyof T, (value: any) => string | null>
): ValidationResult => {
  const errors: Record<string, string | null> = {};
  let isValid = true;
  
  for (const field in validationRules) {
    if (validationRules.hasOwnProperty(field)) {
      const error = validationRules[field](data[field]);
      errors[field] = error;
      
      if (error) {
        isValid = false;
      }
    }
  }
  
  return { isValid, errors };
}; 