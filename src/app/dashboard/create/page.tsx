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

interface PlatformToggle {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export default function CreateContentPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [platforms, setPlatforms] = useState<PlatformToggle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const enabledPlatforms = platforms
      .filter(platform => platform.enabled)
      .map(platform => platform.id);
    
    if (enabledPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const contentData = {
        title,
        description,
        scheduledDate: scheduledDate ? new Date(scheduledDate).toISOString() : null,
        platforms: enabledPlatforms
      };
      
      await createContent(user.uid, contentData);
      
      // Redirect to content list
      router.push('/dashboard/content');
    } catch (err: any) {
      setError(err.message || 'Failed to create content');
      setLoading(false);
    }
  };
  
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Content</h1>
          
          <Card>
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <Input
                    id="title"
                    label="Content Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    fullWidth
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    id="scheduledDate"
                    label="Schedule Date and Time (optional)"
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    fullWidth
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platforms
                  </label>
                  
                  {platforms.length === 0 ? (
                    <div className="text-gray-500 italic mb-4">
                      No platforms connected. Please connect platforms in your account settings.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {platforms.map((platform) => (
                        <div key={platform.id} 
                          className={`flex items-center p-3 border rounded cursor-pointer ${
                            platform.enabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                          onClick={() => handleTogglePlatform(platform.id)}
                        >
                          <div className="flex items-center flex-1">
                            <div className="w-8 h-8 mr-3 flex items-center justify-center text-gray-500">
                              <i className={platform.icon}></i>
                            </div>
                            <span>{platform.name}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                              checked={platform.enabled}
                              onChange={() => handleTogglePlatform(platform.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    isLoading={loading}
                    disabled={platforms.length === 0}
                  >
                    {scheduledDate ? 'Schedule Content' : 'Create Content'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
} 