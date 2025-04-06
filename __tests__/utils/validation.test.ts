import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateUsername,
  validateName,
  validateUrl,
  validatePhone,
  validateRequired,
  validateLength,
  validateNumber,
  validateRange,
  validateForm,
} from '@/utils/validation';

describe('Validation Utilities', () => {
  // --- validateEmail ---
  describe('validateEmail', () => {
    it('should return null for valid emails', () => {
      expect(validateEmail('test@example.com')).toBeNull();
      expect(validateEmail('test.name@example.co.uk')).toBeNull();
    });

    it('should return error for empty email', () => {
      expect(validateEmail('')).toBe('Email is required');
    });

    it('should return error for invalid emails', () => {
      expect(validateEmail('test@example')).toBe('Please enter a valid email address');
      expect(validateEmail('test example.com')).toBe('Please enter a valid email address');
      expect(validateEmail('test@.com')).toBe('Please enter a valid email address');
    });
  });

  // --- validatePassword ---
  describe('validatePassword', () => {
    it('should return null for valid passwords', () => {
      expect(validatePassword('ValidPass1')).toBeNull();
      expect(validatePassword('AnotherValidP@ssw0rd')).toBeNull();
    });

    it('should return error for empty password', () => {
      expect(validatePassword('')).toBe('Password is required');
    });

    it('should return error for short passwords', () => {
      expect(validatePassword('Short1')).toBe('Password must be at least 8 characters long');
    });

    it('should return error for missing uppercase', () => {
      expect(validatePassword('nouppercase1')).toBe('Password must contain at least one uppercase letter');
    });

    it('should return error for missing lowercase', () => {
      expect(validatePassword('NOLOWERCASE1')).toBe('Password must contain at least one lowercase letter');
    });

    it('should return error for missing number', () => {
      expect(validatePassword('NoNumberPass')).toBe('Password must contain at least one number');
    });
  });

  // --- validatePasswordConfirmation ---
  describe('validatePasswordConfirmation', () => {
    it('should return null if passwords match', () => {
      expect(validatePasswordConfirmation('password123', 'password123')).toBeNull();
    });

    it('should return error if confirmation is empty', () => {
      expect(validatePasswordConfirmation('password123', '')).toBe('Please confirm your password');
    });

    it('should return error if passwords do not match', () => {
      expect(validatePasswordConfirmation('password123', 'password456')).toBe('Passwords do not match');
    });
  });

  // --- validateUsername ---
  describe('validateUsername', () => {
    it('should return null for valid usernames', () => {
      expect(validateUsername('validUser')).toBeNull();
      expect(validateUsername('user-name_123')).toBeNull();
    });

    it('should return error for empty username', () => {
      expect(validateUsername('')).toBe('Username is required');
    });

    it('should return error for short usernames', () => {
      expect(validateUsername('ab')).toBe('Username must be at least 3 characters long');
    });

    it('should return error for long usernames', () => {
      expect(validateUsername('aVeryLongUsernameIndeed1234')).toBe('Username must be less than 20 characters long');
    });

    it('should return error for invalid characters', () => {
      expect(validateUsername('user name')).toBe('Username can only contain letters, numbers, underscores, and hyphens');
      expect(validateUsername('user@name')).toBe('Username can only contain letters, numbers, underscores, and hyphens');
    });
  });

  // --- validateName ---
  describe('validateName', () => {
    it('should return null for valid names', () => {
      expect(validateName('Valid Name')).toBeNull();
      expect(validateName("O'Malley")).toBeNull(); // Use double quotes for string with apostrophe
    });

    it('should return error for empty name', () => {
      expect(validateName('')).toBe('Name is required');
    });

    it('should return error for short names', () => {
      expect(validateName('A')).toBe('Name must be at least 2 characters long');
    });

    it('should return error for long names', () => {
      const longName = 'a'.repeat(51);
      expect(validateName(longName)).toBe('Name must be less than 50 characters long');
    });
  });

  // --- validateUrl ---
  describe('validateUrl', () => {
    it('should return null for valid URLs', () => {
      expect(validateUrl('http://example.com')).toBeNull();
      expect(validateUrl('https://www.example.com/path?query=1')).toBeNull();
    });

    it('should return null for empty URL (optional)', () => {
      expect(validateUrl('')).toBeNull();
    });

    it('should return error for invalid URLs', () => {
      expect(validateUrl('invalid-url')).toBe('Please enter a valid URL');
      expect(validateUrl('ftp://example.com')).toBeNull(); // URL constructor accepts ftp
      expect(validateUrl('www.example.com')).toBe('Please enter a valid URL');
    });
  });

  // --- validatePhone ---
  describe('validatePhone', () => {
    it('should return null for valid phone numbers', () => {
      expect(validatePhone('1234567890')).toBeNull();
      expect(validatePhone('+11234567890')).toBeNull();
      expect(validatePhone('(123) 456-7890')).toBeNull();
    });

    it('should return null for empty phone (optional)', () => {
      expect(validatePhone('')).toBeNull();
    });

    it('should return error for invalid phone numbers', () => {
      expect(validatePhone('123')).toBe('Please enter a valid phone number');
      expect(validatePhone('abcdefghij')).toBe('Please enter a valid phone number');
    });
  });

  // --- validateRequired ---
  describe('validateRequired', () => {
    it('should return null for non-empty values', () => {
      expect(validateRequired('some value')).toBeNull();
      expect(validateRequired(' another value ')).toBeNull();
    });

    it('should return default error for empty or whitespace values', () => {
      expect(validateRequired('')).toBe('This field is required');
      expect(validateRequired('   ')).toBe('This field is required');
    });

    it('should return custom field name in error', () => {
      expect(validateRequired('', 'Custom Field')).toBe('Custom Field is required');
    });
  });

  // --- validateLength ---
  describe('validateLength', () => {
    it('should return null if length is within range', () => {
      expect(validateLength('abcde', 3, 10)).toBeNull();
    });

    it('should return null for empty value (handled by validateRequired)', () => {
      expect(validateLength('', 3, 10)).toBeNull();
    });

    it('should return error if length is less than min', () => {
      expect(validateLength('ab', 3, 10, 'Input')).toBe('Input must be at least 3 characters long');
    });

    it('should return error if length is greater than max', () => {
      expect(validateLength('abcdefghijk', 3, 10, 'Input')).toBe('Input must be less than 10 characters long');
    });
  });

  // --- validateNumber ---
  describe('validateNumber', () => {
    it('should return null for valid numbers', () => {
      expect(validateNumber('123')).toBeNull();
      expect(validateNumber('-123.45')).toBeNull();
      expect(validateNumber('0')).toBeNull();
    });

    it('should return null for empty value', () => {
      expect(validateNumber('')).toBeNull();
    });

    it('should return error for invalid numbers', () => {
      expect(validateNumber('abc')).toBe('Please enter a valid number');
      expect(validateNumber('12a')).toBe('Please enter a valid number');
    });
  });

  // --- validateRange ---
  describe('validateRange', () => {
    it('should return null if number is within range', () => {
      expect(validateRange('5', 0, 10)).toBeNull();
    });

    it('should return null for empty value', () => {
      expect(validateRange('', 0, 10)).toBeNull();
    });

    it('should return error if value is not a number', () => {
      expect(validateRange('abc', 0, 10)).toBe('Please enter a valid number');
    });

    it('should return error if number is less than min', () => {
      expect(validateRange('-1', 0, 10, 'Value')).toBe('Value must be at least 0');
    });

    it('should return error if number is greater than max', () => {
      expect(validateRange('11', 0, 10, 'Value')).toBe('Value must be at most 10');
    });
  });

  // --- validateForm ---
  describe('validateForm', () => {
    const rules = {
      email: validateEmail,
      password: (val: string) => validateRequired(val, 'Password') || validatePassword(val),
    };

    it('should return isValid: true and no errors for valid data', () => {
      const data = { email: 'test@example.com', password: 'ValidPass1' };
      const result = validateForm(data, rules);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({ email: null, password: null });
    });

    it('should return isValid: false and errors for invalid data', () => {
      const data = { email: 'invalid', password: 'short' };
      const result = validateForm(data, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
      expect(result.errors.password).toBe('Password must be at least 8 characters long');
    });

    it('should return isValid: false if any field has an error', () => {
      const data = { email: 'test@example.com', password: '' };
      const result = validateForm(data, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeNull();
      expect(result.errors.password).toBe('Password is required');
    });
  });
}); 