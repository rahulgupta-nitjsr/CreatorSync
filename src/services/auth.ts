import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  User,
  UserCredential,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/config';

export interface IUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
  username?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignUpData {
  email: string;
  password: string;
  displayName: string;
}

export interface IUpdateProfileData {
  displayName?: string;
  photoURL?: string;
  bio?: string;
  username?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

/**
 * Create a new user with email and password
 * @param {ISignUpData} data - User signup data
 * @returns {Promise<UserCredential>} Firebase user credential
 */
export const signUp = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
  try {
    // Remove temporary console log
    // console.log(`[signUp Service] Calling createUser with:`, { email, password }); 
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Store additional user data in Firestore
    const userData: IUserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(firestore, 'users', user.uid), userData);
    
    return userCredential;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<UserCredential>} Firebase user credential
 */
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Send a password reset email
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Get the current user's profile data from Firestore
 * @param {User} user - Firebase User
 * @returns {Promise<IUserData | null>} User data
 */
export const getUserProfile = async (user: User): Promise<IUserData | null> => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as IUserData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Update user profile data
 * @param {User} user - Firebase User
 * @param {IUpdateProfileData} data - Profile data to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (
  user: User,
  data: IUpdateProfileData
): Promise<void> => {
  try {
    const { displayName, photoURL, ...firestoreData } = data;
    
    // Update auth profile if display name or photo URL is provided
    if (displayName || photoURL) {
      await updateProfile(user, {
        displayName: displayName || user.displayName,
        photoURL: photoURL || user.photoURL
      });
    }
    
    // Update Firestore data
    await updateDoc(doc(firestore, 'users', user.uid), {
      ...firestoreData,
      displayName: displayName || user.displayName,
      photoURL: photoURL || user.photoURL,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Update user email
 * @param {User} user - Firebase User
 * @param {string} newEmail - New email
 * @returns {Promise<void>}
 */
export const updateUserEmail = async (user: User, newEmail: string): Promise<void> => {
  try {
    await updateEmail(user, newEmail);
    
    // Update email in Firestore
    await updateDoc(doc(firestore, 'users', user.uid), {
      email: newEmail,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user email:', error);
    throw error;
  }
};

/**
 * Update user password
 * @param {User} user - Firebase User
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const updateUserPassword = async (user: User, newPassword: string): Promise<void> => {
  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};

/**
 * Listen for auth state changes
 * @param {(user: User | null) => void} callback - Callback function to handle auth state changes
 * @returns {() => void} Unsubscribe function
 */
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
}; 