'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/common/Button';
import { ContentList } from '@/components/content/ContentList';
import { getUserContent, deleteContent, publishContent } from '@/firebase/content';

type FilterType = 'all' | 'draft' | 'scheduled' | 'published';

export default function ContentPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchContent = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const contentItems = await getUserContent(user.uid, filter);
        setContent(contentItems);
      } catch (err: any) {
        setError(err.message || 'Failed to load content');
        setContent([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [user, filter]);
  
  const handleEdit = (contentId: string) => {
    router.push(`/dashboard/content/edit/${contentId}`);
  };
  
  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) {
      return;
    }
    
    try {
      await deleteContent(contentId);
      
      // Update local state
      setContent(prev => prev.filter(item => item.id !== contentId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete content');
    }
  };
  
  const handlePublish = async (contentId: string) => {
    try {
      await publishContent(contentId);
      
      // Update local state
      setContent(prev => 
        prev.map(item => 
          item.id === contentId 
            ? { ...item, status: 'published' } 
            : item
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to publish content');
    }
  };
  
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Content Management</h1>
          
          <Button onClick={() => router.push('/dashboard/create')}>
            Create New Content
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="mb-6 bg-white rounded-lg shadow p-4 flex space-x-2">
          <Button 
            size="sm"
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            size="sm"
            variant={filter === 'draft' ? 'primary' : 'outline'}
            onClick={() => setFilter('draft')}
          >
            Drafts
          </Button>
          <Button 
            size="sm"
            variant={filter === 'scheduled' ? 'primary' : 'outline'}
            onClick={() => setFilter('scheduled')}
          >
            Scheduled
          </Button>
          <Button 
            size="sm"
            variant={filter === 'published' ? 'primary' : 'outline'}
            onClick={() => setFilter('published')}
          >
            Published
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ContentList 
            items={content}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPublish={handlePublish}
          />
        )}
      </div>
    </AuthGuard>
  );
} 