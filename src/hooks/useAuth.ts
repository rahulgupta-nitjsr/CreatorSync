'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

// Define user profile type
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  platforms: Record<string, any>;
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

/**
 * Custom hook for authentication state and user profile
 * @returns Authentication state and user profile
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authUser) => {
        if (authUser) {
          setUser(authUser);
          
          try {
            // Subscribe to user profile document
            const userRef = doc(db, 'users', authUser.uid);
            const unsubscribeProfile = onSnapshot(
              userRef,
              (doc) => {
                if (doc.exists()) {
                  setProfile(doc.data() as UserProfile);
                } else {
                  setProfile(null);
                  console.error('User document does not exist');
                }
                setLoading(false);
              },
              (err) => {
                console.error('Error fetching user profile', err);
                setError(err);
                setLoading(false);
              }
            );
            
            // Return a cleanup function that unsubscribes from both listeners
            return () => {
              unsubscribeProfile();
            };
          } catch (err: any) {
            console.error('Error setting up profile listener', err);
            setError(err);
            setLoading(false);
          }
        } else {
          // No user is signed in
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Auth state change error', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      unsubscribeAuth();
    };
  }, []);

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user
  };
}; 