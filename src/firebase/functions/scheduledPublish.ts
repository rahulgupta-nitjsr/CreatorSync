import * as functions from 'firebase-functions';
import { firestore, auth as adminAuth } from '../admin'; // Adjust path as necessary
import { Timestamp } from 'firebase-admin/firestore';

// Define the schedule (e.g., every 5 minutes)
// Use a cron expression: https://firebase.google.com/docs/functions/schedule-functions#cron-syntax
const SCHEDULE = 'every 5 minutes'; // Or '*/5 * * * *'

export const scheduledPublisher = functions.pubsub.schedule(SCHEDULE).onRun(async (context) => {
    console.log('Running scheduledPublisher function...');
    const now = Timestamp.now();

    try {
        // Query for all scheduled content across all users that is due
        const querySnapshot = await firestore.collectionGroup('content')
            .where('status', '==', 'scheduled')
            .where('scheduledDate', '<=', now)
            .get();

        if (querySnapshot.empty) {
            console.log('No scheduled content found to publish.');
            return null;
        }

        console.log(`Found ${querySnapshot.size} scheduled content items to publish.`);

        const publishPromises: Promise<void>[] = [];

        querySnapshot.forEach(doc => {
            const contentId = doc.id;
            const contentData = doc.data();
            const userId = contentData.userId;

            if (!userId) {
                console.error(`Missing userId for content ${contentId}. Skipping.`);
                return; // Skip this document
            }

            console.log(`Processing content ${contentId} for user ${userId}`);

            // --- Placeholder for Actual Publishing Logic ---
            // In a real scenario, you would trigger the actual cross-platform publishing here.
            // This could involve: 
            // 1. Calling platform-specific API wrappers.
            // 2. Adding a task to a Cloud Tasks queue for robust execution.
            // 3. Calling another Cloud Function dedicated to publishing.
            // For now, we'll just update the status directly in Firestore.
            const publishTask = doc.ref.update({
                status: 'published', // Or 'publishing' if triggering an async process
                publishDate: now,     // Record actual publish time
                updatedAt: now
            }).then(() => {
                console.log(`Successfully updated status for content ${contentId} to published.`);
            }).catch(error => {
                console.error(`Failed to update status for content ${contentId}:`, error);
                // Optionally, update status to 'failed' or implement retry logic
                return doc.ref.update({ status: 'publish_failed', error: error.message || 'Scheduled publishing failed', updatedAt: Timestamp.now() });
            });
            // --- End Placeholder ---

            publishPromises.push(publishTask);
        });

        await Promise.all(publishPromises);
        console.log('Finished processing scheduled content.');
        return null;

    } catch (error) {
        console.error('Error running scheduledPublisher:', error);
        // Consider adding monitoring/alerting here
        return null;
    }
}); 