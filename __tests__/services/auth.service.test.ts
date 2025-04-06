import { 
  User, 
  Auth,
  UserCredential
} from 'firebase/auth'; // Only import types
import { Timestamp } from 'firebase/firestore'; // Only import types

// Import the function signatures (interfaces might be better if complex)
import { 
  signIn as signInType, 
  signUp as signUpType, 
  logOut as logOutType, 
  resetPassword as resetPasswordType, 
  updateUserProfile as updateUserProfileType 
} from '@/services/auth';

// Declare variables for mock functions and instances
let mockAuthInstance: Partial<Auth>;
let mockFirestoreInstance: {}; // Use a more specific type if needed

let mockSignInWithEmailAndPassword: jest.Mock;
let mockCreateUserWithEmailAndPassword: jest.Mock;
let mockFirebaseSignOut: jest.Mock;
let mockSendPasswordResetEmail: jest.Mock;
let mockUpdateProfile: jest.Mock;
let mockSetDoc: jest.Mock;
let mockUpdateDoc: jest.Mock;
let mockDoc: jest.Mock;
let mockServerTimestamp: jest.Mock;

// Declare variables for the service functions (will be required inside beforeAll)
let signIn: typeof signInType;
let signUp: typeof signUpType;
let logOut: typeof logOutType;
let resetPassword: typeof resetPasswordType;
let updateUserProfile: typeof updateUserProfileType;


