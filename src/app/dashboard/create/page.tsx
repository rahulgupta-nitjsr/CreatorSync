'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { getUserPlatforms } from '@/firebase/platforms';
import { createContent } from '@/firebase/content';
import Link from 'next/link';
import { CreateContentForm } from '@/components/content/CreateContentForm';
import { uploadContentFile } from '@/services/storage';
import { createCreatorContent } from '@/services/firestore';
import toast from 'react-hot-toast';

interface PlatformToggle {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

interface FormData {
  title: string;
  description: string;
  file: File;
  platforms: string[];
  scheduledDate: string | null;
}

export default function CreateContentPage() {
  const { user, loading: authLoading, platformConnections } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [platforms, setPlatforms] = useState<PlatformToggle[]>([]);
  const [loadingState, setLoadingState] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchPlatforms = async () => {
      if (!user) return;
      
      try {
        const userPlatforms = await getUserPlatforms(user.uid);
        
        // Create toggles for connected platforms
        const platformToggles: PlatformToggle[] = Object.keys(userPlatforms).map(platformId => ({
          id: platformId,
          name: getPlatformName(platformId),
          icon: getPlatformIcon(platformId),
          enabled: true
        }));
        
        setPlatforms(platformToggles);
      } catch (error) {
        console.error('Error fetching platforms:', error);
      }
    };
    
    fetchPlatforms();
  }, [user]);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);
  
  const getPlatformName = (platformId: string): string => {
    const platformNames: {[key: string]: string} = {
      youtube: 'YouTube',
      twitter: 'Twitter',
      instagram: 'Instagram',
      tiktok: 'TikTok',
      twitch: 'Twitch'
    };
    
    return platformNames[platformId] || platformId;
  };
  
  const getPlatformIcon = (platformId: string): string => {
    const platformIcons: {[key: string]: string} = {
      youtube: 'fab fa-youtube',
      twitter: 'fab fa-twitter',
      instagram: 'fab fa-instagram',
      tiktok: 'fab fa-tiktok',
      twitch: 'fab fa-twitch'
    };
    
    return platformIcons[platformId] || 'fas fa-globe';
  };
  
  const handleTogglePlatform = (platformId: string) => {
    setPlatforms(prev => 
      prev.map(platform => 
        platform.id === platformId 
          ? { ...platform, enabled: !platform.enabled } 
          : platform
      )
    );
  };
  
  const handleFormSubmit = async (formData: {
    title: string;
    description: string;
    contentType: 'video' | 'image' | 'text';
    mediaFile?: File;
    tags?: string[];
    scheduledDate?: string;
  }) => {
    if (!user) {
      toast.error('You must be logged in to create content.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(null);
    const toastId = toast.loading('Starting content creation...');

    try {
      let mediaUrl = '';
      if (formData.mediaFile) {
        toast.loading('Uploading media file...', { id: toastId });
        mediaUrl = await uploadContentFile(
          formData.mediaFile, 
          user.uid, 
          (progress) => setUploadProgress(progress)
        );
        setUploadProgress(100);
        toast.loading('Saving content details...', { id: toastId });
      }

      const contentData = {
        title: formData.title,
        description: formData.description,
        contentType: formData.contentType,
        mediaUrl: mediaUrl || null,
        tags: formData.tags || [],
        scheduledDate: formData.scheduledDate || null,
        status: formData.scheduledDate ? 'scheduled' : 'draft',
        userId: user.uid,
        publishedPlatforms: {},
      };

      const newContentId = await createCreatorContent(user.uid, contentData as any);

      toast.success('Content created successfully!', { id: toastId });
      setTimeout(() => {
          router.push('/dashboard');
      }, 1000);

    } catch (err: any) {
      console.error('Content creation error:', err);
      toast.error(`Failed to create content: ${err.message || 'Unknown error'}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };
  
  if (authLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-4">Create New Content</h1>
        
        <CreateContentForm 
          onSubmit={handleFormSubmit} 
          userId={user.uid} 
          isSubmitting={isSubmitting} 
          uploadProgress={uploadProgress}
          connectedPlatforms={platformConnections || []}
        />
      </div>
    </AuthGuard>
  );
} 