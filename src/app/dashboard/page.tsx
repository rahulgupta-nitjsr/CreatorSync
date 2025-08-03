'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { ContentList } from '@/components/content/ContentList';
import { Content } from '@/models/content'; // Use the Content model
import { getUserContent, deleteContent, updateCreatorContent } from '@/services/firestore'; // Import service functions
import { deleteFile, getFilePathFromURL } from '@/services/storage'; // Import storage delete
import { Timestamp } from 'firebase/firestore'; // Import Timestamp
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Loader2, DollarSign, Eye, ThumbsUp, MessageSquare } from 'lucide-react'; // Import a spinner icon and other icons
import { StatCard } from '@/components/common/StatCard'; // Import the memoized StatCard
import { SkeletonDashboard, SkeletonContentList } from '@/components/common/Skeleton'; // Import skeleton loaders

// Define the ContentItem type matching ContentListProps
interface ContentItem {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledDate: string | null;
  platforms: string[];
  createdAt: any; // Adjust type as needed, Date or string
}

export default function DashboardPage() {
  const { user, userProfile, loading: authLoading, logOut, getIdToken } = useAuth();
  const router = useRouter();
  const [contentItems, setContentItems] = useState<Content[]>([]);
  const [contentLoading, setContentLoading] = useState(true); 
  const [contentError, setContentError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch content data when user is loaded
  useEffect(() => {
    const fetchContent = async () => {
      if (user && !authLoading) {
        setContentLoading(true);
        setContentError(null);
        try {
          console.log(`Fetching content for user: ${user.uid}`);
          const data = await getUserContent(user.uid);
          
          const formattedData = data.map(item => ({
              ...item,
          }));
          
          setContentItems(formattedData);
          console.log(`Fetched ${data.length} items.`);
        } catch (error: any) {
          console.error('Failed to fetch content:', error);
          setContentError(error.message || 'Failed to load your content.');
          toast.error(error.message || 'Failed to load your content.');
        } finally {
          setContentLoading(false);
        }
      }
    };

    fetchContent();
  }, [user, authLoading]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error (e.g., show a notification)
    }
  };

  // Placeholder action handlers
  const handleEdit = (id: string) => {
    if (!id) return;
    console.log('Edit content:', id);
    router.push(`/dashboard/edit/${id}`); // Navigate to an edit page (needs creation)
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!user || !contentId) return;
    if (!confirm(`Are you sure you want to delete this content? This action cannot be undone.`)) {
        return;
    }
    
    const toastId = toast.loading('Deleting content...');
    try {
        const token = await getIdToken();
        if (!token) throw new Error('Authentication token not available.');

        // Call the backend DELETE endpoint
        const response = await fetch(`/api/content/${contentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try parsing JSON error
            throw new Error(errorData.error || `Failed to delete content (Status: ${response.status})`);
        }
        
        const result = await response.json(); // Get success message
        toast.success(result.message || 'Content deleted successfully', { id: toastId });
        
        // Update UI optimistically or refetch
        setContentItems(prev => prev.filter(c => c.id !== contentId)); 
        // fetchContent(); // Optionally refetch instead of optimistic update

    } catch (err: any) {
        console.error('Failed to delete content:', err);
        toast.error(`Error deleting content: ${err.message || 'Unknown error'}`, { id: toastId });
    }
  };
  
  // Refactor handlePublishContent to navigate to Edit page for publishing action
  const handlePublishContent = (contentId: string) => {
      router.push(`/dashboard/edit/${contentId}`); 
      // Optional: Add query param? router.push(`/dashboard/edit/${contentId}?action=publish`);
      // Toast info removed as action is navigation now
  };

  // Handle content liking
  const handleLikeContent = async (contentId: string) => {
      // Optimistic UI Update
      setContentItems(prevItems => 
          prevItems.map(item => 
              item.id === contentId 
                  ? { ...item, likes: (item.likes || 0) + 1 } 
                  : item
          )
      );

      try {
          const response = await fetch(`/api/content/${contentId}/like`, {
              method: 'POST',
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || `Failed to like content (Status: ${response.status})`);
          }
          // No success toast needed for a simple like, usually
          console.log(`Successfully liked content ${contentId}`);

      } catch (err: any) {
          console.error(`Failed to like content ${contentId}:`, err);
          toast.error(`Failed to like content: ${err.message}`);
          // Revert optimistic update on error
          setContentItems(prevItems => 
              prevItems.map(item => 
                  item.id === contentId 
                      ? { ...item, likes: Math.max(0, (item.likes || 1) - 1) } // Decrement safely
                      : item
              )
          );
      }
  };

  // Calculate aggregate stats (client-side for now)
  const totalViews = contentItems.reduce((sum, item) => sum + (item.views || 0), 0);
  const totalLikes = contentItems.reduce((sum, item) => sum + (item.likes || 0), 0);
  const totalComments = contentItems.reduce((sum, item) => sum + (item.commentsCount || 0), 0);
  // Placeholder for earnings aggregation
  const totalEarnings = contentItems.reduce((sum, item) => {
      let itemTotal = 0;
      if (item.estimatedEarnings) {
          itemTotal = Object.values(item.estimatedEarnings).reduce((s, e) => s + e, 0);
      }
      return sum + itemTotal;
  }, 0).toFixed(2);

  // Show loading state or placeholder if auth loading or no user yet
  if (authLoading || !user) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  // Display dashboard content
  return (
    <div className="min-h-screen pt-24 px-4 pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="glass-card p-8 md:p-12 bg-gradient-to-br from-primary-50/50 via-transparent to-accent-50/30">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-accent-400/10 to-primary-400/10 rounded-full blur-2xl" />
            
            <div className="relative flex flex-col md:flex-row md:items-center justify-between">
              <div className="space-y-4 mb-6 md:mb-0">
                <div className="inline-flex items-center space-x-2 glass-light px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-surface-600">
                    {currentTime.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </span>
                </div>
                
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-surface-900 mb-2">
                    {greeting}, <span className="bg-gradient-primary bg-clip-text text-transparent">
                      {userProfile?.displayName || user.displayName || 'Creator'}
                    </span>
                  </h1>
                  <p className="text-lg text-surface-600">
                    Ready to create something amazing today?
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard/create">
                  <Button 
                    variant="primary" 
                    size="lg"
                    glow
                    className="group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Content
                  </Button>
                </Link>
                
                <Button 
                  variant="glass" 
                  size="lg"
                  className="group"
                >
                  <BarChart3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Views" 
            value={contentLoading ? '-' : totalViews.toLocaleString()} 
            icon={Eye}
            trend={contentLoading ? undefined : Math.floor(Math.random() * 20) + 5}
            subtitle="This month"
            color="primary"
            className="animate-fade-in-up"
          />
          <StatCard 
            title="Total Likes" 
            value={contentLoading ? '-' : totalLikes.toLocaleString()} 
            icon={ThumbsUp}
            trend={contentLoading ? undefined : Math.floor(Math.random() * 15) + 3}
            subtitle="This month"
            color="success"
            className="animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          />
          <StatCard 
            title="Total Comments" 
            value={contentLoading ? '-' : totalComments.toLocaleString()} 
            icon={MessageSquare}
            trend={contentLoading ? undefined : Math.floor(Math.random() * 25) + 8}
            subtitle="This month" 
            color="info"
            className="animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          />
          <StatCard 
            title="Estimated Earnings" 
            value={contentLoading ? '-' : `$${totalEarnings}`} 
            icon={DollarSign}
            trend={contentLoading ? undefined : Math.floor(Math.random() * 30) + 10}
            subtitle="This month"
            color="accent"
            className="animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          />
        </div>

        {/* Content Overview */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-surface-900">Your Content</h2>
                <p className="text-surface-600 mt-1">Manage and track your content performance</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  Filter
                </Button>
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </Button>
              </div>
            </div>

            {/* Content Loading/Error/List Section */}
            <div className="glass-card">
              {contentLoading ? (
                <div className="p-8">
                  <SkeletonContentList />
                </div>
              ) : contentError ? (
                <div className="p-8 text-center">
                  <div className="glass-light rounded-2xl p-6 max-w-md mx-auto">
                    <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">Error Loading Content</h3>
                    <p className="text-surface-600 text-sm mb-4">{contentError}</p>
                    <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : contentItems.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="glass-light rounded-3xl p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-surface-900 mb-3">No Content Yet</h3>
                    <p className="text-surface-600 mb-6">Start creating amazing content to engage your audience</p>
                    <Link href="/dashboard/create">
                      <Button variant="primary" glow>
                        Create Your First Content
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <ContentList 
                    items={contentItems.map(item => ({ 
                      ...item,
                      createdAt: item.createdAt?.toDate().toLocaleTimeString(),
                      scheduledDate: item.scheduledDate?.toDate().toLocaleTimeString() || null,
                      publishDate: item.publishDate?.toDate().toLocaleTimeString() || null
                    }))} 
                    onEdit={handleEdit}
                    onDelete={handleDeleteContent}
                    onPublish={handlePublishContent}
                    onLike={handleLikeContent}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/dashboard/create" className="block">
                  <div className="flex items-center space-x-3 p-3 rounded-xl hover:glass-light transition-all duration-200 group">
                    <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-surface-900">New Content</div>
                      <div className="text-sm text-surface-500">Create fresh content</div>
                    </div>
                  </div>
                </Link>

                <Link href="/analytics" className="block">
                  <div className="flex items-center space-x-3 p-3 rounded-xl hover:glass-light transition-all duration-200 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-surface-900">Analytics</div>
                      <div className="text-sm text-surface-500">View performance</div>
                    </div>
                  </div>
                </Link>

                <Link href="/settings" className="block">
                  <div className="flex items-center space-x-3 p-3 rounded-xl hover:glass-light transition-all duration-200 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-surface-900">Settings</div>
                      <div className="text-sm text-surface-500">Manage account</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">Today's Views</span>
                  <span className="font-semibold text-surface-900">
                    {contentLoading ? '-' : Math.floor(totalViews * 0.1).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">Engagement Rate</span>
                  <span className="font-semibold text-emerald-600">
                    {contentLoading ? '-' : `${Math.floor(Math.random() * 15) + 5}%`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">Avg. Watch Time</span>
                  <span className="font-semibold text-surface-900">
                    {contentLoading ? '-' : `${Math.floor(Math.random() * 30) + 15}s`}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips & Insights */}
            <div className="glass-card p-6 bg-gradient-to-br from-accent-50/30 to-primary-50/20">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-surface-900">Tips</h3>
              </div>
              <div className="space-y-3">
                <div className="glass-light rounded-xl p-4">
                  <h4 className="font-medium text-surface-900 mb-1">Post Consistently</h4>
                  <p className="text-sm text-surface-600">
                    Regular posting helps maintain audience engagement and improves algorithm visibility.
                  </p>
                </div>
                <div className="glass-light rounded-xl p-4">
                  <h4 className="font-medium text-surface-900 mb-1">Optimize Timing</h4>
                  <p className="text-sm text-surface-600">
                    Your audience is most active between 2-4 PM. Schedule your content accordingly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 