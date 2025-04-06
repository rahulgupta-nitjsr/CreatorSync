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
import { getUserPlatformConnections } from '@/services/firestore.service';
import { PlatformConnection } from '@/models/platformConnection';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  platformConnections: PlatformConnection[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (data: any) => Promise<User>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  refreshPlatformConnections: () => Promise<void>;
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
  const [platformConnections, setPlatformConnections] = useState<PlatformConnection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  const fetchPlatformConnections = async (currentUser: User) => {
    if (!currentUser) {
      setPlatformConnections([]);
      return;
    }
    try {
      console.log('Fetching platform connections for:', currentUser.uid);
      const connections = await getUserPlatformConnections(currentUser.uid);
      setPlatformConnections(connections);
      console.log('Platform connections fetched:', connections);
    } catch (error) {
      console.error('Error fetching platform connections:', error);
      setPlatformConnections([]);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  const refreshPlatformConnections = async () => {
    if (user) {
      await fetchPlatformConnections(user);
    }
  };

  const handleUpdateProfile = async (data: any) => {
    if (!user) {
      throw new Error('No user is signed in');
    }
    
    await updateUserProfile(user.uid, data);
    await refreshUserProfile();
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        console.log('Auth state changed: User logged in', currentUser.uid);
        await Promise.all([ 
          fetchUserProfile(currentUser),
          fetchPlatformConnections(currentUser)
        ]);
      } else {
        console.log('Auth state changed: User logged out');
        setUserProfile(null);
        setPlatformConnections([]);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    platformConnections,
    loading,
    signIn: (email, password) => signIn(email, password),
    signUp: (data) => signUp(data),
    logOut: async () => {
      await logOut();
    },
    resetPassword: (email) => resetPassword(email),
    updateProfile: handleUpdateProfile,
    refreshUserProfile,
    refreshPlatformConnections
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 