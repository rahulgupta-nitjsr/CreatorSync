import { doc, getDoc, setDoc, updateDoc, deleteField, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

interface PlatformData {
  username: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  connectedAt: any; // FirebaseTimestamp
}

interface UserPlatforms {
  [platformId: string]: PlatformData;
}

/**
 * Get a user's connected platforms
 * @param userId User ID
 * @returns Object containing platform data
 */
export const getUserPlatforms = async (userId: string): Promise<UserPlatforms> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.platforms || {};
    }
    
    return {};
  } catch (error) {
    console.error('Error getting user platforms:', error);
    throw error;
  }
};

/**
 * Link a social media platform to a user account
 * @param userId User ID
 * @param platformId Platform ID (e.g., 'youtube', 'twitter')
 * @param platformData Platform connection data
 */
export const linkPlatform = async (
  userId: string, 
  platformId: string, 
  platformData: Partial<PlatformData> = {}
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // In a real app, this would include actual OAuth tokens
    // For demo purposes, we're just setting placeholder data
    await updateDoc(userRef, {
      [`platforms.${platformId}`]: {
        username: platformData.username || `user_${Math.floor(Math.random() * 10000)}`,
        accessToken: platformData.accessToken || 'demo-access-token',
        refreshToken: platformData.refreshToken || 'demo-refresh-token',
        expiresAt: platformData.expiresAt || Date.now() + 3600000, // 1 hour from now
        connectedAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error linking platform:', error);
    throw error;
  }
};

/**
 * Unlink a social media platform from a user account
 * @param userId User ID
 * @param platformId Platform ID to unlink
 */
export const unlinkPlatform = async (userId: string, platformId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      [`platforms.${platformId}`]: deleteField(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error unlinking platform:', error);
    throw error;
  }
}; 