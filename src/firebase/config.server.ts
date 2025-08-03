import * as admin from 'firebase-admin';

// Environment variables for Firebase Admin SDK
// These should be set securely in your deployment environment
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const databaseURL = process.env.FIREBASE_DATABASE_URL; // e.g., https://your-project-id.firebaseio.com

let firestoreAdmin: admin.firestore.Firestore;
let authAdmin: admin.auth.Auth;
let storageAdmin: admin.storage.Storage;

if (!admin.apps.length) {
  if (!serviceAccountKey) {
    console.warn(
      'Firebase Admin SDK Warning: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. ' +
      'Server-side Firebase features requiring admin privileges (like writing to Firestore from API routes, verifying tokens securely) will not work. ' +
      'Ensure this is set in your production environment.'
    );
  } else if (!databaseURL) {
      console.warn(
          'Firebase Admin SDK Warning: FIREBASE_DATABASE_URL environment variable is not set. Some admin features might require it.'
      );
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey || '{}');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: databaseURL,
      // Add storageBucket if interacting with Storage via Admin SDK
      // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET 
    });

    console.log('Firebase Admin SDK initialized successfully.');
    firestoreAdmin = admin.firestore();
    authAdmin = admin.auth();
    storageAdmin = admin.storage(); 

  } catch (error: any) {
    console.error(
      'Firebase Admin SDK Initialization Error: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY or initialize app. ' +
      'Ensure the environment variable contains valid JSON credentials. ', error.message
    );
    // Set admin instances to null or throw error depending on desired behavior
    // For now, we let them be potentially undefined which will cause errors downstream if used.
  }
} else {
  // Use the already initialized app
  firestoreAdmin = admin.firestore();
  authAdmin = admin.auth();
  storageAdmin = admin.storage();
}

// Export the initialized admin services
// Note: Check if `firestoreAdmin` etc. are defined before using them in API routes
// to handle cases where initialization failed due to missing env vars.
export { firestoreAdmin, authAdmin, storageAdmin };
export const auth = authAdmin; 