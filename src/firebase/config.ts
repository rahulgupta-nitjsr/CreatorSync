'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Check if required Firebase config values are present
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0 && typeof window !== 'undefined') {
  console.error(
    `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}`
  );
  console.error('Please check your .env.local file');
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Storage with a warning
const storage = getStorage(app);
if (typeof window !== 'undefined') {
  console.warn('Firebase Storage is initialized but not fully configured. File upload features will not work without setting up Storage in Firebase console.');
}

// Initialize Firebase services
const functions = getFunctions(app);

// Initialize Analytics conditionally (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  // Check if analytics is supported in the current environment
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Connect to emulators in development environment
const shouldUseEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
if (shouldUseEmulator && typeof window !== 'undefined') {
  import('./emulator-connect').then(({ connectToEmulators }) => {
    connectToEmulators();
  }).catch(error => {
    console.error('Failed to connect to Firebase emulators:', error);
  });
}

export { app, auth, db, storage, functions, analytics };
export const firestore = db; 