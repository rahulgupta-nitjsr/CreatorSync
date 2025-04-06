import { NextRequest, NextResponse } from 'next/server';
// Use server-side admin SDK imports
import { authAdmin, firestoreAdmin } from '@/firebase/config.server'; 

/**
 * POST handler to disconnect a platform for the current user.
 * Deletes the connection document from Firestore.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform;

  // TODO: Add platform validation if needed

  // --- 1. Get CreatorSync User ID (using Admin SDK) ---
  const authHeader = request.headers.get('Authorization');
  let userId: string | null = null;
  if (authHeader?.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];
    try {
      if (!authAdmin) throw new Error('Firebase Admin Auth not initialized.');
      const decodedToken = await authAdmin.verifyIdToken(idToken);
      userId = decodedToken.uid;
    } catch (authError) {
      console.error('Error verifying ID token for disconnect:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // --- 2. Delete Firestore Document & Prepare for Revocation ---
  let accessToken: string | null = null;
  try {
    if (!firestoreAdmin) throw new Error('Firebase Admin Firestore not initialized.');
    const connectionRef = firestoreAdmin
      .collection('users').doc(userId!)
      .collection('platformConnections').doc(platform);
    
    // Fetch the document *before* deleting to get the access token
    const docSnap = await connectionRef.get();
    if (docSnap.exists) {
        accessToken = docSnap.data()?.accessToken || null;
    } else {
        console.warn(`Connection document not found for platform ${platform}, user ${userId}. Cannot revoke token.`);
        // Proceed to ensure it's deleted if somehow it exists partially
    }

    // Delete the Firestore document
    await connectionRef.delete();
    console.log(`Firestore document ${platform} deleted successfully for user ${userId}`);

  } catch (error) {
    console.error(`Error deleting Firestore document ${platform} for user ${userId}:`, error);
    return NextResponse.json({ error: 'Failed to delete connection metadata' }, { status: 500 });
  }

  // --- 3. Revoke Platform Token (Optional but Recommended) ---
  if (accessToken) {
      try {
          await revokePlatformToken(platform, accessToken);
          console.log(`Successfully revoked token for platform ${platform}`);
      } catch (revokeError) {
          console.error(`Failed to revoke token for platform ${platform}:`, revokeError);
          // Log the error but don't fail the disconnect request, as Firestore doc is deleted.
      }
  }

  return NextResponse.json({ success: true });
}

/**
 * Placeholder function for revoking platform access token.
 * Needs specific implementation for each platform API.
 * @param platform The platform identifier (e.g., 'tiktok', 'instagram', 'x')
 * @param accessToken The valid access token to revoke.
 */
async function revokePlatformToken(platform: string, accessToken: string): Promise<void> {
  console.log(`TODO: Implement token revocation for ${platform} using token: ${accessToken.substring(0, 10)}...`);
  // Example structure:
  // let revocationUrl = '';
  // let method = 'POST';
  // let headers: HeadersInit = { /* May need Auth headers */ };
  // let body: any = { token: accessToken }; // Body might differ
  // switch (platform) {
  //     case 'tiktok': /* ... config ... */ break;
  //     case 'instagram': /* ... config ... */ break; // Usually part of Facebook graph API
  //     case 'x': /* ... config ... */ break; // /2/oauth2/revoke
  //     default: console.warn('Revocation not implemented for:', platform); return;
  // }
  // const response = await fetch(revocationUrl, { method, headers, body: JSON.stringify(body) });
  // if (!response.ok) {
  //    console.error(`API Error (${response.status}) revoking token for ${platform}`);
       // Handle specific errors if needed
  // }

  // Simulate network delay
  await new Promise(res => setTimeout(res, 200));
} 