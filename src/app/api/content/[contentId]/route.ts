import { NextRequest, NextResponse } from 'next/server';
import { authAdmin, firestoreAdmin, storageAdmin } from '@/firebase/config.server';
import { getFilePathFromURL } from '@/services/storage'; // Reuse utility if it exists

/**
 * DELETE handler to remove content.
 * Deletes the Firestore document and the associated file in Storage.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { contentId: string } }
) {
  const contentId = params.contentId;

  // --- 1. Authenticate User (using Admin SDK) ---
  const authHeader = request.headers.get('Authorization');
  let userId: string | null = null;
  if (authHeader?.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];
    try {
      if (!authAdmin) throw new Error('Firebase Admin Auth not initialized.');
      const decodedToken = await authAdmin.verifyIdToken(idToken);
      userId = decodedToken.uid;
    } catch (authError) {
      console.error('Error verifying ID token for delete:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // --- 2. Delete Firestore Document and Get Media URL ---
  let mediaUrl: string | null = null;
  const contentRef = firestoreAdmin.collection('creatorContent').doc(contentId);
  try {
    if (!firestoreAdmin) throw new Error('Firebase Admin Firestore not initialized.');
    
    const docSnap = await contentRef.get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    
    const contentData = docSnap.data();
    // Verify ownership
    if (contentData?.userId !== userId) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    mediaUrl = contentData?.mediaUrl || null;

    // Delete the Firestore document
    await contentRef.delete();
    console.log(`Firestore document ${contentId} deleted successfully.`);

  } catch (error) {
    console.error(`Error deleting Firestore document ${contentId}:`, error);
    return NextResponse.json({ error: 'Failed to delete content metadata' }, { status: 500 });
  }

  // --- 3. Delete Storage File (if mediaUrl exists) ---
  if (mediaUrl) {
    try {
      if (!storageAdmin) throw new Error('Firebase Admin Storage not initialized.');
      // Assuming getFilePathFromURL can extract the path correctly
      const filePath = getFilePathFromURL(mediaUrl);
      if (filePath) {
        const fileRef = storageAdmin.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET).file(filePath);
        await fileRef.delete();
        console.log(`Storage file ${filePath} deleted successfully.`);
      } else {
        console.warn(`Could not extract file path from mediaUrl: ${mediaUrl}`);
      }
    } catch (error: any) {
      // Log storage deletion error but don't necessarily fail the whole request
      // if Firestore delete succeeded, as storage path might be invalid.
      if (error.code === 404) {
           console.warn(`Storage file not found for ${mediaUrl}, continuing.`);
      } else {
           console.error(`Error deleting storage file for ${mediaUrl}:`, error);
           // Optionally return a partial success message or specific error
           // return NextResponse.json({ error: 'Failed to delete associated media file', success: 'metadata deleted' }, { status: 500 });
      }
    }
  }

  // --- 4. Return Success ---
  return NextResponse.json({ success: true, message: 'Content deleted successfully.' });
} 