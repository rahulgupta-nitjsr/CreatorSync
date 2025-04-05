'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { useAuth, UserProfile } from '@/hooks/useAuth';

// Define the auth context type
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  isAuthenticated: false
});

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider component that wraps the application to provide authentication state
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use our custom hook to get auth state
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 * @returns Auth context value
 */
export const useAuthContext = () => useContext(AuthContext);

// Export the auth context for direct use
export default AuthContext; 