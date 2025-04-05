import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import firebase from './config';

/**
 * Connect to Firebase emulators when in development or test environment
 * This should be called after initializing the Firebase app
 */
export const connectToEmulators = () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('Not connecting to emulators in production');
    return;
  }
  
  try {
    // Connect to Auth Emulator
    const auth = getAuth();
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('Connected to Auth Emulator');

    // Connect to Firestore Emulator
    const firestore = getFirestore();
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    console.log('Connected to Firestore Emulator');

    // Connect to Storage Emulator
    const storage = getStorage();
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('Connected to Storage Emulator');

    // Connect to Functions Emulator if enabled
    if (process.env.FUNCTIONS_EMULATOR === 'true') {
      const functions = getFunctions();
      connectFunctionsEmulator(functions, 'localhost', 5001);
      console.log('Connected to Functions Emulator');
    }

    console.log('Firebase Emulator Suite connected successfully');
  } catch (error) {
    console.error('Error connecting to Firebase Emulators:', error);
  }
};

export default connectToEmulators; 