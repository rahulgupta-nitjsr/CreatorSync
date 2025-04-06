import { renderHook, act, waitFor } from '@testing-library/react';
import { User } from 'firebase/auth';
// Import the actual hook implementation
import { useAuth, UserProfile } from '@/hooks/useAuth';
// Remove AuthService import - not directly used by useAuth hook
// import * as AuthService from '@/services/auth';
import { auth, db } from '@/firebase/config'; // Need to mock these instances if used directly, but functions are mocked below
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, DocumentSnapshot, Unsubscribe } from 'firebase/firestore';

// --- Mock Firebase Modules ---
// Keep mocks for the specific functions used by the hook
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  // Mock getAuth as it's called by firebase/config.ts, imported by useAuth
  getAuth: jest.fn(() => ({
    // Provide a basic mock auth object structure if needed by the code under test
    // For useAuth, primarily onAuthStateChanged is critical, but getAuth needs to exist
    currentUser: null, // or a mock user if needed for initialization paths
    // Add other methods/properties if config.ts or hook uses them directly
  })),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  onSnapshot: jest.fn(),
  // Mock getFirestore as it's called by firebase/config.ts
  getFirestore: jest.fn(() => ({})
    // Provide mock firestore instance properties/methods if needed
  ), 
  // getFirestore: jest.fn(), // Mock getFirestore if needed
  // serverTimestamp: jest.fn(), // Mock serverTimestamp if needed
}));

// Mock the config only if necessary (e.g., if the hook uses auth/db instances directly for something other than the mocked functions)
// Usually mocking the functions (onAuthStateChanged, doc, onSnapshot) is sufficient.
// jest.mock('@/firebase/config', () => ({
//   auth: {}, // Provide mock auth instance properties if needed
//   db: {},   // Provide mock db instance properties if needed
// }));


// --- Mocks Setup ---
// Get mock functions directly from the mocked modules
const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock<Unsubscribe, [any, (user: User | null) => void, (error: Error) => void]>;
const mockDoc = doc as jest.Mock;
const mockOnSnapshot = onSnapshot as jest.Mock<Unsubscribe, [any, (snapshot: Partial<DocumentSnapshot>) => void, (error: Error) => void]>;

// --- Helper Variables for Simulation ---
// Capture callbacks passed TO the mocks BY the hook
let authCallback: ((user: User | null) => Promise<void> | void) | null = null;
let authErrorCallbackGlobal: ((error: Error) => void) | null = null;
let profileCallback: ((snapshot: Partial<DocumentSnapshot>) => void) | null = null;
let profileErrorCallback: ((error: Error) => void) | null = null;
let mockAuthUnsubscribe = jest.fn();
let mockProfileUnsubscribe = jest.fn();

// Mock User object
const mockUser: User = {
  uid: 'testUid123',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  isAnonymous: false,
  metadata: { creationTime: new Date().toISOString(), lastSignInTime: new Date().toISOString() },
  providerData: [],
  providerId: 'firebase',
  refreshToken: 'mockRefreshToken',
  tenantId: null,
  delete: jest.fn(),
  getIdToken: jest.fn(),
  getIdTokenResult: jest.fn(),
  reload: jest.fn(),
  toJSON: jest.fn(),
  phoneNumber: null,
  photoURL: null,
};

const mockUserProfile: UserProfile = {
    uid: 'testUid123',
    email: 'test@example.com',
    displayName: 'Test User Profile',
    createdAt: { toDate: () => new Date() }, // Simulate Firestore Timestamp
    updatedAt: { toDate: () => new Date() }, // Simulate Firestore Timestamp
    platforms: {},
    settings: { theme: 'light', notifications: true },
} as UserProfile;

// Mock Firestore DocumentSnapshot
const mockProfileSnapshotExists = {
    exists: jest.fn(() => true),
    data: jest.fn(() => mockUserProfile),
    id: mockUser.uid,
    ref: { path: `users/${mockUser.uid}` }
} as Partial<DocumentSnapshot>;

const mockProfileSnapshotDoesNotExist = {
    exists: jest.fn(() => false),
    data: jest.fn(() => undefined),
    id: mockUser.uid,
    ref: { path: `users/${mockUser.uid}` }
} as Partial<DocumentSnapshot>;

