import { Timestamp } from 'firebase/firestore';

export interface Content {
  id?: string; // Firestore document ID, optional before creation
  userId: string;
  title: string;
  description: string;
  mediaUrl: string | null; // URL to the video/image in Firebase Storage
  mediaType: 'video' | 'image' | 'text';
  thumbnailUrl?: string | null; // Optional: URL for video thumbnail
  tags: string[];
  platforms: string[]; // e.g., ['youtube', 'twitter']
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'partially_published' | 'publish_failed' | 'archived' | 'error';
  scheduledDate: Timestamp | Date | null; // Date for scheduled publishing
  publishDate: Timestamp | Date | null; // Actual date of first successful publish
  createdAt: Timestamp | Date; // Firestore timestamp or Date object
  updatedAt: Timestamp | Date;
  error?: string | null; // Store any critical error related to this content
  // Add any platform-specific IDs or results if needed later
  // e.g., youtubeVideoId?: string;
  
  // Analytics placeholders (can be updated by backend functions or client)
  views?: number;
  likes?: number;
  commentsCount?: number;

  // Platform-specific publishing status
  publishedPlatforms?: {
    [platformId: string]: {
      success: boolean;
      postId?: string | null; // ID of the post on the platform
      error?: string | null;
      publishedAt?: Timestamp | Date | null;
    };
  };

  // Monetization placeholder
  estimatedEarnings?: {
      [platformId: string]: number; // e.g., { tiktok: 1.25, instagram: 0.80 }
  };
} 