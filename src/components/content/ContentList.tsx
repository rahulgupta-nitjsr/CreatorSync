'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Content } from '@/models/content';
import { Timestamp } from 'firebase/firestore';
import { Trash2, Edit, Send, ThumbsUp, Eye, MessageSquare } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledDate: string | null;
  platforms: string[];
  createdAt: any;
  views?: number;
  likes?: number;
  commentsCount?: number;
}

interface ContentListProps {
  items: ContentItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  onLike: (id: string) => void;
}

// Props for the individual item component
interface ContentListItemProps {
  item: ContentItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onLike: (id: string) => void;
}

// Helper to format dates (keep outside memoized component if static)
const formatDate = (date: Timestamp | Date | null | undefined): string => {
  if (!date) return 'N/A';
  const d = date instanceof Timestamp ? date.toDate() : date;
  return d.toLocaleDateString(); 
};

// The actual component for rendering a single list item
const ContentListItemComponent: React.FC<ContentListItemProps> = ({ item, onEdit, onDelete, onPublish, onLike }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Published
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            Scheduled
          </span>
        );
      case 'draft':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Draft
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const getPlatformIcons = (platforms: string[]) => {
    return platforms.map(platform => {
      let icon = 'fas fa-globe';
      
      switch (platform) {
        case 'youtube':
          icon = 'fab fa-youtube';
          break;
        case 'twitter':
          icon = 'fab fa-twitter';
          break;
        case 'instagram':
          icon = 'fab fa-instagram';
          break;
        case 'tiktok':
          icon = 'fab fa-tiktok';
          break;
        case 'twitch':
          icon = 'fab fa-twitch';
          break;
      }
      
      return (
        <span key={platform} className="mr-2 text-gray-500" title={platform}>
          <i className={icon}></i>
        </span>
      );
    });
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center">
      {/* Content Info */}
      <div className="flex-grow mb-4 sm:mb-0 sm:mr-4">
        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
        <p className="text-sm text-gray-600 mb-2 overflow-hidden overflow-ellipsis line-clamp-2">{item.description}</p>
        {/* Stats Row */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
          <span className="flex items-center" title="Views"><Eye size={14} className="mr-1"/> {item.views || 0}</span>
          <span className="flex items-center" title="Likes"><ThumbsUp size={14} className="mr-1"/> {item.likes || 0}</span>
          <span className="flex items-center" title="Comments"><MessageSquare size={14} className="mr-1"/> {item.commentsCount || 0}</span>
          <span>Status: <span className="font-medium capitalize">{item.status.replace('_',' ')}</span></span>
          <span>Created: {formatDate(item.createdAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
         {/* Like Button */}
         <Button variant="ghost" size="sm" onClick={() => onLike(item.id)} title={`Like (${item.likes || 0})`}>
             <ThumbsUp size={16} />
         </Button>
         {/* Publish Button */}
         {(item.status === 'draft' || item.status === 'publish_failed' || item.status === 'partially_published') && (
             <Button variant="outline" size="sm" onClick={() => onPublish(item.id)} title="Publish Options">
                 <Send size={16} className="mr-1 sm:mr-0" /> <span className="sm:hidden">Publish</span>
             </Button>
         )}
         {/* Edit Button */}
         <Button variant="outline" size="sm" onClick={() => onEdit(item.id)} title="Edit">
             <Edit size={16} className="mr-1 sm:mr-0"/> <span className="sm:hidden">Edit</span>
         </Button>
         {/* Delete Button */}
         <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)} title="Delete">
             <Trash2 size={16} className="mr-1 sm:mr-0"/> <span className="sm:hidden">Delete</span>
         </Button>
      </div>
    </div>
  );
};

// Memoize the ContentListItem component
const ContentListItem = React.memo(ContentListItemComponent);

// Main ContentList component now maps over items and renders the memoized ContentListItem
const ContentList: React.FC<ContentListProps> = ({ items, onEdit, onDelete, onPublish, onLike }) => {
  if (items.length === 0) {
    return (
      <Card>
        <div className="p-6 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No content found</h3>
          <p className="text-gray-500 mb-4">
            You haven't created any content yet.
          </p>
          <Link href="/dashboard/create">
            <Button>Create New Content</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <ContentListItem 
          key={item.id} 
          item={item} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onPublish={onPublish} 
          onLike={onLike} 
        />
      ))}
    </div>
  );
}

export default ContentList; 