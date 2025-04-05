import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc,
  deleteDoc,
  Timestamp,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export interface Notification {
  id?: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  message: string;
  contentId?: string;
  sourceUserId?: string;
  sourceUserName?: string;
  sourceUserAvatar?: string;
  read: boolean;
  createdAt: Timestamp;
}

const notificationsCollection = 'notifications';

/**
 * Create a new notification for a user
 * @param notification The notification data
 * @returns The notification ID
 */
export const createNotification = async (
  notification: Omit<Notification, 'id' | 'createdAt' | 'read'>
): Promise<string> => {
  try {
    const notificationData: Omit<Notification, 'id'> = {
      ...notification,
      read: false,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, notificationsCollection), notificationData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Get all notifications for a user
 * @param userId The user ID
 * @param onlyUnread Filter to only unread notifications
 * @param maxResults Maximum number of results to return
 * @returns Array of notifications
 */
export const getUserNotifications = async (
  userId: string, 
  onlyUnread = false,
  maxResults = 20
): Promise<Notification[]> => {
  try {
    let q = query(
      collection(db, notificationsCollection),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );

    if (onlyUnread) {
      q = query(q, where('read', '==', false));
    }

    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Notification));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param notificationId The notification ID
 * @returns Promise<void>
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const notificationRef = doc(db, notificationsCollection, notificationId);
    await updateDoc(notificationRef, {
      read: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications for a user as read
 * @param userId The user ID
 * @returns Promise<void>
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, notificationsCollection),
        where('userId', '==', userId),
        where('read', '==', false)
      )
    );

    const updatePromises = querySnapshot.docs.map(doc => 
      updateDoc(doc.ref, { read: true })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 * @param notificationId The notification ID
 * @returns Promise<void>
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, notificationsCollection, notificationId));
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Count unread notifications for a user
 * @param userId The user ID
 * @returns Promise<number> The count of unread notifications
 */
export const countUnreadNotifications = async (userId: string): Promise<number> => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, notificationsCollection),
        where('userId', '==', userId),
        where('read', '==', false)
      )
    );
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    throw error;
  }
};

/**
 * Subscribe to notifications for a user
 * @param userId The user ID
 * @param callback Function to call when notifications change
 * @returns Unsubscribe function
 */
export const subscribeToNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void
): (() => void) => {
  const q = query(
    collection(db, notificationsCollection),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (querySnapshot) => {
    const notifications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Notification));
    
    callback(notifications);
  });
}; 