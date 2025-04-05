'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

/**
 * Firebase authentication service
 * Handles user authentication, registration, and profile management
 */

/**
 * Register a new user with email and password
 * @param email User's email
 * @param password User's password
 * @param displayName User's display name
 * @returns UserCredential from Firebase
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> => {
  // Create the user with email and password
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update the user's profile with display name
  await updateProfile(user, { displayName });
  
  // Send email verification
  await sendEmailVerification(user);
  
  // Create a user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email,
    displayName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    platforms: {},
    settings: {
      theme: 'light',
      notifications: true
    }
  });
  
  return userCredential;
};

/**
 * Sign in an existing user with email and password
 * @param email User's email
 * @param password User's password
 * @returns UserCredential from Firebase
 */
export const signIn = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

/**
 * Send a password reset email to the user
 * @param email User's email
 */
export const resetPassword = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

/**
 * Update a user's profile information
 * @param user The user object
 * @param profile Object containing profile data to update
 */
export const updateUserProfile = async (
  user: User,
  profile: { displayName?: string; photoURL?: string }
): Promise<void> => {
  // Update auth profile
  await updateProfile(user, profile);
  
  // Update Firestore document
  const userRef = doc(db, 'users', user.uid);
  await setDoc(
    userRef,
    {
      displayName: profile.displayName,
      photoURL: profile.photoURL,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
};

// Register a new user
export const register = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's profile with the display name
    await updateProfile(user, { displayName });
    
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get the current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
}; 