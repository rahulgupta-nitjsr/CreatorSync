import { renderHook, act, waitFor } from '@testing-library/react';
import { User } from 'firebase/auth';
import { useAuth, UserProfile } from '@/hooks/useAuth'; // Adjust the import path as necessary
import * as AuthService from '@/services/auth'; // Import service to mock functions
import { auth, db } from '@/firebase/config'; // Need to mock these
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, DocumentSnapshot } from 'firebase/firestore';

// Create a mock for the useAuth hook
const mockUseAuth = {
  loading: true,
  user: null,
  profile: null,
  error: null,
  isAuthenticated: false,
  signIn: jest.fn(),
  signOut: jest.fn(),
  register: jest.fn(),
  resetPassword: jest.fn(),
  updateProfile: jest.fn()
};

// Mock the actual hook implementation
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

// Mock the AuthService functions
jest.mock('@/services/auth', () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChangedWrapper: jest.fn(), // Mock the wrapper used by the hook
}));

// Mock the Firebase config
jest.mock('@/firebase/config', () => ({
  auth: jest.fn(), // Mock auth instance
  db: jest.fn(),   // Mock db instance
}));

// Re-add explicit mocks within the test file
jest.mock('firebase/auth', () => ({
  // Make sure all functions used by the hook are mocked here
  // We primarily need onAuthStateChanged for this test suite
  onAuthStateChanged: jest.fn(),
  // Add other auth functions if needed by useAuth, e.g.:
  // getAuth: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  // Make sure all functions used by the hook are mocked here
  // We primarily need doc and onSnapshot for this test suite
  doc: jest.fn(),
  onSnapshot: jest.fn(),
  // Add other firestore functions if needed by useAuth, e.g.:
  // getFirestore: jest.fn(),
  // serverTimestamp: jest.fn(),
}));

// --- Mocks Setup ---
const mockSignIn = AuthService.signIn as jest.Mock;
const mockSignUp = AuthService.signUp as jest.Mock;
const mockSignOut = AuthService.signOut as jest.Mock;
const mockOnAuthStateChangedWrapper = AuthService.onAuthStateChangedWrapper as jest.Mock;
const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
const mockDoc = doc as jest.Mock;
const mockOnSnapshot = onSnapshot as jest.Mock;

// --- Helper Variables for Simulation ---
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
  // Add other necessary User properties with mock values
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
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
    // Add other required fields from UserProfile interface
    createdAt: new Date(),
    updatedAt: new Date(),
    platforms: {},
    settings: { theme: 'light', notifications: true },
} as UserProfile;