describe('Hook: useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset captured callbacks and mock functions
    authCallback = null;
    authErrorCallbackGlobal = null;
    profileCallback = null;
    profileErrorCallback = null;
    mockAuthUnsubscribe = jest.fn();
    mockProfileUnsubscribe = jest.fn();

    // --- Configure Mock Implementations ---
    mockOnAuthStateChanged.mockImplementation((authInstance, next, error) => {
      // Capture the callbacks passed *by the hook*
      authCallback = next;
      authErrorCallbackGlobal = error;
      // Return the mock unsubscribe function for auth changes
      return mockAuthUnsubscribe;
    });

    mockDoc.mockImplementation((dbInstance, collectionPath, docId) => {
      // Return a mock document reference object recognizable by the onSnapshot mock
      return { path: `${collectionPath}/${docId}`, _mock: true };
    });

    mockOnSnapshot.mockImplementation((docRef, onNext, onError) => {
      // Capture the callbacks passed *by the hook* for profile updates
      profileCallback = onNext;
      profileErrorCallback = onError;
      // Return the mock unsubscribe function for profile listener
      return mockProfileUnsubscribe;
    });
  });

  it('should initialize with loading state and null user/profile', () => {
    // Render the actual hook
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.loading).toBe(true); // Initial state should be loading
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);

    // Verify onAuthStateChanged was called by the hook's useEffect
    expect(mockOnAuthStateChanged).toHaveBeenCalledTimes(1);
    // Check if it was called with the mocked auth instance (or expected instance)
    // If @/firebase/config is not mocked, 'auth' will be the actual instance.
    // If it IS mocked, it'll be the mock object. Adjust assertion as needed.
    expect(mockOnAuthStateChanged).toHaveBeenCalledWith(auth, expect.any(Function), expect.any(Function));
  });

  it('should update user, setup profile listener, and remain loading when auth state changes (user logs in)', async () => {
    const { result } = renderHook(() => useAuth());

    // Ensure the auth callback was captured
    expect(authCallback).not.toBeNull();

    // Simulate user logging in by calling the captured callback
    await act(async () => {
      if (authCallback) {
        await authCallback(mockUser); // Pass the mock user object
      }
    });

    // Check intermediate state after auth changes but before profile snapshot
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.profile).toBeNull(); // Profile shouldn't be loaded yet
    expect(result.current.loading).toBe(true); // Still loading profile
    expect(result.current.error).toBeNull();

    // Verify profile listener setup
    expect(mockDoc).toHaveBeenCalledTimes(1);
    // Check if doc was called with the mocked db instance (or actual if not mocked)
    expect(mockDoc).toHaveBeenCalledWith(db, 'users', mockUser.uid);
    expect(mockOnSnapshot).toHaveBeenCalledTimes(1);
    // Check arguments passed to onSnapshot
    expect(mockOnSnapshot).toHaveBeenCalledWith(
      // Ensure the mock doc reference was passed
      expect.objectContaining({ path: `users/${mockUser.uid}`, _mock: true }),
      expect.any(Function), // The profile update callback
      expect.any(Function)  // The profile error callback
    );
    // Ensure the profile callback was captured
    expect(profileCallback).not.toBeNull();
  });

  it('should update profile and set loading to false when profile snapshot arrives', async () => {
    const { result } = renderHook(() => useAuth());

    // 1. Simulate auth change
    await act(async () => { if (authCallback) await authCallback(mockUser); });

    // Ensure profile callback was captured
    expect(profileCallback).not.toBeNull();

    // 2. Simulate profile snapshot arriving by calling the captured callback
    act(() => {
        if (profileCallback) {
            profileCallback(mockProfileSnapshotExists);
        }
    });

    // Assert final state after profile update
    // Use waitFor as the state update might be async within the hook
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.profile).toEqual(mockUserProfile); // Profile should be set
    expect(result.current.user).toEqual(mockUser); // User should remain
    expect(result.current.error).toBeNull();
  });

  it('should set profile to null and loading to false if profile document does not exist', async () => {
    const { result } = renderHook(() => useAuth());

    // 1. Simulate auth change
    await act(async () => { if (authCallback) await authCallback(mockUser); });
    expect(profileCallback).not.toBeNull();

    // 2. Simulate profile snapshot arriving but document doesn't exist
    act(() => {
        if (profileCallback) {
            profileCallback(mockProfileSnapshotDoesNotExist);
        }
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.profile).toBeNull(); // Profile should be null
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

   it('should handle error during profile fetch and set loading to false', async () => {
    const { result } = renderHook(() => useAuth());
    const profileError = new Error('Failed to fetch profile');

    // 1. Simulate auth change
    await act(async () => { if (authCallback) await authCallback(mockUser); });
    expect(profileErrorCallback).not.toBeNull(); // Ensure error callback was captured

    // 2. Simulate profile fetch error
    act(() => {
        if (profileErrorCallback) {
            profileErrorCallback(profileError);
        }
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.profile).toBeNull();
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toEqual(profileError); // Error state should be set
  });


  it('should set user and profile to null and loading to false when user logs out', async () => {
    const { result } = renderHook(() => useAuth());

    // 1. Simulate user initially logged in and profile loaded
    await act(async () => { if (authCallback) await authCallback(mockUser); });
    act(() => { if (profileCallback) profileCallback(mockProfileSnapshotExists); });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).not.toBeNull();
    expect(result.current.profile).not.toBeNull();

    // 2. Simulate user logging out
    await act(async () => {
      if (authCallback) {
        await authCallback(null); // Pass null to simulate logout
      }
    });

    // Assert final state after logout
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.loading).toBe(false); // Loading should be false after logout
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle auth state change error and set loading to false', async () => {
    const { result } = renderHook(() => useAuth());
    const authError = new Error('Auth listener error');

    expect(authErrorCallbackGlobal).not.toBeNull(); // Ensure error callback captured

    // Simulate auth error
    act(() => {
        if (authErrorCallbackGlobal) {
            authErrorCallbackGlobal(authError);
        }
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.error).toEqual(authError); // Error state should be set
  });

  it('should call unsubscribe functions on unmount', async () => {
    const { unmount } = renderHook(() => useAuth());

    // Simulate user logging in to ensure profile listener is set up
    await act(async () => { if (authCallback) await authCallback(mockUser); });
    expect(mockOnSnapshot).toHaveBeenCalledTimes(1); // Profile listener setup

    // Unmount the component
    unmount();

    // Verify unsubscribe functions were called
    expect(mockAuthUnsubscribe).toHaveBeenCalledTimes(1);
    // Profile unsubscribe should be called only if a user was logged in
    expect(mockProfileUnsubscribe).toHaveBeenCalledTimes(1);
  });

   it('should not call profile unsubscribe on unmount if user never logged in', () => {
    const { unmount } = renderHook(() => useAuth());

    // User never logs in, so profile listener is never set up
    expect(mockOnSnapshot).not.toHaveBeenCalled();

    // Unmount the component
    unmount();

    // Verify only auth unsubscribe was called
    expect(mockAuthUnsubscribe).toHaveBeenCalledTimes(1);
    expect(mockProfileUnsubscribe).not.toHaveBeenCalled();
  });

});
// Remove the old mock setup that was mocking the hook itself
// // Create a mock for the useAuth hook
// const mockUseAuth = { ... };
// // Mock the actual hook implementation
// jest.mock('@/hooks/useAuth', () => ({ useAuth: jest.fn() }));
// // Mock the AuthService functions
// jest.mock('@/services/auth', () => ({ ... }));
// // Mock the Firebase config
// jest.mock('@/firebase/config', () => ({ ... }));

// Mock the actual hook implementation
// jest.mock('@/hooks/useAuth', () => ({
//   useAuth: jest.fn()
// }));

// Mock the AuthService functions
// jest.mock('@/services/auth', () => ({
//   signIn: jest.fn(),
//   signUp: jest.fn(),
//   signOut: jest.fn(),
//   onAuthStateChangedWrapper: jest.fn(), // Mock the wrapper used by the hook
// }));

// Mock the Firebase config
// jest.mock('@/firebase/config', () => ({
//   auth: jest.fn(), // Mock auth instance
//   db: jest.fn(),   // Mock db instance
// }));

// Re-add explicit mocks within the test file
// jest.mock('firebase/auth', () => ({
//   // Make sure all functions used by the hook are mocked here
//   // We primarily need onAuthStateChanged for this test suite
//   onAuthStateChanged: jest.fn(),
//   // Add other auth functions if needed by useAuth, e.g.:
//   // getAuth: jest.fn(),
// }));
// jest.mock('firebase/firestore', () => ({
//   // Make sure all functions used by the hook are mocked here
//   // We primarily need doc and onSnapshot for this test suite
//   doc: jest.fn(),
//   onSnapshot: jest.fn(),
//   // Add other firestore functions if needed by useAuth, e.g.:
//   // getFirestore: jest.fn(),
//   // serverTimestamp: jest.fn(),
// }));

// --- Mocks Setup ---
// const mockSignIn = AuthService.signIn as jest.Mock;
// const mockSignUp = AuthService.signUp as jest.Mock;
// const mockSignOut = AuthService.signOut as jest.Mock;
// const mockOnAuthStateChangedWrapper = AuthService.onAuthStateChangedWrapper as jest.Mock;
// const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
// const mockDoc = doc as jest.Mock;
// const mockOnSnapshot = onSnapshot as jest.Mock;

// --- Helper Variables for Simulation ---
// let authCallback: ((user: User | null) => Promise<void> | void) | null = null;
// let authErrorCallbackGlobal: ((error: Error) => void) | null = null;
// let profileCallback: ((snapshot: Partial<DocumentSnapshot>) => void) | null = null;
// let profileErrorCallback: ((error: Error) => void) | null = null;
// let mockAuthUnsubscribe = jest.fn();
// let mockProfileUnsubscribe = jest.fn();

// Mock User object
// const mockUser: User = {
//   uid: 'testUid123',
//   email: 'test@example.com',
//   displayName: 'Test User',
//   // Add other necessary User properties with mock values
//   emailVerified: true,
//   isAnonymous: false,
//   metadata: {},
//   providerData: [],
//   providerId: 'firebase',
//   refreshToken: 'mockRefreshToken',
//   tenantId: null,
//   delete: jest.fn(),
//   getIdToken: jest.fn(),
//   getIdTokenResult: jest.fn(),
//   reload: jest.fn(),
//   toJSON: jest.fn(),
//   phoneNumber: null,
//   photoURL: null,
// };

// const mockUserProfile: UserProfile = {
//     uid: 'testUid123',
//     email: 'test@example.com',
//     displayName: 'Test User Profile',
//     // Add other required fields from UserProfile interface
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     platforms: {},
//     settings: { theme: 'light', notifications: true },
// } as UserProfile; 