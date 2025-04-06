'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { PlatformConnection } from '@/models/platformConnection'; // Ensure this path is correct
import toast from 'react-hot-toast'; // Import toast

export default function PlatformSettingsPage() {
  const { user, platformConnections, loading: authLoading, refreshPlatformConnections, getIdToken } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Function to initiate OAuth connection
  const handleConnectPlatform = (platformId: string) => {
    console.log(`Initiating connection for ${platformId}...`);
    // Redirect user to our backend endpoint to start the OAuth flow
    // No toast needed here as the page will redirect
    window.location.href = `/api/connect/${platformId}`;
  };

  // Function to handle disconnecting a platform
  const handleDisconnectPlatform = async (platformId: string) => {
    if (!user) {
      toast.error('Error: You must be logged in to disconnect a platform.');
      return;
    }
    // Use a confirmation dialog before proceeding
    if (!confirm(`Are you sure you want to disconnect ${platformId}? This action cannot be undone.`)) {
      return;
    }

    const toastId = toast.loading(`Disconnecting ${platformId}...`);
    try {
      const token = await getIdToken(); 
      if (!token) {
        throw new Error('Could not get authentication token.');
      }

      const response = await fetch(`/api/disconnect/${platformId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to disconnect platform.');
      }

      toast.success(`${platformId} disconnected successfully.`, { id: toastId });
      await refreshPlatformConnections(); // Refresh context state

    } catch (error) {
      console.error(`Error disconnecting ${platformId}:`, error);
      toast.error(`Error disconnecting ${platformId}: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: toastId });
    }
  };

  // Define the platforms CreatorSync supports
  // In a real app, this might come from config or backend
  const supportedPlatforms = [
    { id: 'tiktok', name: 'TikTok', icon: 'path/to/tiktok-icon.png' }, // Replace with actual icon paths/components
    { id: 'instagram', name: 'Instagram', icon: 'path/to/instagram-icon.png' },
    { id: 'x', name: 'X (Twitter)', icon: 'path/to/x-icon.png' },
  ];

  // Create a map for quick lookup of connected platforms
  const connectedPlatformsMap = new Map<string, PlatformConnection>();
  platformConnections?.forEach(conn => connectedPlatformsMap.set(conn.id, conn));

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Platform Connections</h1>
      <p className="mb-6 text-gray-600">
        Connect your social media accounts to CreatorSync to start managing your content.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supportedPlatforms.map((platform) => {
          const isConnected = connectedPlatformsMap.has(platform.id);
          const connectionData = connectedPlatformsMap.get(platform.id);

          return (
            <Card key={platform.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  {/* Basic placeholder for icon */}
                  {/* <img src={platform.icon} alt={`${platform.name} icon`} className="w-4 h-4 mr-2" /> */}
                  {platform.name}
                </CardTitle>
                {isConnected ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-4">
                  {isConnected
                    ? `Connected as ${connectionData?.profileInfo?.username || 'N/A'}` // Display some profile info if available
                    : 'Not Connected'}
                </div>
                {isConnected ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDisconnectPlatform(platform.id)}
                    className="w-full"
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleConnectPlatform(platform.id)}
                    className="w-full"
                  >
                    Connect
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Manual Refresh Button */}
       <div className="mt-6">
         <Button onClick={refreshPlatformConnections} variant="secondary" disabled={authLoading}>
           {authLoading ? 'Refreshing...' : 'Refresh Connections'}
         </Button>
       </div>

    </div>
  );
} 