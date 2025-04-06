import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // For reading state cookie
import { auth } from '@/firebase/config.server'; // Assuming server-side admin SDK setup
import { firestoreAdmin } from '@/firebase/config.server'; // Need admin SDK for backend writes
import { authAdmin } from '@/firebase/config.server'; // Use server-side admin SDK imports

// Reuse platform configs (ideally from a shared config file)
const platformConfigs: Record<string, { clientId: string; clientSecret: string; tokenUrl: string; /* other fields */ }> = {
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_ID || 'TIKTOK_CLIENT_ID_PLACEHOLDER',
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || 'TIKTOK_SECRET_PLACEHOLDER',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/', // Example URL, verify actual endpoint
    // ... other fields like scopes, redirectUri might be needed for validation or context
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || 'INSTAGRAM_CLIENT_ID_PLACEHOLDER',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || 'INSTAGRAM_SECRET_PLACEHOLDER',
    tokenUrl: 'https://api.instagram.com/oauth/access_token', // Example URL
    // ...
  },
  x: {
    clientId: process.env.X_CLIENT_ID || 'X_CLIENT_ID_PLACEHOLDER',
    clientSecret: process.env.X_CLIENT_SECRET || 'X_SECRET_PLACEHOLDER',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token', // Example URL (v2)
    // ...
  },
};

/**
 * GET handler for OAuth callback.
 * Exchanges the authorization code for an access token and stores it.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform;
  const config = platformConfigs[platform];
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const receivedState = searchParams.get('state');

  // --- 0. Basic Validation ---
  if (!config) {
    return NextResponse.redirect(new URL('/dashboard/settings/platforms?error=unsupported_platform', request.url));
  }
  if (!code) {
    return NextResponse.redirect(new URL('/dashboard/settings/platforms?error=missing_code', request.url));
  }
  if (!receivedState) {
    return NextResponse.redirect(new URL('/dashboard/settings/platforms?error=missing_state', request.url));
  }

  // --- 1. Verify State (CSRF Protection) ---
  const storedStateCookie = cookies().get('oauth_state');
  const storedState = storedStateCookie?.value;
  
  // Clear the state cookie immediately after reading it
  if (storedStateCookie) {
    cookies().set('oauth_state', '', { httpOnly: true, path: '/', maxAge: 0 });
  }

  if (!storedState || storedState !== receivedState) {
    console.error('Invalid OAuth state', { stored: storedState, received: receivedState });
    return NextResponse.redirect(new URL('/dashboard/settings/platforms?error=invalid_state', request.url));
  }
  // State is valid and cookie is cleared
  console.log('OAuth state validated successfully.');

  // --- 2. Exchange Code for Access Token ---
  try {
    const tokenParams = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/connect/${platform}/callback`, // Must match the one used in the initial request
    });

    // Special handling for X (requires Basic Auth header)
    let headers: HeadersInit = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    if (platform === 'x') {
      const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
      headers['Authorization'] = `Basic ${basicAuth}`;
    }

    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: headers,
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      console.error(`Error exchanging code for token (${platform}, Status: ${tokenResponse.status}):`, errorBody);
      throw new Error(`Failed to fetch token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token; // May be null
    const expiresIn = tokenData.expires_in; // Seconds until expiry
    const scope = tokenData.scope; // Scopes granted

    if (!accessToken) {
      console.error('Access token not found in response:', tokenData);
      throw new Error('Access token missing from platform response.');
    }

    // --- 3. Get User Info from Platform ---
    // Placeholder - implement platform-specific logic
    let platformProfile: { id: string; username: string; [key: string]: any } | null = null;
    try {
      platformProfile = await getPlatformUserProfile(platform, accessToken);
    } catch (profileError) {
      console.error(`Failed to fetch profile from ${platform}:`, profileError);
      // Decide how to handle: Fail connection, proceed without profile, etc.
      // For now, we proceed but log the error.
      // Optionally throw new Error(`Failed to fetch profile from ${platform}`);
    }

    if (!platformProfile) {
       // Handle case where profile fetch failed or returned null/unexpected
       // Using generic info for now, but ideally handle this more robustly.
        platformProfile = {
            id: `platform_user_${Date.now()}`,
            username: `${platform}_user_generic` 
        };
       console.warn(`Using generic profile info for ${platform} due to fetch issue or missing implementation.`);
    }

    // --- 4. Get CreatorSync User ID (using Admin SDK) ---
    const authHeader = request.headers.get('Authorization');
    let userId: string | null = null;
    if (authHeader?.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      try {
        // Verify token using Admin SDK
        if (!authAdmin) throw new Error('Firebase Admin Auth not initialized.');
        const decodedToken = await authAdmin.verifyIdToken(idToken);
        userId = decodedToken.uid;
      } catch (authError) {
        console.error('Error verifying ID token in callback:', authError);
        return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
      }
    }
    if (!userId) {
      return NextResponse.redirect(new URL('/login?error=auth_required', request.url));
    }

    // --- 5. Store Token and Profile Info in Firestore (using Admin SDK) ---
    const connectionData = {
      accessToken,
      refreshToken, // Store if available
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : null,
      scope: scope || '',
      profileInfo: platformProfile, // Store fetched or placeholder profile
      connectedAt: new Date(),
      status: 'active',
    };

    if (!firestoreAdmin) throw new Error('Firebase Admin Firestore not initialized.');
    const connectionRef = firestoreAdmin
      .collection('users').doc(userId)
      .collection('platformConnections').doc(platform);
    await connectionRef.set(connectionData, { merge: true });
    console.log(`Successfully stored connection for user ${userId}, platform ${platform}`);

    // --- 6. Redirect User Back to Settings ---
    return NextResponse.redirect(new URL('/dashboard/settings/platforms?success=true', request.url));

  } catch (error) {
    console.error(`OAuth callback error for platform ${platform}:`, error);
    let errorMessage = 'connection_failed';
    if (error instanceof Error) {
        // Basic check for common issues
        if (error.message.includes('token')) errorMessage = 'token_exchange_failed';
        if (error.message.includes('profile')) errorMessage = 'profile_fetch_failed';
        if (error.message.includes('firestore')) errorMessage = 'storage_failed';
    }
    // Redirect back to settings page with a generic error
    return NextResponse.redirect(new URL(`/dashboard/settings/platforms?error=${errorMessage}&platform=${platform}`, request.url));
  }
}

/**
 * Placeholder function to fetch user profile from a given platform.
 * Needs specific implementation for each platform API.
 * @param platform The platform identifier (e.g., 'tiktok', 'instagram', 'x')
 * @param accessToken The valid access token for the platform.
 * @returns Promise containing basic profile info (id, username, etc.)
 */
