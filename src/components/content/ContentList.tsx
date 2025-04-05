'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledDate: string | null;
  platforms: string[];
  createdAt: any;
}

interface ContentListProps {
  items: ContentItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
}

export function ContentList({ items, onEdit, onDelete, onPublish }: ContentListProps) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
      {items.map(item => (
        <Card key={item.id}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {getStatusBadge(item.status)}
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
              <div className="mr-4">
                <i className="far fa-calendar-alt mr-1"></i>
                Created: {formatDate(item.createdAt)}
              </div>
              
              {item.scheduledDate && (
                <div className="mr-4">
                  <i className="far fa-clock mr-1"></i>
                  Scheduled: {formatDate(item.scheduledDate)}
                </div>
              )}
              
              <div className="flex items-center">
                <span className="mr-1">Platforms:</span> 
                {getPlatformIcons(item.platforms)}
              </div>
            </div>
            
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item.id)}
                >
                  Edit
                </Button>
              )}
              
              {onPublish && item.status !== 'published' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onPublish(item.id)}
                >
                  Publish Now
                </Button>
              )}
              
              {onDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 