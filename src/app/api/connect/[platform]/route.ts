import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // For generating state parameter
import { cookies } from 'next/headers'; // Import cookies

// Define supported platforms and their OAuth configurations (Placeholders)
// In a real app, store sensitive keys/secrets securely in environment variables!
const platformConfigs: Record<string, { clientId: string; clientSecret: string; authUrl: string; scopes: string[]; redirectUri: string }> = {
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_ID || 'TIKTOK_CLIENT_ID_PLACEHOLDER',
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || 'TIKTOK_SECRET_PLACEHOLDER',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize/', // Example URL, verify actual endpoint
    scopes: ['user.info.basic', 'video.list', 'video.upload'], // Example scopes
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/connect/tiktok/callback`,
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || 'INSTAGRAM_CLIENT_ID_PLACEHOLDER',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || 'INSTAGRAM_SECRET_PLACEHOLDER',
    authUrl: 'https://api.instagram.com/oauth/authorize', // Example URL
    // Scopes needed for Reels/content posting (refer to Instagram API docs)
    scopes: ['user_profile', 'user_media', 'instagram_content_publish'], 
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/connect/instagram/callback`,
  },
  x: {
    clientId: process.env.X_CLIENT_ID || 'X_CLIENT_ID_PLACEHOLDER',
    clientSecret: process.env.X_CLIENT_SECRET || 'X_SECRET_PLACEHOLDER',
    authUrl: 'https://twitter.com/i/oauth2/authorize', // Example URL
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'], // Example scopes (v2)
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/connect/x/callback`,
  },
};

/**
 * GET handler to initiate OAuth flow for a specific platform.
 * Redirects the user to the platform's authorization page.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform;
  const config = platformConfigs[platform];

  if (!config) {
    return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
  }

  // 1. Generate State Parameter (CSRF protection)
  const state = uuidv4();
  
  // 2. Construct Authorization URL (using the generated state)
  const authParams = new URLSearchParams({
    client_id: config.clientId,
    response_type: 'code', 
    redirect_uri: config.redirectUri,
    scope: config.scopes.join(' '), 
    state: state, // Use the generated state
    // Add platform-specific parameters if needed (e.g., challenge for X)
  });
  const authorizationUrl = `${config.authUrl}?${authParams.toString()}`;

  // 3. Create Redirect Response and Set Secure Cookie
  const response = NextResponse.redirect(authorizationUrl);
  
  // Set the state in an HttpOnly cookie
  cookies().set('oauth_state', state, {
    path: '/', // Ensure cookie is accessible on the callback path
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use Secure in production
    maxAge: 60 * 10, // 10 minutes expiry
    sameSite: 'lax',
  });

  return response;
} 