import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './config';

interface ContentData {
  title: string;
  description: string;
  mediaUrl: string | null;
  mediaType: 'video' | 'image' | 'text';
  thumbnailUrl?: string | null;
  tags: string[];
  platforms: string[];
  scheduledDate: Timestamp | Date | null;
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
    const contentCollection = collection(db, 'users', userId, 'content');
    
    // Set initial status based on scheduled date
    let scheduleTimestamp: Timestamp | null = null;
    if (contentData.scheduledDate) {
        scheduleTimestamp = contentData.scheduledDate instanceof Date 
            ? Timestamp.fromDate(contentData.scheduledDate) 
            : contentData.scheduledDate; // Assume it's already a Timestamp
    }

    const status = scheduleTimestamp ? 'scheduled' : 'draft';
    
    const docData = {
      ...contentData,
      scheduledDate: scheduleTimestamp,
      status,
      userId,
      publishDate: null,
      views: 0,
      likes: 0,
      commentsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Remove undefined fields before sending to Firestore
    Object.keys(docData).forEach(key => docData[key as keyof typeof docData] === undefined && delete docData[key as keyof typeof docData]);
    
    const docRef = await addDoc(contentCollection, docData);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating content:', error);
    throw new Error('Failed to create content item.');
  }
};

/**
 * Get all content items for a user
 * @param userId User ID
 * @param filter Optional filter (all, draft, scheduled, published, failed)
 * @returns Array of content items
 */
export const getUserContent = async (
  userId: string, 
  filter: 'all' | 'draft' | 'scheduled' | 'published' | 'failed' = 'all'
): Promise<Content[]> => {
  try {
    const contentCollection = collection(db, 'users', userId, 'content');
    
    // Base constraints
    const baseConstraints = [where('userId', '==', userId)];
    
    // Build the query dynamically
    let contentQuery;
    if (filter !== 'all') {
      contentQuery = query(
        contentCollection,
        ...baseConstraints,
        where('status', '==', filter),
        orderBy('createdAt', 'desc')
      );
    } else {
      contentQuery = query(
        contentCollection,
        ...baseConstraints,
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
    throw new Error('Failed to retrieve content.');
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
 * @param userId User ID
 * @param contentId Content ID
 * @param updateData Updated content data
 */
export const updateContent = async (
    userId: string, 
    contentId: string, 
    updateData: Partial<ContentData & { status?: Content['status'] }>
): Promise<void> => {
  try {
    const contentRef = doc(db, 'users', userId, 'content', contentId);
    
    // Prepare data for update, converting scheduledDate if present
    const dataToUpdate: Partial<Content & { updatedAt: any }> = { ...updateData };

    if (updateData.scheduledDate !== undefined) {
      if (updateData.scheduledDate === null) {
        dataToUpdate.scheduledDate = null;
        if (!dataToUpdate.status) {
            dataToUpdate.status = 'draft'; 
        }
      } else {
         dataToUpdate.scheduledDate = updateData.scheduledDate instanceof Date 
            ? Timestamp.fromDate(updateData.scheduledDate) 
            : updateData.scheduledDate;
         dataToUpdate.status = 'scheduled';
      }
    } else {
        delete dataToUpdate.scheduledDate;
    }
    
    dataToUpdate.updatedAt = serverTimestamp();

    // Remove undefined fields before sending to Firestore
    Object.keys(dataToUpdate).forEach(key => dataToUpdate[key as keyof typeof dataToUpdate] === undefined && delete dataToUpdate[key as keyof typeof dataToUpdate]);

    await updateDoc(contentRef, dataToUpdate);

  } catch (error) {
    console.error('Error updating content:', error);
    throw new Error('Failed to update content item.');
  }
};

/**
 * Delete a content item
 * @param userId User ID
 * @param contentId Content ID
 */
export const deleteContent = async (userId: string, contentId: string): Promise<void> => {
  try {
    const contentRef = doc(db, 'users', userId, 'content', contentId);
    await deleteDoc(contentRef);
  } catch (error) {
    console.error('Error deleting content:', error);
    throw new Error('Failed to delete content item.');
  }
};

/**
 * Publish content to selected platforms
 * @param userId User ID
 * @param contentId Content ID
 */
export const publishContent = async (userId: string, contentId: string): Promise<void> => {
  try {
    const contentRef = doc(db, 'users', userId, 'content', contentId);
    await updateDoc(contentRef, {
      status: 'published',
      publishDate: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking content as published:', error);
    throw new Error('Failed to update content status to published.');
  }
}; 