describe('Service: AuthService', () => {

  // Make beforeAll async to use await for dynamic import
  beforeAll(async () => {
    // Initialize mock instances
    mockAuthInstance = { currentUser: null };
    mockFirestoreInstance = {}; // Initialize as needed

    // Mock config first using doMock
    jest.doMock('@/firebase/config', () => ({
      auth: mockAuthInstance,
      firestore: mockFirestoreInstance,
    }));

    // Mock Firebase SDK modules
    jest.mock('firebase/auth', () => ({
      signInWithEmailAndPassword: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(),
      signOut: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
      updateProfile: jest.fn(),
      // Add other auth functions if needed by the service
    }));

    jest.mock('firebase/firestore', () => ({
      doc: jest.fn(),
      setDoc: jest.fn(),
      updateDoc: jest.fn(),
      serverTimestamp: jest.fn(() => Timestamp.now()), // Keep simple mock
      Timestamp: { // Need to mock static methods if used
          now: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })) // Keep simple mock
      }
      // Add other firestore functions if needed
    }));

    // --- Require the *mocked* modules ---
    const authModule = require('firebase/auth');
    const firestoreModule = require('firebase/firestore');

    // --- Assign mocks to variables ---
    mockSignInWithEmailAndPassword = authModule.signInWithEmailAndPassword;
    mockCreateUserWithEmailAndPassword = authModule.createUserWithEmailAndPassword;
    mockFirebaseSignOut = authModule.signOut;
    mockSendPasswordResetEmail = authModule.sendPasswordResetEmail;
    mockUpdateProfile = authModule.updateProfile;

    mockSetDoc = firestoreModule.setDoc;
    mockUpdateDoc = firestoreModule.updateDoc;
    mockDoc = firestoreModule.doc;
    mockServerTimestamp = firestoreModule.serverTimestamp;
    // Need to assign the mock for Timestamp.now if it's used directly
    // mockTimestampNow = firestoreModule.Timestamp.now; 

    // --- Dynamically import the service functions *after* mocks are set up ---
    const service = await import('@/services/auth');
    signIn = service.signIn;
    signUp = service.signUp;
    logOut = service.logOut;
    resetPassword = service.resetPassword;
    updateUserProfile = service.updateUserProfile;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset implementations if needed, e.g., serverTimestamp
    // mockServerTimestamp.mockImplementation(() => Timestamp.now()); 
    mockServerTimestamp.mockImplementation(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })); 
  });

  describe('signIn', () => {
    it('should call signInWithEmailAndPassword and return user credential', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = { uid: '123' } as User;
      const mockUserCredential = { user: mockUser };
      
      mockSignInWithEmailAndPassword.mockResolvedValue(mockUserCredential);
      
      const result = await signIn(email, password);
      
      // Use the mockAuthInstance variable
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(mockAuthInstance, email, password);
      expect(result).toEqual(mockUserCredential);
    });

    it('should throw error on signInWithEmailAndPassword failure', async () => {
      const email = 'test@example.com';
      const password = 'wrong';
      const error = new Error('Auth error');
      
      mockSignInWithEmailAndPassword.mockRejectedValue(error);
      
      await expect(signIn(email, password)).rejects.toThrow('Auth error');
      // Use the mockAuthInstance variable
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(mockAuthInstance, email, password);
    });
  });

  describe('signUp', () => {
    it('should call createUserWithEmailAndPassword, updateProfile, and setDoc', async () => {
      const email = 'new@example.com';
      const password = 'password123';
      const displayName = 'New User';
      // Important: This mockUser is what's returned by mockCreate...
      const mockUser = { uid: '456', email, displayName: null, photoURL: undefined } as User; 
      const mockDocRef = { id: 'mockDocRef' };
      const mockTimestamp = { seconds: 1743888071, nanoseconds: 516000000 }; // Example: ~2025-04-06
      mockServerTimestamp.mockReturnValue(mockTimestamp); 
      mockDoc.mockReturnValue(mockDocRef); // Ensure mockDoc returns the ref

      // Use mockResolvedValueOnce so it doesn't overwrite the implementation from beforeAll
      mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser } as UserCredential);
      mockUpdateProfile.mockResolvedValue(undefined);
      mockSetDoc.mockResolvedValue(undefined);

      await signUp(email, password, displayName);

      // Use the mockAuthInstance variable
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuthInstance, email, password);
      // updateProfile is called with the *specific* mockUser returned above
      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, { displayName });
      // Use the mockFirestoreInstance variable
      expect(mockDoc).toHaveBeenCalledWith(mockFirestoreInstance, 'users', '456');
      // Check setDoc call - uses data from mockUser *after* updateProfile mock (which doesn't update mockUser here)
      expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, {
        uid: '456',
        email, // from outer scope
        displayName: null, // From mockUser, as mockUpdateProfile didn't modify it
        photoURL: undefined, // From mockUser
        createdAt: expect.any(Object), // Service uses new Date(), not serverTimestamp here
        updatedAt: expect.any(Object), // Service uses new Date()
      });
    });

    it('should throw error if createUserWithEmailAndPassword fails', async () => {
      const email = 'new@example.com';
      const password = 'password123';
      const displayName = 'New User';
      const error = new Error('Create user error');
      
      mockCreateUserWithEmailAndPassword.mockRejectedValue(error);
      
      await expect(signUp(email, password, displayName)).rejects.toThrow('Create user error');
      expect(mockUpdateProfile).not.toHaveBeenCalled();
      expect(mockSetDoc).not.toHaveBeenCalled();
    });
    
    // TODO: Add test case for updateProfile failure during sign up
    // TODO: Add test case for setDoc failure during sign up
  });

  describe('logOut', () => {
    it('should call firebaseSignOut', async () => {
      mockFirebaseSignOut.mockResolvedValue(undefined);
      await logOut();
      // Use the mockAuthInstance variable
      expect(mockFirebaseSignOut).toHaveBeenCalledWith(mockAuthInstance);
    });

    it('should throw error on firebaseSignOut failure', async () => {
      const error = new Error('Sign out error');
      mockFirebaseSignOut.mockRejectedValue(error);
      await expect(logOut()).rejects.toThrow('Sign out error');
    });
  });

  describe('resetPassword', () => {
    it('should call sendPasswordResetEmail', async () => {
      const email = 'forgot@example.com';
      mockSendPasswordResetEmail.mockResolvedValue(undefined);
      await resetPassword(email);
      // Use the mockAuthInstance variable
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(mockAuthInstance, email);
    });

    it('should throw error on sendPasswordResetEmail failure', async () => {
      const email = 'forgot@example.com';
      const error = new Error('Reset error');
      mockSendPasswordResetEmail.mockRejectedValue(error);
      await expect(resetPassword(email)).rejects.toThrow('Reset error');
    });
  });

  describe('updateUserProfile', () => {
    it('should call updateProfile and updateDoc', async () => {
      const mockUser = { uid: '789', displayName: 'Old Name', photoURL: 'old_url' } as User;
      const updates = { displayName: 'Updated Name', photoURL: 'new_url', bio: 'New bio' };
      const mockDocRef = { id: 'mockDocRef' };
      const mockTimestamp = { seconds: 1743888071, nanoseconds: 516000000 };
      mockServerTimestamp.mockReturnValue(mockTimestamp);
      
      mockUpdateProfile.mockResolvedValue(undefined);
      mockUpdateDoc.mockResolvedValue(undefined);
      mockDoc.mockReturnValue(mockDocRef);

      await updateUserProfile(mockUser, updates);

      // Expect BOTH new displayName and new photoURL from updates
      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, { 
        displayName: updates.displayName, 
        photoURL: updates.photoURL // Expect new photoURL from updates
      });
      expect(mockDoc).toHaveBeenCalledWith(mockFirestoreInstance, 'users', '789');
      // updateDoc IS called, merging existing data
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
        bio: updates.bio,
        // Service uses provided data OR existing user data if not provided
        displayName: updates.displayName, 
        photoURL: updates.photoURL,
        updatedAt: expect.any(Object) // Service uses new Date()
      });
    });
    
    // This test case needs re-evaluation based on service logic.
    // The service *always* calls updateDoc now.
    it('should call updateProfile and updateDoc even if only auth fields are provided', async () => {
      const mockUser = { uid: '789', displayName: 'Old Name', photoURL: 'old_url' } as User;
      const updates = { displayName: 'Updated Name'};
      const mockDocRef = { id: 'mockDocRef' };
      const mockTimestamp = { seconds: 1743888071, nanoseconds: 516000000 };
      mockServerTimestamp.mockReturnValue(mockTimestamp);

      mockUpdateProfile.mockResolvedValue(undefined);
      mockUpdateDoc.mockResolvedValue(undefined);
      mockDoc.mockReturnValue(mockDocRef);

      await updateUserProfile(mockUser, updates);

      // Expect new displayName and EXISTING photoURL
      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, { 
          displayName: updates.displayName, 
          photoURL: mockUser.photoURL // Expect existing photoURL
      });
      expect(mockDoc).toHaveBeenCalledWith(mockFirestoreInstance, 'users', '789');
      // updateDoc IS called, merging existing data
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
          displayName: updates.displayName, // new display name
          photoURL: mockUser.photoURL, // existing photoURL
          updatedAt: expect.any(Object) // Service uses new Date()
      });
    });

    it('should call only updateDoc if only non-auth fields are provided', async () => {
      const mockUser = { uid: '789', displayName: 'Old Name', photoURL: 'old_url' } as User;
      const updates = { bio: 'New Bio Only' };
      const mockDocRef = { id: 'mockDocRef' };
      const mockTimestamp = { seconds: 1743888071, nanoseconds: 516000000 };
      mockServerTimestamp.mockReturnValue(mockTimestamp);
      
      mockUpdateDoc.mockResolvedValue(undefined);
      mockDoc.mockReturnValue(mockDocRef);
      
      await updateUserProfile(mockUser, updates);

      expect(mockUpdateProfile).not.toHaveBeenCalled();
      expect(mockDoc).toHaveBeenCalledWith(mockFirestoreInstance, 'users', '789');
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
        bio: updates.bio,
        displayName: mockUser.displayName, // Uses existing
        photoURL: mockUser.photoURL,     // Uses existing
        updatedAt: expect.any(Object) // Service uses new Date()
      });
    });

    it('should throw error if updateProfile fails', async () => {
      const mockUser = { uid: '789' } as User;
      const updates = { displayName: 'Updated Name' };
      const error = new Error('Update profile error');
      
      mockUpdateProfile.mockRejectedValue(error);
      
      await expect(updateUserProfile(mockUser, updates)).rejects.toThrow('Update profile error');
      expect(mockUpdateDoc).not.toHaveBeenCalled(); // updateDoc shouldn't be called if updateProfile fails
    });
    
    // TODO: Add test case for updateDoc failure during update
  });
}); 