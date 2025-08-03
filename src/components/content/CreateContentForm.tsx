'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { FormErrorMessage } from '@/components/common/FormErrorMessage';
import { validateContent, ValidationError } from '@/utils/validation';
import { useAuth } from '@/contexts/AuthContext';
import { createContent } from '@/services/firestore.service';
import { uploadFile } from '@/services/storage.service';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface CreateContentFormData {
  title: string;
  description: string;
  platforms: string[];
  scheduledDate: string | null;
  status: 'draft' | 'scheduled' | 'published';
  file?: File;
}

export const CreateContentForm: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const [formData, setFormData] = useState<CreateContentFormData>({
    title: '',
    description: '',
    platforms: [],
    scheduledDate: null,
    status: 'draft'
  });

  const handleInputChange = (field: keyof CreateContentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field when user starts typing
    setValidationErrors(prev => prev.filter(error => error.field !== field));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      setValidationErrors(prev => prev.filter(error => error.field !== 'file'));
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
    setValidationErrors(prev => prev.filter(error => error.field !== 'platforms'));
  };

  const validateForm = (): boolean => {
    const validation = validateContent(formData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting.');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to create content.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating content...');

    try {
      let fileUrl = '';
      
      // Upload file if provided
      if (formData.file) {
        fileUrl = await uploadFile(formData.file, `content/${user.uid}/${Date.now()}`);
      }

      // Create content in Firestore
      const contentData = {
        ...formData,
        fileUrl,
        creatorId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        likes: 0,
        commentsCount: 0,
        estimatedEarnings: {}
      };

      await createContent(contentData);
      
      toast.success('Content created successfully!', { id: toastId });
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Failed to create content:', error);
      toast.error(error.message || 'Failed to create content', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasFieldError = (field: string): boolean => {
    return validationErrors.some(error => error.field === field);
  };

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(error => error.field === field)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Content Title *
        </label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter your content title"
          className={hasFieldError('title') ? 'border-red-500' : ''}
          required
        />
        {hasFieldError('title') && (
          <FormErrorMessage message={getFieldError('title')!} />
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your content..."
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasFieldError('description') ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {hasFieldError('description') && (
          <FormErrorMessage message={getFieldError('description')!} />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platforms *
        </label>
        <div className="space-y-2">
          {['TikTok', 'Instagram Reels', 'X (Twitter)'].map((platform) => (
            <label key={platform} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.platforms.includes(platform)}
                onChange={() => handlePlatformToggle(platform)}
                className="mr-2"
              />
              {platform}
            </label>
          ))}
        </div>
        {hasFieldError('platforms') && (
          <FormErrorMessage message={getFieldError('platforms')!} />
        )}
      </div>

      <div>
        <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
          Scheduled Date (Optional)
        </label>
        <Input
          id="scheduledDate"
          type="datetime-local"
          value={formData.scheduledDate || ''}
          onChange={(e) => handleInputChange('scheduledDate', e.target.value || null)}
          className={hasFieldError('scheduledDate') ? 'border-red-500' : ''}
        />
        {hasFieldError('scheduledDate') && (
          <FormErrorMessage message={getFieldError('scheduledDate')!} />
        )}
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
          Upload File (Optional)
        </label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          accept="image/*,video/*"
          className={hasFieldError('file') ? 'border-red-500' : ''}
        />
        {hasFieldError('file') && (
          <FormErrorMessage message={getFieldError('file')!} />
        )}
      </div>

      <div className="flex space-x-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex items-center"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isSubmitting ? 'Creating...' : 'Create Content'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}; 