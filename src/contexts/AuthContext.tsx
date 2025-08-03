import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  User,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  getIdToken as firebaseGetIdToken,
  getAuth, 
  onAuthStateChanged, 
  User as FirebaseUser, 
  updateProfile as updateProfileService 
} from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import {
  AuthServiceError,
  handleAuthError,
  signIn,
  signUp,
  logOut,
  resetPassword,
  updateUserProfile,
  getUserProfile,
  subscribeToAuthChanges
} from '@/services/auth';
import { getUserPlatformConnections } from '@/services/firestore';
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
        const profile = await getUserProfile(currentUser);
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
    
    await updateUserProfile(user, data);
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
    signIn: async (email: string, password: string) => {
      const userCredential = await signIn(email, password);
      return userCredential.user;
    },
    signUp: async (data: any) => {
      const { email, password, displayName } = data;
      const userCredential = await signUp(email, password, displayName);
      return userCredential.user;
    },
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