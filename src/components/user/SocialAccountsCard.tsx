'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  username?: string;
}

interface SocialAccountsCardProps {
  platforms: SocialPlatform[];
  onConnect: (platformId: string) => Promise<void>;
  onDisconnect: (platformId: string) => Promise<void>;
}

export function SocialAccountsCard({ platforms, onConnect, onDisconnect }: SocialAccountsCardProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (platformId: string) => {
    setLoading(platformId);
    setError(null);
    
    try {
      await onConnect(platformId);
    } catch (err: any) {
      setError(`Failed to connect to ${getPlatformName(platformId)}: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const handleDisconnect = async (platformId: string) => {
    setLoading(platformId);
    setError(null);
    
    try {
      await onDisconnect(platformId);
    } catch (err: any) {
      setError(`Failed to disconnect from ${getPlatformName(platformId)}: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const getPlatformName = (platformId: string): string => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.name || platformId;
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Connected Accounts</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="space-y-4">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-3 flex items-center justify-center text-gray-500">
                  <i className={platform.icon}></i>
                </div>
                <div>
                  <h3 className="font-medium">{platform.name}</h3>
                  {platform.connected && platform.username && (
                    <p className="text-sm text-gray-500">@{platform.username}</p>
                  )}
                </div>
              </div>
              
              <Button
                variant={platform.connected ? "outline" : "primary"}
                size="sm"
                onClick={() => platform.connected 
                  ? handleDisconnect(platform.id) 
                  : handleConnect(platform.id)
                }
                isLoading={loading === platform.id}
              >
                {platform.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
        
        <p className="mt-6 text-sm text-gray-500">
          Connect your social media accounts to cross-publish content and analyze performance across platforms.
        </p>
      </div>
    </Card>
  );
} 