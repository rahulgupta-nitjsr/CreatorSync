'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import Link from 'next/link';

export default function ProfilePage() {
  // Mock user data
  const user = {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    bio: 'Content creator, digital marketer, and tech enthusiast. Sharing insights on growing your audience and monetizing your content.',
    avatar: 'https://i.pravatar.cc/150?img=8',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    stats: {
      followers: 1245,
      following: 342,
      content: 47
    },
    social: {
      twitter: 'johndoe',
      instagram: 'johndoe',
      youtube: 'johndoecreator',
      website: 'https://johndoe.com'
    },
    joinedDate: 'March 2022'
  };
  
  // Mock content data
  const featuredContent = [
    {
      id: '1',
      title: 'How to Grow Your Audience',
      type: 'article',
      thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
      views: 5421,
      date: '2 weeks ago'
    },
    {
      id: '2',
      title: 'Advanced Video Editing Techniques',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
      views: 3520,
      date: '3 weeks ago'
    },
    {
      id: '3',
      title: 'Interview with Top Industry Expert',
      type: 'podcast',
      thumbnail: 'https://images.unsplash.com/photo-1582042723066-00e0e7f29960?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
      views: 928,
      date: '1 month ago'
    }
  ];
  
  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Cover image and profile header */}
      <div className="relative">
        <div className="h-64 sm:h-80 w-full bg-gray-200 overflow-hidden">
          <img 
            src={user.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-24">
            <div className="flex items-end">
              <div className="flex-shrink-0 mr-5">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-white object-cover"
                />
              </div>
              
              <div className="flex-1 pb-5">
                <div className="flex flex-col-reverse justify-between sm:flex-row sm:items-end">
                  <div className="mt-4 sm:mt-0">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{user.name}</h1>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                  <div className="flex space-x-3">
                    <Button>
                      Follow
                    </Button>
                    <Button variant="outline">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Message
                    </Button>
                    <Link href="/settings">
                      <Button variant="outline">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar */}
          <div className="lg:w-1/3">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 mb-6">
                  {user.bio}
                </p>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Joined {user.joinedDate}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-base font-medium text-gray-900 mb-3">Social Media</h3>
                  
                  {user.social.twitter && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <svg className="h-5 w-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      <a href={`https://twitter.com/${user.social.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        @{user.social.twitter}
                      </a>
                    </div>
                  )}
                  
                  {user.social.instagram && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <svg className="h-5 w-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                      <a href={`https://instagram.com/${user.social.instagram}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        @{user.social.instagram}
                      </a>
                    </div>
                  )}
                  
                  {user.social.youtube && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <svg className="h-5 w-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <a href={`https://youtube.com/${user.social.youtube}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {user.social.youtube}
                      </a>
                    </div>
                  )}
                  
                  {user.social.website && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <a href={user.social.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {user.social.website.replace(/(^\w+:|^)\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Card>
            
            <Card className="mt-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Stats</h2>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{user.stats.followers.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{user.stats.following.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{user.stats.content.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Content</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:flex-1">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Featured Content</h2>
                  <Link href="/content">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredContent.map((content) => (
                    <div key={content.id} className="group">
                      <div className="aspect-w-16 aspect-h-9 mb-3 overflow-hidden rounded-lg relative">
                        <img 
                          src={content.thumbnail} 
                          alt={content.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200 ease-in-out"
                        />
                        {content.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-50 rounded-full p-3">
                              <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                        {content.type === 'podcast' && (
                          <div className="absolute bottom-2 left-2">
                            <div className="bg-black bg-opacity-50 rounded-full px-2 py-1">
                              <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <h3 className="text-base font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                        {content.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="capitalize mr-2">{content.type}</span>
                        <span>•</span>
                        <span className="ml-2 flex items-center">
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          {content.views.toLocaleString()}
                        </span>
                        <span className="ml-2">•</span>
                        <span className="ml-2">{content.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            <Card className="mt-6">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h2>
                
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{user.name}</span>
                        <span className="text-gray-500"> published a new article </span>
                        <span className="font-medium text-gray-900">How to Grow Your Audience</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        2 days ago
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{user.name}</span>
                        <span className="text-gray-500"> reached </span>
                        <span className="font-medium text-gray-900">1000+ followers</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        1 week ago
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{user.name}</span>
                        <span className="text-gray-500"> uploaded a new video </span>
                        <span className="font-medium text-gray-900">Advanced Video Editing Techniques</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        2 weeks ago
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                    View more activity
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 