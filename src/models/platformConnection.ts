export interface PlatformConnection {
  id: string; // e.g., 'youtube', 'twitter'
  name: string; // e.g., 'YouTube', 'Twitter (X)'
  icon: string; // e.g., 'fab fa-youtube'
  connected: boolean;
  // Optional: Store user's specific ID/handle on that platform if needed
  userPlatformId?: string; 
  userPlatformName?: string; // e.g., @username
  // Optional: Store relevant tokens or expiry dates (handle securely)
  // accessToken?: string; 
  // refreshToken?: string;
  // tokenExpiry?: Timestamp;
} 