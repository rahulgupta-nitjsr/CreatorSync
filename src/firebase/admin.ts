import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  try {
    // Attempt to initialize with default credentials (useful for deployed environments)
    admin.initializeApp();
    console.log('Firebase Admin SDK initialized with default credentials.');
  } catch (e: any) {
    console.warn(
      'Default Admin SDK initialization failed (maybe missing GOOGLE_APPLICATION_CREDENTIALS?):',
      e.message
    );
    // Fallback or alternative initialization if needed, e.g., using service account key file path
    // This part might need adjustment based on your local/CI environment setup
    // try {
    //   const serviceAccount = require('/path/to/your/serviceAccountKey.json'); // !!! Replace with actual path or use env var !!!
    //   admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount)
    //   });
    //   console.log('Firebase Admin SDK initialized with service account.');
    // } catch (fallbackError: any) {
    //   console.error('Fallback Admin SDK initialization also failed:', fallbackError);
    //   // Decide how to handle failure - maybe throw an error or log severity
    // }
  }
} else {
  console.log('Firebase Admin SDK already initialized.');
}

export const auth = admin.auth();
export const firestore = admin.firestore();
export const storage = admin.storage();

// Optionally configure Firestore settings
firestore.settings({
  ignoreUndefinedProperties: true, // Recommended for cleaner data handling
});

export default admin; 