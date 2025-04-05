import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export interface ContentItem {
  id?: string;
  title: string;
  description: string;
  contentType: 'article' | 'video' | 'podcast' | 'image';
  tags: string[];
  mediaUrl?: string;
  isPremium: boolean;
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  authorName?: string;
  views: number;
  likes: number;
  comments: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CommentItem {
  id?: string;
  contentId: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  text: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Create a new content item
 * @param {ContentItem} data - Content data
 * @returns {Promise<string>} Document ID
 */
export const createContent = async (data: ContentItem): Promise<string> => {
  try {
    const contentRef = collection(db, 'content');
    
    const contentData = {
      ...data,
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(contentRef, contentData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};

/**
 * Get a content item by ID
 * @param {string} id - Content ID
 * @returns {Promise<ContentItem | null>} Content item
 */
export const getContent = async (id: string): Promise<ContentItem | null> => {
  try {
    const docRef = doc(db, 'content', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ContentItem;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting content:', error);
    throw error;
  }
};

/**
 * Update a content item
 * @param {string} id - Content ID
 * @param {Partial<ContentItem>} data - Updated content data
 * @returns {Promise<void>}
 */
export const updateContent = async (
  id: string,
  data: Partial<ContentItem>
): Promise<void> => {
  try {
    const docRef = doc(db, 'content', id);
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
};

/**
 * Delete a content item
 * @param {string} id - Content ID
 * @returns {Promise<void>}
 */
export const deleteContent = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'content', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
};

interface GetContentOptions {
  authorId?: string;
  contentType?: 'article' | 'video' | 'podcast' | 'image';
  status?: 'draft' | 'published' | 'archived';
  isPremium?: boolean;
  tags?: string[];
  sortBy?: 'createdAt' | 'updatedAt' | 'views' | 'likes';
  sortDirection?: 'asc' | 'desc';
  limitCount?: number;
}

/**
 * Get content items with filtering and sorting
 * @param {GetContentOptions} options - Query options
 * @returns {Promise<ContentItem[]>} Content items
 */
export const getContentList = async (
  options: GetContentOptions = {}
): Promise<ContentItem[]> => {
  try {
    const {
      authorId,
      contentType,
      status,
      isPremium,
      tags,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      limitCount = 20
    } = options;
    
    const constraints: QueryConstraint[] = [];
    
    // Add filters
    if (authorId) {
      constraints.push(where('authorId', '==', authorId));
    }
    
    if (contentType) {
      constraints.push(where('contentType', '==', contentType));
    }
    
    if (status) {
      constraints.push(where('status', '==', status));
    }
    
    if (isPremium !== undefined) {
      constraints.push(where('isPremium', '==', isPremium));
    }
    
    if (tags && tags.length > 0) {
      // Firestore can only filter on array-contains with a single value
      constraints.push(where('tags', 'array-contains', tags[0]));
    }
    
    // Add sorting
    constraints.push(orderBy(sortBy, sortDirection));
    
    // Add limit
    constraints.push(limit(limitCount));
    
    const contentQuery = query(collection(db, 'content'), ...constraints);
    const querySnapshot = await getDocs(contentQuery);
    
    const content: ContentItem[] = [];
    querySnapshot.forEach((doc) => {
      content.push({ id: doc.id, ...doc.data() } as ContentItem);
    });
    
    // Additional filtering for multiple tags (client-side)
    if (tags && tags.length > 1) {
      return content.filter((item) => {
        return tags.every((tag) => item.tags.includes(tag));
      });
    }
    
    return content;
  } catch (error) {
    console.error('Error getting content list:', error);
    throw error;
  }
};

/**
 * Increment a numeric field on a content document
 * @param {string} contentId - Content ID
 * @param {string} field - Field name (views, likes, comments)
 * @returns {Promise<void>}
 */
export const incrementContentField = async (
  contentId: string,
  field: 'views' | 'likes' | 'comments'
): Promise<void> => {
  try {
    const contentRef = doc(db, 'content', contentId);
    
    await updateDoc(contentRef, {
      [field]: increment(1),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error incrementing ${field}:`, error);
    throw error;
  }
};

/**
 * Helper function to create a Firebase increment
 * @param {number} amount - Amount to increment
 * @returns {Object} Firebase increment object
 */
const increment = (amount: number) => {
  return {
    __op: 'increment',
    __amount: amount
  };
};

/**
 * Add a comment to a content item
 * @param {CommentItem} data - Comment data
 * @returns {Promise<string>} Comment ID
 */
export const addComment = async (data: CommentItem): Promise<string> => {
  try {
    const commentsRef = collection(db, 'comments');
    
    const commentData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(commentsRef, commentData);
    
    // Increment comment count on content
    await incrementContentField(data.contentId, 'comments');
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Get comments for a content item
 * @param {string} contentId - Content ID
 * @param {number} limitCount - Maximum number of comments to retrieve
 * @returns {Promise<CommentItem[]>} Comments
 */
export const getContentComments = async (
  contentId: string,
  limitCount = 20
): Promise<CommentItem[]> => {
  try {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('contentId', '==', contentId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(commentsQuery);
    
    const comments: CommentItem[] = [];
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() } as CommentItem);
    });
    
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

/**
 * Delete a comment
 * @param {string} commentId - Comment ID
 * @param {string} contentId - Content ID (to decrement the comment count)
 * @returns {Promise<void>}
 */
export const deleteComment = async (
  commentId: string,
  contentId: string
): Promise<void> => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await deleteDoc(commentRef);
    
    // Decrement comment count on content
    const contentRef = doc(db, 'content', contentId);
    
    await updateDoc(contentRef, {
      comments: increment(-1),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}; 