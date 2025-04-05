'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/contexts/AuthContext';
import { createContent } from '@/firebase/content';
import { AuthGuard } from '@/components/auth/AuthGuard';

type ContentType = 'article' | 'video' | 'podcast' | 'image';

interface ContentFormData {
  title: string;
  description: string;
  contentType: ContentType;
  tags: string[];
  mediaUrl: string;
  isPremium: boolean;
  status: 'draft' | 'published';
}

type FormErrors = {
  title?: string;
  description?: string;
  mediaUrl?: string;
  tags?: string;
};

export default function CreateContentPage() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    contentType: 'article',
    tags: [],
    mediaUrl: '',
    isPremium: false,
    status: 'draft'
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
      isValid = false;
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
      isValid = false;
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
      isValid = false;
    }

    // Media URL validation for video and podcast content
    if ((formData.contentType === 'video' || formData.contentType === 'podcast') && !formData.mediaUrl) {
      newErrors.mediaUrl = `Media URL is required for ${formData.contentType} content`;
      isValid = false;
    } else if (formData.mediaUrl && !isValidUrl(formData.mediaUrl)) {
      newErrors.mediaUrl = 'Please enter a valid URL';
      isValid = false;
    }

    // Tags validation
    if (formData.tags.length === 0) {
      newErrors.tags = 'Please add at least one tag';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Clear general error
    if (generalError) {
      setGeneralError(null);
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleTagAdd = () => {
    if (!tagInput.trim()) return;
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      
      // Clear tag error if tags were previously empty
      if (errors.tags) {
        setErrors(prev => ({
          ...prev,
          tags: undefined
        }));
      }
    }
    setTagInput('');
  };
  
  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setGeneralError(null);
    
    try {
      if (!user) {
        throw new Error('You must be logged in to create content');
      }
      
      // Call Firebase service to save the content
      await createContent({
        ...formData,
        authorId: user.uid,
        createdAt: new Date().toISOString(),
      });
      
      setSuccess(true);
      // Reset form
      setFormData({
        title: '',
        description: '',
        contentType: 'article',
        tags: [],
        mediaUrl: '',
        isPremium: false,
        status: 'draft'
      });
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to create content. Please try again.');
      console.error('Error creating content:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Create New Content</h1>
          <p className="mt-2 text-sm text-gray-500">
            Fill out the form below to create and publish new content for your audience.
          </p>
        </div>
        
        {success ? (
          <Card>
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg 
                  className="h-6 w-6 text-green-600" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Content Created Successfully!</h3>
              <p className="mt-2 text-gray-500">
                Your content has been {formData.status === 'published' ? 'published' : 'saved as a draft'}.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button 
                  onClick={() => setSuccess(false)}
                  variant="outline"
                >
                  Create Another
                </Button>
                <Button>
                  View Content
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              {generalError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 mx-6 mt-6" role="alert">
                  <span className="block sm:inline">{generalError}</span>
                </div>
              )}
              
              <div className="px-6 py-6 space-y-6">
                <h2 className="text-xl font-medium text-gray-900">Basic Information</h2>
                
                <div>
                  <Input
                    id="title"
                    name="title"
                    label="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={errors.title}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md`}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type
                  </label>
                  <select
                    id="contentType"
                    name="contentType"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.contentType}
                    onChange={handleInputChange}
                  >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="podcast">Podcast</option>
                    <option value="image">Image/Photo</option>
                  </select>
                </div>
              </div>
              
              <div className="px-6 py-6 space-y-6">
                <h2 className="text-xl font-medium text-gray-900">Media & Tags</h2>
                
                <div>
                  <Input
                    id="mediaUrl"
                    name="mediaUrl"
                    label="Media URL"
                    placeholder="https://"
                    value={formData.mediaUrl}
                    onChange={handleInputChange}
                    fullWidth
                    error={errors.mediaUrl}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.contentType === 'video' && 'YouTube or Vimeo video URL'}
                    {formData.contentType === 'podcast' && 'SoundCloud or Spotify podcast URL'}
                    {formData.contentType === 'image' && 'Image URL or upload an image'}
                    {formData.contentType === 'article' && 'Featured image URL (optional)'}
                  </p>
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="tags"
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm ${errors.tags ? 'border-red-300' : 'border-gray-300'} rounded-l-md`}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleTagAdd();
                        }
                      }}
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={handleTagAdd}
                    >
                      Add
                    </button>
                  </div>
                  {errors.tags && (
                    <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
                  )}
                  
                  {formData.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <span key={tag} className="inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-blue-100 text-blue-700">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                          >
                            <span className="sr-only">Remove tag {tag}</span>
                            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                              <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-6 space-y-6">
                <h2 className="text-xl font-medium text-gray-900">Publishing Options</h2>
                
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="isPremium"
                      name="isPremium"
                      type="checkbox"
                      checked={formData.isPremium}
                      onChange={handleCheckboxChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isPremium" className="font-medium text-gray-700">Premium Content</label>
                    <p className="text-gray-500">Mark this content as premium (only available to paid subscribers)</p>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="draft">Save as Draft</option>
                    <option value="published">Publish Now</option>
                  </select>
                </div>
              </div>
              
              <div className="px-6 py-4 flex justify-end space-x-3">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  isLoading={loading}
                >
                  {formData.status === 'published' ? 'Publish Content' : 'Save as Draft'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </AuthGuard>
  );
} 