describe('Hook: useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ ...mockUseAuth });
    authCallback = null;
    authErrorCallbackGlobal = null;
    profileCallback = null;
    profileErrorCallback = null;
    mockAuthUnsubscribe = jest.fn();
    mockProfileUnsubscribe = jest.fn();

    // Configure the *imported* mock functions directly
    // These are the mocks provided by jest.mock()
    (onAuthStateChanged as jest.Mock).mockImplementation((authInstance, next, error) => {
      authCallback = next; // Capture the callback passed by the hook
      authErrorCallbackGlobal = error; // Capture error callback
      return mockAuthUnsubscribe; // Return the mock unsubscribe function
    });

    (doc as jest.Mock).mockImplementation((dbInstance, collectionPath, docId) => {
      // Return a simple object identifiable in tests if needed
      return { path: `${collectionPath}/${docId}` };
    });

    (onSnapshot as jest.Mock).mockImplementation((docRef, onNext, onError) => {
      profileCallback = onNext; // Capture the profile callback
      profileErrorCallback = onError; // Capture the profile error callback
      return mockProfileUnsubscribe; // Return mock profile unsubscribe
    });
  });

  it('should initialize with loading state and null user/profile', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    // Check if the *explicitly mocked* onAuthStateChanged was called
    expect(onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(onAuthStateChanged).toHaveBeenCalledWith(auth, expect.any(Function), expect.any(Function));
  });

  it('should update user, setup profile listener, and remain loading when auth state changes (user logs in)', async () => {
    const { result } = renderHook(() => useAuth());
    // Ensure callback was captured by the mock implementation
    expect(authCallback).not.toBeNull();

    await act(async () => {
      if (authCallback) await authCallback(mockUser);
    });

    // Check intermediate state
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.profile).toBeNull();
    // Check if the *mocked* doc and onSnapshot were called correctly
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(db, 'users', mockUser.uid);
    expect(onSnapshot).toHaveBeenCalledTimes(1);
    // Check the arguments passed to the mocked onSnapshot
    expect(onSnapshot).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${mockUser.uid}` }), // Check if the mock doc object was passed
        expect.any(Function), // The profile callback
        expect.any(Function)  // The profile error callback
    );
    expect(result.current.loading).toBe(true); // Still true before profile arrives
    expect(result.current.error).toBeNull();
  });

  it('should update profile and set loading to false when profile snapshot arrives', async () => {
    const { result } = renderHook(() => useAuth());

    // 1. Simulate auth change
    await act(async () => { if (authCallback) await authCallback(mockUser); });
    // Ensure profile callback was captured by the mock implementation
    expect(profileCallback).not.toBeNull();

    // 2. Simulate profile snapshot arriving
    const mockSnapshot = { exists: () => true, data: () => mockUserProfile } as Partial<DocumentSnapshot>;
    act(() => { if (profileCallback) profileCallback(mockSnapshot); });

    // Assert final state after waiting for updates
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toEqual(mockUserProfile);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it('should set profile to null and loading to false if profile document does not exist', async () => {
    const { result } = renderHook(() => useAuth());

    // 1. Simulate auth change
    await act(async () => { if (authCallback) await authCallback(mockUser); });
    expect(profileCallback).not.toBeNull();

    // 2. Simulate profile snapshot arriving (but doc doesn't exist)
    const mockSnapshot = { exists: () => false, data: () => undefined } as Partial<DocumentSnapshot>;
    act(() => { if (profileCallback) profileCallback(mockSnapshot); });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toBeNull();
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it('should set error and loading to false if profile snapshot errors', async () => {
    const { result } = renderHook(() => useAuth());
    const profileError = new Error('Firestore permission denied');

    // 1. Simulate auth change
    await act(async () => { if (authCallback) await authCallback(mockUser); });
    expect(profileErrorCallback).not.toBeNull();

    // 2. Simulate profile snapshot error
     act(() => { if (profileErrorCallback) profileErrorCallback(profileError); });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toEqual(profileError);
    expect(result.current.profile).toBeNull();
    expect(result.current.user).toEqual(mockUser);
  });

  it('should reset user/profile, loading to false when auth state changes to null (logout)', async () => {
    const { result } = renderHook(() => useAuth());

    // 1. Simulate login and profile load completely
    await act(async () => { if (authCallback) await authCallback(mockUser); });
    const mockSnapshot = { exists: () => true, data: () => mockUserProfile } as Partial<DocumentSnapshot>;
    act(() => { if (profileCallback) profileCallback(mockSnapshot); });
    await waitFor(() => expect(result.current.loading).toBe(false));

    // 2. Simulate logout
    await act(async () => { if (authCallback) await authCallback(null); });

    // Assert state after logout
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    // Should be false immediately after logout callback simulation
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    // Check that profile listener was unsubscribed (important on logout)
    expect(mockProfileUnsubscribe).toHaveBeenCalledTimes(1);
  });

 it('should clean up auth listener on unmount', async () => {
    const { unmount } = renderHook(() => useAuth());

    // Ensure listener was set up
    expect(onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(mockAuthUnsubscribe).not.toHaveBeenCalled(); // Unsubscribe fn returned by mock

    unmount();

    // Auth unsubscribe should be called via the useEffect cleanup
    expect(mockAuthUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should handle auth state change error', async () => {
    const { result } = renderHook(() => useAuth());
    const authError = new Error('Auth network error');

    // Check error callback was captured by the mock implementation
    expect(authErrorCallbackGlobal).not.toBeNull();

    // Simulate the error callback being called
    act(() => { if(authErrorCallbackGlobal) authErrorCallbackGlobal(authError); });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toEqual(authError);
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
}); 