'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';

export default function PlatformSettingsPage() {
  const { user, platformConnections, loading: authLoading, refreshPlatformConnections } = useAuth();
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
        (Connection/disconnection functionality coming soon!)
      </p>

      <div className="space-y-4">
        {platformConnections.length === 0 && !authLoading && (
          <div className="bg-gray-100 p-4 rounded text-center text-gray-500">
            No platform connections found.
          </div>
        )}

        {platformConnections.map((platform) => (
          <div key={platform.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex items-center">
              <i className={`${platform.icon} text-2xl mr-4 w-8 text-center`}></i>
              <div>
                <p className="font-medium text-gray-900">{platform.name}</p>
                {platform.userPlatformName && (
                  <p className="text-sm text-gray-500">{platform.userPlatformName}</p>
                )}
              </div>
            </div>
            <div>
              {platform.connected ? (
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Connect (Coming Soon)
                </Button>
              )}
              {/* Placeholder for Disconnect/Refresh */}
            </div>
          </div>
        ))}
      </div>
      
      {/* Manual Refresh Button (Optional) */}
       <div className="mt-6">
         <Button onClick={refreshPlatformConnections} variant="secondary" disabled={authLoading}>
           {authLoading ? 'Refreshing...' : 'Refresh Connections'}
         </Button>
       </div>

    </div>
  );
} 