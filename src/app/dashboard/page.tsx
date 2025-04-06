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
  const { user, userProfile, loading: authLoading, logOut } = useAuth(); // Renamed loading
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

  const handleDelete = async (id: string) => {
    if (!id || !confirm('Are you sure you want to delete this content?')) return;
    
    console.log('Deleting content:', id);
    // Find the item to get its mediaUrl for storage deletion
    const itemToDelete = contentItems.find(item => item.id === id);
    
    try {
      // 1. Delete Firestore document
      await deleteContent(id); 
      console.log('Firestore document deleted.');

      // 2. Delete associated media file from Storage (if URL exists)
      if (itemToDelete?.mediaUrl) {
          const filePath = getFilePathFromURL(itemToDelete.mediaUrl);
          if (filePath) {
              console.log('Deleting storage file:', filePath);
              await deleteFile(filePath);
              console.log('Storage file deleted.');
          } else {
              console.warn('Could not extract file path from URL:', itemToDelete.mediaUrl);
          }
      } else {
          console.log('No media URL found for this item, skipping storage deletion.');
      }

      // 3. Update local state
      setContentItems(prevItems => prevItems.filter(item => item.id !== id));
      console.log('Content deleted successfully from UI.');
      
    } catch (error: any) { 
      console.error('Failed to delete content:', error);
      alert(`Error deleting content: ${error.message}`);
      // Note: If deletion fails, UI might be out of sync. Consider refetching.
    }
  };

  const handlePublish = async (id: string) => {
    if (!id) return;
    console.log('Publishing content:', id);
    
    // Optimistic UI update (optional, makes UI feel faster)
    const originalItems = [...contentItems];
    setContentItems(prevItems => prevItems.map(item => 
        item.id === id ? { ...item, status: 'publishing' } : item // Show temporary publishing state
      ));

    try {
      // Data to update in Firestore
      const updateData = {
        status: 'published' as const, // Use 'as const' for type safety
        scheduledDate: null,          // Clear scheduled date
        publishDate: Timestamp.now() // Set publish date to now
      };

      // Call the service function to update Firestore
      await updateCreatorContent(id, updateData);
      console.log('Content published successfully in Firestore.');

      // Update local state again with final data (including publishDate)
      // Note: Firestore Timestamps need handling for display or further use
      setContentItems(prevItems => prevItems.map(item => 
        item.id === id ? { ...item, ...updateData } : item
      ));
      
    } catch (error: any) { 
      console.error('Failed to publish content:', error);
      alert(`Error publishing content: ${error.message}`);
      // Revert optimistic UI update on error
      setContentItems(originalItems);
    }
  };

  // Show loading state or placeholder if auth loading or no user yet
  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Display dashboard content
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div>
             <Button 
               variant="primary" 
               className="mr-2"
               onClick={() => router.push('/dashboard/create')}
             >
               Create New Content
             </Button>
             <Button onClick={handleLogout} variant="outline">
               Log Out
             </Button>
          </div>
      </div>

      <p className="mb-6">Welcome, {userProfile?.displayName || user.email}!</p>
      
      <h2 className="text-xl font-semibold mb-4">Your Content</h2>

      {/* Content Loading/Error/List Section */}
      {contentLoading ? (
        <div className="text-center p-6 bg-gray-100 rounded-lg">Loading content...</div>
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
          onDelete={handleDelete}
          onPublish={handlePublish}
        />
      )}
      
    </div>
  );
} 