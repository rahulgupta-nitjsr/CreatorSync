// This is the main entry point for your Firebase Cloud Functions.

// Import and re-export functions from their individual files.
import { scheduledPublisher } from './scheduledPublish';

// Export the functions for deployment.
// The name used here (e.g., 'publishScheduler') will be the deployed function name.
export { scheduledPublisher as publishScheduler };

// You can add more functions here as needed:
// import { anotherFunction } from './anotherFunction';
// export { anotherFunction }; 