'use client';

import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import Link from 'next/link';

type ContentType = 'all' | 'article' | 'video' | 'podcast' | 'image';
type ContentStatus = 'all' | 'draft' | 'published' | 'archived';
type SortOption = 'newest' | 'oldest' | 'popular' | 'revenue';

interface ContentItem {
  id: string;
  title: string;
  type: Exclude<ContentType, 'all'>;
  status: Exclude<ContentStatus, 'all'>;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  comments: number;
  isPremium: boolean;
}

export default function ContentManagementPage() {
  const [activeType, setActiveType] = useState<ContentType>('all');
  const [activeStatus, setActiveStatus] = useState<ContentStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Mock content data
  const contentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Getting Started with Content Creation',
      type: 'article',
      status: 'published',
      createdAt: '2023-03-15T10:30:00Z',
      updatedAt: '2023-03-15T14:45:00Z',
      views: 1245,
      likes: 87,
      comments: 32,
      isPremium: false
    },
    {
      id: '2',
      title: 'Advanced Video Editing Techniques',
      type: 'video',
      status: 'published',
      createdAt: '2023-03-10T09:15:00Z',
      updatedAt: '2023-03-12T16:30:00Z',
      views: 3520,
      likes: 215,
      comments: 54,
      isPremium: true
    },
    {
      id: '3',
      title: 'Monetization Strategies for Creators',
      type: 'article',
      status: 'draft',
      createdAt: '2023-03-18T11:00:00Z',
      updatedAt: '2023-03-18T11:00:00Z',
      views: 0,
      likes: 0,
      comments: 0,
      isPremium: true
    },
    {
      id: '4',
      title: 'Interview with Top Industry Expert',
      type: 'podcast',
      status: 'published',
      createdAt: '2023-03-05T15:45:00Z',
      updatedAt: '2023-03-07T09:20:00Z',
      views: 928,
      likes: 63,
      comments: 27,
      isPremium: false
    },
    {
      id: '5',
      title: 'Behind the Scenes Photography',
      type: 'image',
      status: 'archived',
      createdAt: '2023-02-28T13:10:00Z',
      updatedAt: '2023-03-05T10:15:00Z',
      views: 752,
      likes: 41,
      comments: 12,
      isPremium: false
    },
    {
      id: '6',
      title: 'Content Planning for Q2 2023',
      type: 'article',
      status: 'draft',
      createdAt: '2023-03-20T08:30:00Z',
      updatedAt: '2023-03-20T08:30:00Z',
      views: 0,
      likes: 0,
      comments: 0,
      isPremium: false
    },
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const filteredContent = contentItems
    .filter(item => {
      const matchesType = activeType === 'all' || item.type === activeType;
      const matchesStatus = activeStatus === 'all' || item.status === activeStatus;
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesType && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return b.views - a.views;
        case 'revenue':
          // In a real app, you might sort by actual revenue
          // For now, premium content is assumed to generate more revenue
          if (a.isPremium && !b.isPremium) return -1;
          if (!a.isPremium && b.isPremium) return 1;
          return b.views - a.views;
        default:
          return 0;
      }
    });
  
  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  const selectAllItems = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map(item => item.id));
    }
  };
  
  const getStatusColor = (status: Exclude<ContentStatus, 'all'>) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeIcon = (type: Exclude<ContentType, 'all'>) => {
    switch (type) {
      case 'article':
        return (
          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'video':
        return (
          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        );
      case 'podcast':
        return (
          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        );
      case 'image':
        return (
          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize all your content in one place
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link href="/content/create">
            <Button>
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Content
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 lg:mb-0">
              <div className="relative rounded-md shadow-sm max-w-xs mb-4 sm:mb-0 sm:mr-4">
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Type:</span>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={activeType}
                  onChange={(e) => setActiveType(e.target.value as ContentType)}
                >
                  <option value="all">All Types</option>
                  <option value="article">Articles</option>
                  <option value="video">Videos</option>
                  <option value="podcast">Podcasts</option>
                  <option value="image">Images</option>
                </select>
                
                <span className="text-sm text-gray-500">Status:</span>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.value as ContentStatus)}
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Sort by:</span>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
                <option value="revenue">Highest Revenue</option>
              </select>
            </div>
          </div>
          
          {selectedItems.length > 0 && (
            <div className="bg-gray-50 p-4 mb-6 rounded-lg flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  Set Status
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  Set Premium
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <div className="align-middle inline-block min-w-full">
              <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                            onChange={selectAllItems}
                          />
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Content
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContent.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <p className="text-lg font-medium">No content found</p>
                          <p className="text-sm mt-1">Try adjusting your filters or search query</p>
                        </td>
                      </tr>
                    ) : (
                      filteredContent.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleSelectItem(item.id)}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded bg-gray-100">
                                {getTypeIcon(item.type)}
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-gray-900 mr-2">
                                    {item.title}
                                  </div>
                                  {item.isPremium && (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                      Premium
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 capitalize">
                                  {item.type}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>Created: {formatDate(item.createdAt)}</div>
                            <div>Updated: {formatDate(item.updatedAt)}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <svg className="h-4 w-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              {item.views.toLocaleString()}
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                              {item.likes.toLocaleString()}
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                              </svg>
                              {item.comments.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                type="button" 
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                              <button 
                                type="button" 
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Duplicate
                              </button>
                              <button 
                                type="button" 
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredContent.length}</span> results out of <span className="font-medium">{contentItems.length}</span> total
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 