async function getPlatformUserProfile(
    platform: string, 
    accessToken: string
): Promise<{ id: string; username: string; [key: string]: any } | null> {
    console.log(`TODO: Implement profile fetch for ${platform} using token: ${accessToken.substring(0, 10)}...`);
    // Example structure:
    // let profileUrl = '';
    // let headers: HeadersInit = { 'Authorization': `Bearer ${accessToken}` };
    // switch (platform) {
    //     case 'tiktok': profileUrl = '...'; break;
    //     case 'instagram': profileUrl = '...'; break; // Usually requires specific fields param
    //     case 'x': profileUrl = '...'; break; // Use /2/users/me
    //     default: throw new Error('Unsupported platform for profile fetch');
    // }
    // const response = await fetch(profileUrl, { headers });
    // if (!response.ok) throw new Error(`API Error (${response.status}) fetching profile`);
    // const data = await response.json();
    // // Parse data and return standardized { id, username, ... } object
    // return { id: data.id, username: data.username || data.screen_name, /* other fields */ };

    // Return placeholder for now
    await new Promise(res => setTimeout(res, 50)); // Simulate tiny delay
    return {
        id: `platform_user_${Date.now()}`,
        username: `${platform}_user_${Math.random().toString(16).substring(2, 8)}`,
        fetchedAt: new Date().toISOString()
    };
    // return null; // Simulate failure
} 