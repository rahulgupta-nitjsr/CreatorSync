import { NextRequest, NextResponse } from 'next/server';
import { authAdmin } from '@/firebase/config.server'; // Server-side admin SDK
import { publishContentToPlatforms } from '@/services/publishing.service';

/**
 * POST handler to trigger publishing content to selected platforms.
 */
export async function POST(
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
      console.error('Error verifying ID token for publish:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // --- 2. Get Target Platforms from Request Body ---
  let platformsToPublish: string[] = [];
  try {
    const body = await request.json();
    if (!Array.isArray(body.platforms) || body.platforms.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid 'platforms' array in request body.' }, { status: 400 });
    }
    platformsToPublish = body.platforms;
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // --- 3. Call Publishing Service ---
  try {
    console.log(`API route received publish request for content ${contentId}, user ${userId}, platforms: ${platformsToPublish.join(', ')}`);
    const results = await publishContentToPlatforms(userId, contentId, platformsToPublish);

    // Check overall success (optional, client might handle based on results array)
    const overallSuccess = results.length > 0 && results.every(r => r.success || r.platform === 'orchestration'); // Consider orchestration errors

    // Return the detailed results
    return NextResponse.json({ 
        message: overallSuccess ? 'Publishing initiated.' : 'Publishing attempted with some failures.',
        results 
    });

  } catch (error: any) {
    console.error(`API error during publishing content ${contentId}:`, error);
    // This catch block might be redundant if publishContentToPlatforms handles its own errors gracefully
    // But it catches potential issues before calling the service or unexpected throws.
    return NextResponse.json({ error: 'Failed to initiate publishing', details: error.message }, { status: 500 });
  }
} 