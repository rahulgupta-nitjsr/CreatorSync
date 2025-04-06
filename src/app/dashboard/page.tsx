'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { ContentList } from '@/components/content/ContentList';
import { Content } from '@/models/content'; // Use the Content model
import { getUserContent, deleteContent, updateCreatorContent } from '@/services/firestore.service'; // Import service functions
import { deleteFile, getFilePathFromURL } from '@/services/storage.service'; // Import storage delete
import { Timestamp } from 'firebase/firestore'; // Import Timestamp
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Loader2, DollarSign, Eye, ThumbsUp, MessageSquare } from 'lucide-react'; // Import a spinner icon and other icons
import { StatCard } from '@/components/common/StatCard'; // Import the memoized StatCard

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
  const { user, userProfile, loading: authLoading, logOut, getIdToken } = useAuth(); // Renamed loading
  const router = useRouter();
  const [contentItems, setContentItems] = useState<Content[]>([]); // Use Content[] type
  const [contentLoading, setContentLoading] = useState(true); 
  const [contentError, setContentError] = useState<string | null>(null); // State for content fetch error

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
          
          // Convert Firestore Timestamps to ISO strings for ContentList compatibility (if needed)
          // OR update ContentList to handle Timestamps directly
          const formattedData = data.map(item => ({
              ...item,
              // Keep original Timestamps if ContentList can handle them, otherwise format
              // createdAt: item.createdAt?.toDate().toISOString(), 
              // scheduledDate: item.scheduledDate?.toDate().toISOString() || null,
              // publishDate: item.publishDate?.toDate().toISOString() || null
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
  }, [user, authLoading]); // Re-run when user or authLoading state changes

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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-4" />
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  // Display dashboard content
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div>
             <Link href="/dashboard/create" passHref>
               <Button 
                 variant="primary" 
                 className="mr-2"
               >
                 Create New Content
               </Button>
             </Link>
             <Button onClick={handleLogout} variant="outline">
               Log Out
             </Button>
          </div>
      </div>

      <p className="mb-6">Welcome, {userProfile?.displayName || user.email}!</p>
      
      {/* Stats Overview Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
         <StatCard title="Total Views" value={contentLoading ? '-' : totalViews} icon={Eye} />
         <StatCard title="Total Likes" value={contentLoading ? '-' : totalLikes} icon={ThumbsUp} />
         <StatCard title="Total Comments" value={contentLoading ? '-' : totalComments} icon={MessageSquare} />
         <StatCard title="Est. Earnings" value={contentLoading ? '-' : `$${totalEarnings}`} icon={DollarSign} />
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Content</h2>

      {/* Content Loading/Error/List Section */}
      {contentLoading ? (
        <div className="flex flex-col items-center justify-center p-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-4" />
          <p className="text-gray-500">Loading content...</p>
        </div>
      ) : contentError ? (
        <div className="text-center p-6 bg-red-100 rounded-lg text-red-700" role="alert">
          Error loading content: {contentError}
        </div>
      ) : (
        <ContentList 
          items={contentItems.map(item => ({ // Format data for ContentList
            ...item,
            createdAt: item.createdAt?.toDate().toLocaleTimeString(), // Example formatting
            scheduledDate: item.scheduledDate?.toDate().toLocaleTimeString() || null,
            publishDate: item.publishDate?.toDate().toLocaleTimeString() || null
          }))} 
          onEdit={handleEdit}
          onDelete={handleDeleteContent}
          onPublish={handlePublishContent}
          onLike={handleLikeContent}
        />
      )}
      
    </div>
  );
} 