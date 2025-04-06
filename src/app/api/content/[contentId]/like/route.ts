import { NextRequest, NextResponse } from 'next/server';
import { firestoreAdmin } from '@/firebase/config.server';
import { FieldValue } from 'firebase-admin/firestore'; // Import FieldValue for increment

// NOTE: We don't necessarily need user authentication for a simple 'like' increment,
// but it could be added to prevent abuse or track who liked what.
// For now, we'll skip auth to keep it simple.

/**
 * POST handler to increment the like count for a content item.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { contentId: string } }
) {
  const contentId = params.contentId;

  if (!contentId) {
    return NextResponse.json({ error: 'Missing content ID' }, { status: 400 });
  }

  try {
    if (!firestoreAdmin) {
      throw new Error('Firebase Admin Firestore not initialized.');
    }

    const contentRef = firestoreAdmin.collection('creatorContent').doc(contentId);

    // Atomically increment the 'likes' field
    await contentRef.update({
      likes: FieldValue.increment(1),
      // Optionally update updatedAt as well
      // updatedAt: FieldValue.serverTimestamp()
    });

    console.log(`Incremented likes for content ${contentId}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    // Check if the error is because the document doesn't exist
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) { // Firestore NOT_FOUND error code
        console.warn(`Content document not found during like increment: ${contentId}`);
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    
    console.error(`Error incrementing likes for content ${contentId}:`, error);
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
} 