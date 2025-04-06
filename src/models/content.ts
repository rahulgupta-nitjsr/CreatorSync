import { Timestamp } from 'firebase/firestore';

export interface Content {
  id?: string; // Firestore document ID, optional before creation
  userId: string;
  title: string;
  description: string;
  mediaUrl: string; // URL from Firebase Storage
  mediaType: 'image' | 'video'; // To know how to render/handle
  platforms: string[]; // e.g., ['youtube', 'twitter']
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
  scheduledDate: Timestamp | null; // Use Firestore Timestamp for querying
  publishDate: Timestamp | null; // When it was actually published
  createdAt: Timestamp;
  updatedAt: Timestamp;
  error?: string; // Store error message if status is 'failed'
  // Add any platform-specific IDs or results if needed later
  // e.g., youtubeVideoId?: string;
} 