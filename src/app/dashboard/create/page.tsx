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
import CreateContentForm from '@/components/content/CreateContentForm';
import { uploadContentFile } from '@/services/storage.service';
import { createCreatorContent } from '@/services/firestore.service';

// Assume Toast component exists for notifications
// import { toast } from 'react-hot-toast';
const toast = { success: console.log, error: console.error }; // Placeholder

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
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [platforms, setPlatforms] = useState<PlatformToggle[]>([]);
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null); // State for progress
  
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
  
  const handleFormSubmit = async (formData: FormData) => {
    if (!user || !formData.file) {
      setSubmitError('Authentication error or missing file.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(0); // Reset progress
    
    try {
      console.log('Uploading file...');
      const mediaUrl = await uploadContentFile(
          formData.file, 
          user.uid, 
          (snapshot) => { // Progress callback
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
              console.log('Upload is ' + progress + '% done');
          }
      );
      console.log('File uploaded, URL:', mediaUrl);
      setUploadProgress(null); // Clear progress after upload

      console.log('Saving content metadata...');
      const mediaType = formData.file.type.startsWith('video/') ? 'video' : 'image';
      const contentDataForFirestore = {
        title: formData.title,
        description: formData.description,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        platforms: formData.platforms,
        scheduledDate: formData.scheduledDate,
      };
      
      await createCreatorContent(user.uid, contentDataForFirestore);
      console.log('Content metadata saved.');

      toast.success('Content created successfully!'); // Success notification
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Failed to create content:', error);
      const errorMessage = error.message || 'Failed to create content. Please try again.';
      setSubmitError(errorMessage);
      toast.error(`Error: ${errorMessage}`); // Error notification
      setIsSubmitting(false);
      setUploadProgress(null); // Clear progress on error
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
  
  if (!user) {
    return null;
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
        
        {submitError && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}
        
        <CreateContentForm 
          onSubmit={handleFormSubmit} 
          userId={user.uid} 
          isSubmitting={isSubmitting} 
          uploadProgress={uploadProgress} // Pass progress down
        />
      </div>
    </AuthGuard>
  );
} 