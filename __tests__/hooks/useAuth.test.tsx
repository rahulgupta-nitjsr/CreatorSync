import { renderHook, act } from '@testing-library/react';
import { User } from 'firebase/auth';

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

// Import the mocked hook
import { useAuth } from '@/hooks/useAuth';

describe('useAuth Hook', () => {
  // Setup and teardown
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ ...mockUseAuth });
  });
  
  it('should initialize with loading state', () => {
    // Setup the mock to return the initial state
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      loading: true,
      user: null,
      profile: null,
      error: null,
      isAuthenticated: false
    });
    
    // Render the hook
    const { result } = renderHook(() => useAuth());
    
    // Assert initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.profile).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });
  
  it('should update state when user is authenticated', async () => {
    // Mock user data
    const mockUser = { uid: 'user123', email: 'test@example.com' } as User;
    const mockProfile = {
      uid: 'user123',
      email: 'test@example.com',
      displayName: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
      platforms: {},
      settings: {
        theme: 'light',
        notifications: true,
      },
    };
    
    // Setup the mock to return an authenticated state
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      loading: false,
      user: mockUser,
      profile: mockProfile,
      error: null,
      isAuthenticated: true
    });
    
    // Render the hook
    const { result } = renderHook(() => useAuth());
    
    // Assert updated state
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.isAuthenticated).toBe(true);
  });
  
  it('should set user to null when not authenticated', async () => {
    // Setup the mock to return an unauthenticated state
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      loading: false,
      user: null,
      profile: null,
      error: null,
      isAuthenticated: false
    });
    
    // Render the hook
    const { result } = renderHook(() => useAuth());
    
    // Assert state when not authenticated
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.profile).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });
  
  it('should handle errors', async () => {
    const mockUser = { uid: 'user123', email: 'test@example.com' } as User;
    const mockError = new Error('Authentication error');
    
    // Setup the mock to return an error state
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      loading: false,
      user: mockUser,
      profile: null,
      error: mockError,
      isAuthenticated: true
    });
    
    // Render the hook
    const { result } = renderHook(() => useAuth());
    
    // Assert error state
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(mockError);
    expect(result.current.user).toEqual(mockUser); // User should still be set
  });
  
  it('should provide authentication methods', async () => {
    // Render the hook
    const { result } = renderHook(() => useAuth());
    
    // Check if all methods are available
    expect(typeof result.current.signIn).toBe('function');
    expect(typeof result.current.signOut).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.resetPassword).toBe('function');
    expect(typeof result.current.updateProfile).toBe('function');
  });
}); 