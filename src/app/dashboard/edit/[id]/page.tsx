'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getCreatorContentById, updateCreatorContent } from '@/services/firestore.service';
import EditContentForm from '@/components/content/EditContentForm';
import { Content } from '@/models/content';
import { Timestamp } from 'firebase/firestore';

export default function EditContentPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const contentId = params?.id as string;
  const [contentData, setContentData] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && contentId) {
      const fetchContentData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          console.log(`Fetching content with ID: ${contentId}`);
          const data = await getCreatorContentById(contentId);
          if (data) {
            setContentData(data);
            console.log('Content data fetched:', data);
          } else {
            setError('Content not found.');
          }
        } catch (err: any) {
          console.error('Failed to fetch content:', err);
          setError(err.message || 'Failed to load content data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchContentData();
    }
  }, [user, contentId]);

  const handleFormSubmit = async (formData: Partial<Omit<Content, 'id' | 'userId' | 'createdAt' | 'mediaUrl' | 'mediaType'>>) => {
    if (!contentId) {
        setError('Content ID is missing.');
        return;
    }
    console.log('Updating content:', contentId, formData);
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateCreatorContent(contentId, formData);
      console.log('Content updated successfully.');
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Failed to update content:', error);
      setError(error.message || 'Failed to update content. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (error && !contentData) {
    return (
        <div className="container mx-auto p-4 text-center text-red-600">
             <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 block">
               &larr; Back to Dashboard
             </Link>
            Error loading data: {error}
        </div>
    );
  }
  
  if (!contentData) {
      return (
          <div className="container mx-auto p-4 text-center">
              <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 block">
                &larr; Back to Dashboard
              </Link>
              Content not found.
          </div>
      );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Edit Content</h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Update Error: {error}</span>
        </div>
      )}

      <EditContentForm 
          initialData={contentData} 
          onSubmit={handleFormSubmit} 
          isLoading={isSubmitting} 
      />
    </div>
  );
} 