import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './config';

interface ContentData {
  title: string;
  description: string;
  scheduledDate: string | null;
  platforms: string[];
  status?: 'draft' | 'scheduled' | 'published' | 'failed';
  publishResults?: {
    [platformId: string]: {
      status: 'pending' | 'success' | 'failed';
      message?: string;
      url?: string;
      publishedAt?: any; // FirebaseTimestamp
    }
  };
}

interface Content extends ContentData {
  id: string;
  createdAt: any; // FirebaseTimestamp
  updatedAt: any; // FirebaseTimestamp
  userId: string;
}

/**
 * Create a new content item
 * @param userId User ID
 * @param contentData Content data
 * @returns ID of the created content
 */
export const createContent = async (userId: string, contentData: ContentData): Promise<string> => {
  try {
    const contentCollection = collection(db, 'content');
    
    // Set initial status based on scheduled date
    const status = contentData.scheduledDate ? 'scheduled' : 'draft';
    
    const docRef = await addDoc(contentCollection, {
      ...contentData,
      status,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};

/**
 * Get all content items for a user
 * @param userId User ID
 * @param filter Optional filter (all, draft, scheduled, published)
 * @returns Array of content items
 */
export const getUserContent = async (
  userId: string, 
  filter: 'all' | 'draft' | 'scheduled' | 'published' = 'all'
): Promise<Content[]> => {
  try {
    const contentCollection = collection(db, 'content');
    let contentQuery;
    
    if (filter === 'all') {
      contentQuery = query(
        contentCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } else {
      contentQuery = query(
        contentCollection,
        where('userId', '==', userId),
        where('status', '==', filter),
        orderBy('createdAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(contentQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Omit<Content, 'id'>;
      return {
        id: doc.id,
        ...data
      };
    });
  } catch (error) {
    console.error('Error getting user content:', error);
    throw error;
  }
};

/**
 * Get a specific content item
 * @param contentId Content ID
 * @returns Content item
 */
export const getContent = async (contentId: string): Promise<Content | null> => {
  try {
    const contentRef = doc(db, 'content', contentId);
    const contentDoc = await getDoc(contentRef);
    
    if (contentDoc.exists()) {
      const data = contentDoc.data() as Omit<Content, 'id'>;
      return {
        id: contentDoc.id,
        ...data
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting content:', error);
    throw error;
  }
};

/**
 * Update a content item
 * @param contentId Content ID
 * @param contentData Updated content data
 */
export const updateContent = async (contentId: string, contentData: Partial<ContentData>): Promise<void> => {
  try {
    const contentRef = doc(db, 'content', contentId);
    
    // If updating scheduledDate, update status accordingly
    if ('scheduledDate' in contentData) {
      if (contentData.scheduledDate) {
        contentData.status = 'scheduled';
      } else if (contentData.status === 'scheduled') {
        contentData.status = 'draft';
      }
    }
    
    await updateDoc(contentRef, {
      ...contentData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
};

/**
 * Delete a content item
 * @param contentId Content ID
 */
export const deleteContent = async (contentId: string): Promise<void> => {
  try {
    const contentRef = doc(db, 'content', contentId);
    await deleteDoc(contentRef);
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
};

/**
 * Publish content to selected platforms
 * @param contentId Content ID
 * @param platforms Platform IDs to publish to (if empty, publish to all platforms in content)
 */
export const publishContent = async (
  contentId: string, 
  platforms: string[] = []
): Promise<void> => {
  try {
    const contentRef = doc(db, 'content', contentId);
    const contentDoc = await getDoc(contentRef);
    
    if (!contentDoc.exists()) {
      throw new Error('Content not found');
    }
    
    const content = contentDoc.data() as ContentData;
    const platformsToPublish = platforms.length > 0 ? platforms : content.platforms;
    
    // In a real app, this would call platform APIs to publish content
    // For demo purposes, we'll simulate successful publishing
    const publishResults: ContentData['publishResults'] = {};
    
    platformsToPublish.forEach(platformId => {
      publishResults[platformId] = {
        status: 'success',
        message: 'Content published successfully',
        url: `https://${platformId}.com/post/123456`,
        publishedAt: serverTimestamp()
      };
    });
    
    await updateDoc(contentRef, {
      status: 'published',
      publishResults,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error publishing content:', error);
    throw error;
  }
}; 