'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SocialAccountsCard } from '@/components/user/SocialAccountsCard';
import { linkPlatform, unlinkPlatform, getUserPlatforms } from '@/firebase/platforms';

const PLATFORMS = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'fab fa-youtube',
    connected: false,
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'fab fa-twitter',
    connected: false,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'fab fa-instagram',
    connected: false,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'fab fa-tiktok',
    connected: false,
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: 'fab fa-twitch',
    connected: false,
  }
];

export default function SocialAccountsPage() {
  const { user } = useAuth();
  const [platforms, setPlatforms] = useState(PLATFORMS);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPlatforms = async () => {
      if (!user) return;
      
      try {
        const userPlatforms = await getUserPlatforms(user.uid);
        
        // Update platforms with user data
        setPlatforms(prev => 
          prev.map(platform => {
            const userPlatform = userPlatforms[platform.id];
            return {
              ...platform,
              connected: !!userPlatform,
              username: userPlatform?.username || undefined
            };
          })
        );
      } catch (error) {
        console.error('Error fetching platforms:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlatforms();
  }, [user]);
  
  const handleConnect = async (platformId: string) => {
    if (!user) return;
    
    await linkPlatform(user.uid, platformId);
    
    // Update local state
    setPlatforms(prev => 
      prev.map(platform => 
        platform.id === platformId 
          ? { ...platform, connected: true } 
          : platform
      )
    );
  };
  
  const handleDisconnect = async (platformId: string) => {
    if (!user) return;
    
    await unlinkPlatform(user.uid, platformId);
    
    // Update local state
    setPlatforms(prev => 
      prev.map(platform => 
        platform.id === platformId 
          ? { ...platform, connected: false, username: undefined } 
          : platform
      )
    );
  };
  
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Connected Accounts</h1>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-600 mb-8">
            Connect your social media accounts to cross-publish content and view analytics in one place.
          </p>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <SocialAccountsCard 
              platforms={platforms}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
} 