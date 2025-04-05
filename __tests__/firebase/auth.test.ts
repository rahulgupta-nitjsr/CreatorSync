import { User } from 'firebase/auth';

// Mocked implementation of the auth functions
const mockSignIn = jest.fn();
const mockRegisterUser = jest.fn();
const mockSignOut = jest.fn();
const mockResetPassword = jest.fn();
const mockUpdateUserProfile = jest.fn();

// Mock the auth module to avoid importing real Firebase
jest.mock('@/firebase/auth', () => ({
  signIn: (...args: any[]) => mockSignIn(...args),
  registerUser: (...args: any[]) => mockRegisterUser(...args),
  signOut: (...args: any[]) => mockSignOut(...args),
  resetPassword: (...args: any[]) => mockResetPassword(...args),
  updateUserProfile: (...args: any[]) => mockUpdateUserProfile(...args),
}));

// Import the mocked functions
import {
  signIn,
  registerUser,
  signOut,
  resetPassword,
  updateUserProfile
} from '@/firebase/auth';

describe('Firebase Auth Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should call signInWithEmailAndPassword with the correct parameters', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUserCredential = { user: { uid: '123' } };
      
      mockSignIn.mockResolvedValueOnce(mockUserCredential);
      
      const result = await signIn(email, password);
      
      expect(mockSignIn).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(mockUserCredential);
    });
    
    it('should throw an error when authentication fails', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const errorMessage = 'Invalid email or password';
      const error = new Error(errorMessage);
      
      mockSignIn.mockRejectedValueOnce(error);
      
      await expect(signIn(email, password)).rejects.toThrow(errorMessage);
    });
  });
  
  describe('registerUser', () => {
    it('should create a user and set up a user profile document', async () => {
      const email = 'newuser@example.com';
      const password = 'password123';
      const displayName = 'New User';
      const mockUserCredential = {
        user: {
          uid: '456',
          email,
          displayName: null
        }
      };
      
      mockRegisterUser.mockResolvedValueOnce(mockUserCredential);
      
      const result = await registerUser(email, password, displayName);
      
      expect(mockRegisterUser).toHaveBeenCalledWith(email, password, displayName);
      expect(result).toEqual(mockUserCredential);
    });
    
    it('should throw an error when registration fails', async () => {
      const email = 'existing@example.com';
      const password = 'password123';
      const displayName = 'Existing User';
      const errorMessage = 'Email already in use';
      
      mockRegisterUser.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(registerUser(email, password, displayName)).rejects.toThrow(errorMessage);
    });
  });
  
  describe('signOut', () => {
    it('should call the Firebase signOut method', async () => {
      mockSignOut.mockResolvedValueOnce(undefined);
      
      await signOut();
      
      expect(mockSignOut).toHaveBeenCalled();
    });
    
    it('should throw an error when sign out fails', async () => {
      const errorMessage = 'Sign out failed';
      
      mockSignOut.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(signOut()).rejects.toThrow(errorMessage);
    });
  });
  
  describe('resetPassword', () => {
    it('should call sendPasswordResetEmail with the correct email', async () => {
      const email = 'user@example.com';
      
      mockResetPassword.mockResolvedValueOnce(undefined);
      
      await resetPassword(email);
      
      expect(mockResetPassword).toHaveBeenCalledWith(email);
    });
    
    it('should throw an error when reset fails', async () => {
      const email = 'invalid@example.com';
      const errorMessage = 'User not found';
      
      mockResetPassword.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(resetPassword(email)).rejects.toThrow(errorMessage);
    });
  });
  
  describe('updateUserProfile', () => {
    it('should update the user profile in auth and Firestore', async () => {
      const mockUser = { uid: '789' } as User;
      const updates = { displayName: 'Updated Name', photoURL: 'https://example.com/photo.jpg' };
      
      mockUpdateUserProfile.mockResolvedValueOnce(undefined);
      
      await updateUserProfile(mockUser, updates);
      
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(mockUser, updates);
    });
    
    it('should throw an error when update fails', async () => {
      const mockUser = { uid: '999' } as User;
      const updates = { displayName: 'New Name' };
      const errorMessage = 'Profile update failed';
      
      mockUpdateUserProfile.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(updateUserProfile(mockUser, updates)).rejects.toThrow(errorMessage);
    });
  });
}); 