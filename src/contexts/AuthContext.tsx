import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  subscribeToAuthChanges, 
  signIn, 
  signUp, 
  logOut, 
  resetPassword,
  getUserProfile,
  updateUserProfile
} from '@/services/auth';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (data: any) => Promise<User>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user profile data when user changes
  const fetchUserProfile = async (currentUser: User) => {
    try {
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Refresh user profile data
  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  // Update user profile
  const handleUpdateProfile = async (data: any) => {
    if (!user) {
      throw new Error('No user is signed in');
    }
    
    await updateUserProfile(user.uid, data);
    await refreshUserProfile();
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Value to provide in the context
  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn: (email, password) => signIn(email, password),
    signUp: (data) => signUp(data),
    logOut: async () => {
      await logOut();
      setUser(null);
      setUserProfile(null);
    },
    resetPassword: (email) => resetPassword(email),
    updateProfile: handleUpdateProfile,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 