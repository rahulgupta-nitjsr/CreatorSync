import { FirebaseError } from 'firebase/app';

// Error types
export enum ErrorType {
  AUTH = 'Authentication Error',
  FIRESTORE = 'Database Error',
  STORAGE = 'Storage Error',
  NETWORK = 'Network Error',
  VALIDATION = 'Validation Error',
  PERMISSION = 'Permission Error',
  NOT_FOUND = 'Not Found Error',
  GENERIC = 'Application Error',
}

// Error structure for the application
export interface AppError {
  type: ErrorType;
  code: string;
  message: string;
  originalError?: any;
}

// Convert Firebase errors into app errors
export const handleFirebaseError = (error: any): AppError => {
  if (!(error instanceof FirebaseError)) {
    return {
      type: ErrorType.GENERIC,
      code: 'unknown_error',
      message: error?.message || 'An unknown error occurred',
      originalError: error,
    };
  }

  const firebaseError = error as FirebaseError;
  
  // Handle auth errors
  if (firebaseError.code.startsWith('auth/')) {
    return handleAuthError(firebaseError);
  }
  
  // Handle Firestore errors
  if (firebaseError.code.startsWith('firestore/')) {
    return handleFirestoreError(firebaseError);
  }
  
  // Handle Storage errors
  if (firebaseError.code.startsWith('storage/')) {
    return handleStorageError(firebaseError);
  }
  
  // Default case
  return {
    type: ErrorType.GENERIC,
    code: firebaseError.code,
    message: firebaseError.message,
    originalError: firebaseError,
  };
};

// Handle authentication errors
const handleAuthError = (error: FirebaseError): AppError => {
  let message = 'An authentication error occurred';
  
  switch (error.code) {
    case 'auth/user-not-found':
      message = 'No account found with this email address';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password';
      break;
    case 'auth/email-already-in-use':
      message = 'This email is already registered';
      break;
    case 'auth/weak-password':
      message = 'Password should be at least 6 characters';
      break;
    case 'auth/invalid-email':
      message = 'Please enter a valid email address';
      break;
    case 'auth/requires-recent-login':
      message = 'Please sign in again to complete this action';
      break;
    case 'auth/account-exists-with-different-credential':
      message = 'An account already exists with the same email but different sign-in credentials';
      break;
    case 'auth/user-disabled':
      message = 'This account has been disabled';
      break;
    case 'auth/popup-closed-by-user':
      message = 'Sign-in popup was closed before completing the sign in';
      break;
    case 'auth/network-request-failed':
      message = 'Network error occurred. Please check your connection';
      break;
    case 'auth/too-many-requests':
      message = 'Too many unsuccessful login attempts. Please try again later';
      break;
    default:
      message = `Authentication error: ${error.message}`;
  }
  
  return {
    type: ErrorType.AUTH,
    code: error.code,
    message,
    originalError: error,
  };
};

// Handle Firestore errors
const handleFirestoreError = (error: FirebaseError): AppError => {
  let message = 'A database error occurred';
  
  switch (error.code) {
    case 'firestore/permission-denied':
      message = 'You don\'t have permission to access this data';
      break;
    case 'firestore/not-found':
      message = 'The requested document was not found';
      break;
    case 'firestore/failed-precondition':
      message = 'Operation failed due to a precondition failure';
      break;
    case 'firestore/invalid-argument':
      message = 'Invalid query or document data';
      break;
    case 'firestore/unavailable':
      message = 'The database service is currently unavailable';
      break;
    default:
      message = `Database error: ${error.message}`;
  }
  
  return {
    type: ErrorType.FIRESTORE,
    code: error.code,
    message,
    originalError: error,
  };
};

// Handle Storage errors
const handleStorageError = (error: FirebaseError): AppError => {
  let message = 'A storage error occurred';
  
  switch (error.code) {
    case 'storage/object-not-found':
      message = 'The file you requested does not exist';
      break;
    case 'storage/unauthorized':
      message = 'You don\'t have permission to access this file';
      break;
    case 'storage/canceled':
      message = 'The file operation was canceled';
      break;
    case 'storage/quota-exceeded':
      message = 'Storage quota exceeded. Please contact support';
      break;
    case 'storage/invalid-url':
      message = 'Invalid storage URL';
      break;
    case 'storage/retry-limit-exceeded':
      message = 'Maximum retry time exceeded. Please try again later';
      break;
    default:
      message = `Storage error: ${error.message}`;
  }
  
  return {
    type: ErrorType.STORAGE,
    code: error.code,
    message,
    originalError: error,
  };
};

// Validation error helper
export const createValidationError = (message: string, code: string = 'validation_error'): AppError => {
  return {
    type: ErrorType.VALIDATION,
    code,
    message,
  };
};

// Network error helper
export const createNetworkError = (message: string = 'Network connection issue detected'): AppError => {
  return {
    type: ErrorType.NETWORK,
    code: 'network_error',
    message,
  };
};

// Not found error helper
export const createNotFoundError = (message: string = 'The requested resource was not found'): AppError => {
  return {
    type: ErrorType.NOT_FOUND,
    code: 'not_found',
    message,
  };
};

// Permission error helper
export const createPermissionError = (message: string = 'You do not have permission for this action'): AppError => {
  return {
    type: ErrorType.PERMISSION,
    code: 'permission_denied',
    message,
  };
}; 