'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { signOut } from '@/firebase/auth';

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/app/(auth)/login');
    }
  }, [loading, user, router]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show dashboard content if authenticated
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>

          {/* Welcome Card */}
          <Card 
            title="Welcome back!"
            subtitle={`Hello, ${userProfile?.displayName || user.displayName || 'Creator'}`}
            className="mb-8"
          >
            <p className="text-gray-600">
              This is your CreatorSync dashboard. From here, you can manage your content,
              track your analytics, monitor your monetization, and grow your audience
              across TikTok, Instagram Reels, and X.
            </p>
          </Card>

          {/* Quick Stats */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Placeholder stats */}
            <Card variant="outlined">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-500">Content</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
                <p className="mt-1 text-sm text-gray-500">Pieces of content</p>
              </div>
            </Card>
            
            <Card variant="outlined">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-500">Engagement</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
                <p className="mt-1 text-sm text-gray-500">Total engagements</p>
              </div>
            </Card>
            
            <Card variant="outlined">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-500">Revenue</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">$0</p>
                <p className="mt-1 text-sm text-gray-500">Total revenue</p>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create Content</h3>
              <p className="text-gray-600 mb-4">
                Create and schedule new content for your platforms.
              </p>
              <Button fullWidth onClick={() => router.push('/content-studio')}>
                Go to Content Studio
              </Button>
            </Card>
            
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-2">View Analytics</h3>
              <p className="text-gray-600 mb-4">
                Check your performance metrics across platforms.
              </p>
              <Button fullWidth onClick={() => router.push('/analytics')}>
                Go to Analytics
              </Button>
            </Card>
            
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Track Monetization</h3>
              <p className="text-gray-600 mb-4">
                Monitor your revenue streams and brand deals.
              </p>
              <Button fullWidth onClick={() => router.push('/monetization')}>
                Go to Monetization
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - should not be rendered due to redirect
  return null;
} 