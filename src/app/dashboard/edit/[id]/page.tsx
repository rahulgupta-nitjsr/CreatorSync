'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getCreatorContentById, updateCreatorContent } from '@/services/firestore';
import EditContentForm from '@/components/content/EditContentForm';
import { Content } from '@/models/content';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/common/Button';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast';

export default function EditContentPage() {
  const { user, loading: authLoading, getIdToken, platformConnections } = useAuth();
  const router = useRouter();
  const params = useParams();
  const contentId = params?.id as string;
  const [contentData, setContentData] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [platformsToPublish, setPlatformsToPublish] = useState<string[]>([]);

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
    const toastId = toast.loading('Updating content...');
    
    try {
      await updateCreatorContent(contentId, formData);
      console.log('Content updated successfully.');
      router.push('/dashboard');
      
      toast.success('Content updated successfully!', { id: toastId });
      
      setContentData((prev) => prev ? { ...prev, ...formData, updatedAt: new Date() } : null);
    } catch (err: any) {
      console.error('Failed to update content:', err);
      toast.error(`Failed to update content: ${err.message || 'Unknown error'}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlatformSelectionChange = (platformId: string, checked: boolean | string) => {
    setPlatformsToPublish(prev =>
      checked
        ? [...prev, platformId]
        : prev.filter(id => id !== platformId)
    );
  };

  const handlePublish = async () => {
    if (!contentData || platformsToPublish.length === 0) {
      toast.error('Please select at least one platform to publish to.');
      return;
    }

    setIsPublishing(true);
    const toastId = toast.loading(`Publishing to ${platformsToPublish.join(', ')}...`);

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Authentication token not available.');
      }

      const response = await fetch(`/api/publish/${contentData.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platforms: platformsToPublish }),
      });

      const resultData = await response.json();

      if (!response.ok) {
        throw new Error(resultData.error || `Publishing failed (Status: ${response.status})`);
      }
      
      const successfulPlatforms = resultData.results?.filter((r: any) => r.success).map((r: any) => r.platform) || [];
      const failedPlatforms = resultData.results?.filter((r: any) => !r.success).map((r: any) => r.platform) || [];
      
      let message = resultData.message || 'Publishing attempt finished.';
      if (successfulPlatforms.length > 0 && failedPlatforms.length === 0) {
          toast.success(`Successfully published to: ${successfulPlatforms.join(', ')}.`, { id: toastId, duration: 5000 });
      } else if (failedPlatforms.length > 0) {
          let errorMsg = `Published to: ${successfulPlatforms.join(', ') || 'none'}. Failed for: ${failedPlatforms.join(', ')}.`;
          toast.error(errorMsg, { id: toastId, duration: 8000 });
      } else {
          toast.success(message, { id: toastId });
      }

    } catch (err: any) {
      console.error('Publishing error:', err);
      toast.error(`Publishing failed: ${err.message || 'An unexpected error occurred.'}`, { id: toastId });
    } finally {
      setIsPublishing(false);
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

  const connectedPlatformIds = platformConnections?.map(p => p.id) || [];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Edit Content</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
           Error loading page: {error}
        </div>
      )}

      <EditContentForm 
          initialData={contentData} 
          onSubmit={handleFormSubmit} 
          isLoading={isSubmitting} 
          connectedPlatforms={platformConnections || []}
      />

      <div className="mt-8 p-6 border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Publish Content</h2>
        
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Select platforms to publish to:</p>
          <div className="space-y-2">
            {platformConnections && platformConnections.length > 0 ? (
              platformConnections.map((conn) => (
                <div key={conn.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`platform-${conn.id}`}
                    checked={platformsToPublish.includes(conn.id)}
                    onCheckedChange={(checked) => handlePlatformSelectionChange(conn.id, checked)}
                    disabled={isPublishing}
                  />
                  <Label htmlFor={`platform-${conn.id}`} className="capitalize">
                    {conn.id} (Connected as: {conn.profileInfo?.username || 'N/A'})
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No platforms connected. Please connect platforms in Settings.</p>
            )}
          </div>
        </div>

        <Button 
          onClick={handlePublish} 
          disabled={isPublishing || platformsToPublish.length === 0 || (platformConnections?.length || 0) === 0}
          className="w-full md:w-auto"
        >
          {isPublishing ? 'Publishing...' : 'Publish Now'}
        </Button>
      </div>
    </div>
  );
} 