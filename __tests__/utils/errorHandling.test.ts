import { FirebaseError } from 'firebase/app';
import {
  ErrorType,
  AppError,
  handleFirebaseError,
  createValidationError,
  createNetworkError,
  createNotFoundError,
  createPermissionError,
} from '@/utils/errorHandling';

// Helper to create a mock FirebaseError
const createMockFirebaseError = (code: string, message: string): FirebaseError => {
  const error = new Error(message);
  Object.setPrototypeOf(error, FirebaseError.prototype); // Set the prototype
  // Assign properties AFTER setting the prototype and ensuring they are writable
  Object.defineProperties(error, {
    code: { value: code, writable: true },
    name: { value: 'FirebaseError', writable: true } // name is often non-writable on Error
  });
  return error as FirebaseError;
};

describe('Error Handling Utilities', () => {
  describe('handleFirebaseError', () => {
    it('should handle known auth errors', () => {
      const error = createMockFirebaseError('auth/user-not-found', 'User not found.');
      const appError = handleFirebaseError(error);
      expect(appError.type).toBe(ErrorType.AUTH);
      expect(appError.code).toBe('auth/user-not-found');
      expect(appError.message).toBe('No account found with this email address');
      expect(appError.originalError).toBe(error);
    });

    it('should handle unknown auth errors with default message', () => {
        const error = createMockFirebaseError('auth/some-unknown-error', 'A strange auth error.');
        const appError = handleFirebaseError(error);
        expect(appError.type).toBe(ErrorType.AUTH);
        expect(appError.code).toBe('auth/some-unknown-error');
        expect(appError.message).toBe('Authentication error: A strange auth error.');
        expect(appError.originalError).toBe(error);
    });

    it('should handle known firestore errors', () => {
      const error = createMockFirebaseError('firestore/permission-denied', 'Permission denied.');
      const appError = handleFirebaseError(error);
      expect(appError.type).toBe(ErrorType.FIRESTORE);
      expect(appError.code).toBe('firestore/permission-denied');
      expect(appError.message).toBe('You don\'t have permission to access this data');
      expect(appError.originalError).toBe(error);
    });
    
     it('should handle unknown firestore errors with default message', () => {
        const error = createMockFirebaseError('firestore/some-unknown-error', 'A strange database error.');
        const appError = handleFirebaseError(error);
        expect(appError.type).toBe(ErrorType.FIRESTORE);
        expect(appError.code).toBe('firestore/some-unknown-error');
        expect(appError.message).toBe('Database error: A strange database error.');
        expect(appError.originalError).toBe(error);
    });

    it('should handle known storage errors', () => {
      const error = createMockFirebaseError('storage/object-not-found', 'Object not found.');
      const appError = handleFirebaseError(error);
      expect(appError.type).toBe(ErrorType.STORAGE);
      expect(appError.code).toBe('storage/object-not-found');
      expect(appError.message).toBe('The file you requested does not exist');
      expect(appError.originalError).toBe(error);
    });

    it('should handle unknown storage errors with default message', () => {
        const error = createMockFirebaseError('storage/some-unknown-error', 'A strange storage error.');
        const appError = handleFirebaseError(error);
        expect(appError.type).toBe(ErrorType.STORAGE);
        expect(appError.code).toBe('storage/some-unknown-error');
        expect(appError.message).toBe('Storage error: A strange storage error.');
        expect(appError.originalError).toBe(error);
    });

    it('should handle non-Firebase errors as generic errors', () => {
      const error = new Error('Something else went wrong');
      const appError = handleFirebaseError(error);
      expect(appError.type).toBe(ErrorType.GENERIC);
      expect(appError.code).toBe('unknown_error');
      expect(appError.message).toBe('Something else went wrong');
      expect(appError.originalError).toBe(error);
    });
    
    it('should handle non-Firebase errors without a message', () => {
      const error = {}; // Plain object error
      const appError = handleFirebaseError(error);
      expect(appError.type).toBe(ErrorType.GENERIC);
      expect(appError.code).toBe('unknown_error');
      expect(appError.message).toBe('An unknown error occurred');
      expect(appError.originalError).toBe(error);
    });

     it('should handle Firebase errors with codes not matching known prefixes', () => {
      const error = createMockFirebaseError('functions/internal', 'Cloud function internal error.');
      const appError = handleFirebaseError(error);
      expect(appError.type).toBe(ErrorType.GENERIC); // Falls back to generic
      expect(appError.code).toBe('functions/internal');
      expect(appError.message).toBe('Cloud function internal error.'); 
      expect(appError.originalError).toBe(error);
    });
  });

  describe('createValidationError', () => {
    it('should create a validation error with default code', () => {
      const message = 'Invalid input';
      const appError = createValidationError(message);
      expect(appError.type).toBe(ErrorType.VALIDATION);
      expect(appError.code).toBe('validation_error');
      expect(appError.message).toBe(message);
      expect(appError.originalError).toBeUndefined();
    });

    it('should create a validation error with custom code', () => {
      const message = 'Email format incorrect';
      const code = 'email_format';
      const appError = createValidationError(message, code);
      expect(appError.type).toBe(ErrorType.VALIDATION);
      expect(appError.code).toBe(code);
      expect(appError.message).toBe(message);
    });
  });

  describe('createNetworkError', () => {
    it('should create a network error with default message', () => {
      const appError = createNetworkError();
      expect(appError.type).toBe(ErrorType.NETWORK);
      expect(appError.code).toBe('network_error');
      expect(appError.message).toBe('Network connection issue detected');
      expect(appError.originalError).toBeUndefined();
    });

    it('should create a network error with custom message', () => {
      const message = 'Failed to connect to server';
      const appError = createNetworkError(message);
      expect(appError.type).toBe(ErrorType.NETWORK);
      expect(appError.code).toBe('network_error');
      expect(appError.message).toBe(message);
    });
  });

  describe('createNotFoundError', () => {
    it('should create a not found error with default message', () => {
      const appError = createNotFoundError();
      expect(appError.type).toBe(ErrorType.NOT_FOUND);
      expect(appError.code).toBe('not_found');
      expect(appError.message).toBe('The requested resource was not found');
      expect(appError.originalError).toBeUndefined();
    });

    it('should create a not found error with custom message', () => {
      const message = 'User profile not found';
      const appError = createNotFoundError(message);
      expect(appError.type).toBe(ErrorType.NOT_FOUND);
      expect(appError.code).toBe('not_found');
      expect(appError.message).toBe(message);
    });
  });

  describe('createPermissionError', () => {
    it('should create a permission error with default message', () => {
      const appError = createPermissionError();
      expect(appError.type).toBe(ErrorType.PERMISSION);
      expect(appError.code).toBe('permission_denied');
      expect(appError.message).toBe('You do not have permission for this action');
      expect(appError.originalError).toBeUndefined();
    });

    it('should create a permission error with custom message', () => {
      const message = 'Admin access required';
      const appError = createPermissionError(message);
      expect(appError.type).toBe(ErrorType.PERMISSION);
      expect(appError.code).toBe('permission_denied');
      expect(appError.message).toBe(message);
    });
  });
}); 