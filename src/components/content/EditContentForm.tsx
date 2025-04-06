'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import FormErrorMessage from '@/components/common/FormErrorMessage';
import { Content } from '@/models/content';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { PlatformConnection } from '@/models/platformConnection';

interface EditContentFormProps {
  initialData: Content;
  onSubmit: (formData: Partial<Omit<Content, 'id' | 'userId' | 'createdAt' | 'mediaUrl' | 'mediaType'>>) => Promise<void>;
  isLoading?: boolean;
}

type ValidationErrors = {
  title?: string;
  description?: string;
  platforms?: string;
  scheduledDate?: string;
};

// Helper to format Timestamp to yyyy-MM-ddTHH:mm for datetime-local input
const formatTimestampForInput = (timestamp: Timestamp | null): string => {
  if (!timestamp) return '';
  try {
    const date = timestamp.toDate();
    // Pad month, day, hours, minutes with leading zeros if needed
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    console.error("Error formatting timestamp:", e);
    return '';
  }
};

export default function EditContentForm({ initialData, onSubmit, isLoading = false }: EditContentFormProps) {
  const { platformConnections, loading: authLoading } = useAuth(); // Get connections

  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialData.platforms || []);
  const [scheduledDate, setScheduledDate] = useState<string>(formatTimestampForInput(initialData.scheduledDate));
  const [status, setStatus] = useState(initialData.status || 'draft');
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Derive available platforms from context for rendering
  const availablePlatforms = platformConnections;

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    const connectedPlatformIds = platformConnections.filter(p => p.connected).map(p => p.id);
    if (selectedPlatforms.filter(pId => connectedPlatformIds.includes(pId)).length === 0) {
      newErrors.platforms = 'Please select at least one connected platform';
      isValid = false;
    }
    if (status === 'scheduled' && !scheduledDate) {
        newErrors.scheduledDate = 'Schedule date is required when status is scheduled.';
        isValid = false;
    } else if (scheduledDate && isNaN(new Date(scheduledDate).getTime())) {
      newErrors.scheduledDate = 'Invalid date format for scheduling';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
    if (errors.platforms) setErrors(prev => ({ ...prev, platforms: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData: Partial<Omit<Content, 'id' | 'userId' | 'createdAt' | 'mediaUrl' | 'mediaType'>> = {
      title,
      description,
      platforms: selectedPlatforms.filter(pId => 
        platformConnections.some(p => p.id === pId && p.connected)
      ),
      status,
      // Convert schedule date string back or handle in service
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null, 
    };

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
       <p className="text-sm text-gray-600">Editing Content ID: {initialData.id}</p>
       {initialData.mediaUrl && (
           <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Media Preview</label>
            {initialData.mediaType === 'image' ? (
                <img src={initialData.mediaUrl} alt="Content media" className="max-h-40 rounded border" />
            ) : initialData.mediaType === 'video' ? (
                <video src={initialData.mediaUrl} controls className="max-h-40 rounded border w-full" />
            ) : (
                <a href={initialData.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Media</a>
            )}
            <p className="text-xs text-gray-500 mt-1">Media cannot be changed here.</p>
           </div>
       )}
       
      <Input
        id="title"
        name="title"
        label="Content Title"
        placeholder="Enter a catchy title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
        }}
        error={errors.title}
        required
        fullWidth
      />

      <div>
        <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
          Description / Caption
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className={`block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            errors.description
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="Write a description or caption for your content..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
          }}
          required
        />
        {errors.description && <FormErrorMessage error={errors.description} />}
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Publish to Platforms
        </label>
        <div className="space-y-2">
          {availablePlatforms.map(platform => (
            <label key={platform.id} className={`flex items-center p-3 border rounded-md cursor-pointer ${
              platform.connected ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
            }`}>
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(platform.id)}
                onChange={() => handlePlatformChange(platform.id)}
                disabled={!platform.connected}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-75"
              />
              <span className={`ml-3 text-sm font-medium ${platform.connected ? 'text-gray-700' : 'text-gray-400'}`}>
                <i className={`${platform.icon} mr-2`}></i>
                {platform.name}
              </span>
              {!platform.connected && <span className="ml-auto text-xs text-gray-400">(Not Connected)</span>}
            </label>
          ))}
        </div>
        {errors.platforms && <FormErrorMessage error={errors.platforms} />}
      </div>

       {/* Status Selection (Optional - depends if user can change status directly) */}
       <div>
         <label htmlFor="status" className="block mb-1 text-sm font-medium text-gray-700">Status</label>
         <select
           id="status"
           name="status"
           value={status}
           onChange={(e) => setStatus(e.target.value as Content['status'])}
           className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
         >
           <option value="draft">Draft</option>
           <option value="scheduled">Scheduled</option>
           {/* Allow setting back to published? Or only via Publish button? */}
           {initialData.status === 'published' && <option value="published">Published</option>}
           {initialData.status === 'failed' && <option value="failed">Failed</option>} 
         </select>
       </div>

      <Input
        id="scheduledDate"
        name="scheduledDate"
        label={`Schedule Date ${status !== 'scheduled' ? '(Only applies if status is Scheduled)' : ''}`}
        type="datetime-local"
        value={scheduledDate}
        onChange={(e) => {
            setScheduledDate(e.target.value);
            if (errors.scheduledDate) setErrors(prev => ({ ...prev, scheduledDate: undefined }));
        }}
        fullWidth
        disabled={status !== 'scheduled'} // Disable if status is not scheduled
        error={errors.scheduledDate}
      />

      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
      >
        Save Changes
      </Button>
    </form>
  );
} 