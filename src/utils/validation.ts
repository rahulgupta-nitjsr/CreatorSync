// Form validation utilities for CreatorSync

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Content validation
export const validateContent = (data: {
  title?: string;
  description?: string;
  platforms?: string[];
  scheduledDate?: string | null;
  status?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (data.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters long' });
  } else if (data.title.trim().length > 100) {
    errors.push({ field: 'title', message: 'Title must be less than 100 characters' });
  }

  // Description validation
  if (!data.description || data.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (data.description.trim().length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters long' });
  } else if (data.description.trim().length > 2000) {
    errors.push({ field: 'description', message: 'Description must be less than 2000 characters' });
  }

  // Platforms validation
  if (!data.platforms || data.platforms.length === 0) {
    errors.push({ field: 'platforms', message: 'Please select at least one platform' });
  }

  // Scheduled date validation
  if (data.status === 'scheduled') {
    if (!data.scheduledDate) {
      errors.push({ field: 'scheduledDate', message: 'Schedule date is required when status is scheduled' });
    } else {
      const scheduledDate = new Date(data.scheduledDate);
      const now = new Date();
      
      if (isNaN(scheduledDate.getTime())) {
        errors.push({ field: 'scheduledDate', message: 'Invalid date format' });
      } else if (scheduledDate <= now) {
        errors.push({ field: 'scheduledDate', message: 'Schedule date must be in the future' });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// User profile validation
export const validateUserProfile = (data: {
  displayName?: string;
  email?: string;
  bio?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  // Display name validation
  if (data.displayName && data.displayName.trim().length > 50) {
    errors.push({ field: 'displayName', message: 'Display name must be less than 50 characters' });
  }

  // Email validation
  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
  }

  // Bio validation
  if (data.bio && data.bio.trim().length > 500) {
    errors.push({ field: 'bio', message: 'Bio must be less than 500 characters' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Authentication validation
export const validateAuth = (data: {
  email?: string;
  password?: string;
  confirmPassword?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
  }

  // Password validation
  if (!data.password || data.password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
    errors.push({ 
      field: 'password', 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    });
  }

  // Confirm password validation
  if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// File upload validation
export const validateFileUpload = (file: File, options: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
} = {}): ValidationResult => {
  const errors: ValidationError[] = [];
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/avi'],
    maxWidth = 4096,
    maxHeight = 4096
  } = options;

  // File size validation
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    errors.push({ 
      field: 'file', 
      message: `File size must be less than ${maxSizeMB}MB` 
    });
  }

  // File type validation
  if (!allowedTypes.includes(file.type)) {
    errors.push({ 
      field: 'file', 
      message: `File type ${file.type} is not supported. Allowed types: ${allowedTypes.join(', ')}` 
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility function to get error message for a specific field
export const getFieldError = (errors: ValidationError[], field: string): string | undefined => {
  return errors.find(error => error.field === field)?.message;
};

// Utility function to check if a field has an error
export const hasFieldError = (errors: ValidationError[], field: string): boolean => {
  return errors.some(error => error.field === field);
}; 