'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import FormErrorMessage from '@/components/common/FormErrorMessage';
import { useAuth } from '@/contexts/AuthContext';
import { PlatformConnection } from '@/models/platformConnection';

interface CreateContentFormProps {
  onSubmit: (formData: any) => Promise<void>;
  userId: string;
  isSubmitting?: boolean;
  uploadProgress?: number | null;
}

type ValidationErrors = {
  title?: string;
  description?: string;
  file?: string;
  platforms?: string;
};

export default function CreateContentForm({ 
    onSubmit, 
    userId, 
    isSubmitting = false, 
    uploadProgress = null 
}: CreateContentFormProps) {
  const { platformConnections, loading: authLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  useEffect(() => {
      if (platformConnections.length > 0) {
          setSelectedPlatforms(platformConnections.filter(p => p.connected).map(p => p.id));
      }
  }, [platformConnections]);

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
    if (!file) {
      newErrors.file = 'A media file is required';
      isValid = false;
    }
    const connectedPlatformIds = platformConnections.filter(p => p.connected).map(p => p.id);
    if (selectedPlatforms.filter(pId => connectedPlatformIds.includes(pId)).length === 0) {
      newErrors.platforms = 'Please select at least one connected platform';
      isValid = false;
    }
    if (scheduledDate && isNaN(new Date(scheduledDate).getTime())) {
      newErrors.description = 'Invalid date format for scheduling'; 
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (errors.file) setErrors(prev => ({ ...prev, file: undefined }));
    }
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
    const formData = {
      title,
      description,
      file,
      platforms: selectedPlatforms.filter(pId => 
        platformConnections.some(p => p.id === pId && p.connected)
      ),
      scheduledDate: scheduledDate || null, 
    };
    await onSubmit(formData);
  };

  if (authLoading) {
    return <div className="text-center p-4">Loading platform connections...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <label htmlFor="file" className="block mb-1 text-sm font-medium text-gray-700">
          Media File (Video/Image)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="video/*,image/*"
          onChange={handleFileChange}
          className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
            errors.file ? 'border border-red-500 rounded-md p-1' : ''
          }`}
          required
          disabled={isSubmitting}
        />
        {errors.file && <FormErrorMessage error={errors.file} />}
        {file && !isSubmitting && <p className="mt-1 text-xs text-gray-500">Selected: {file.name}</p>}
        {isSubmitting && uploadProgress !== null && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
                className="bg-blue-600 h-2.5 rounded-full transition-width duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-xs text-center text-gray-600 mt-1">Uploading: {uploadProgress.toFixed(0)}%</p>
          </div>
        )}
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Publish to Platforms
        </label>
        {platformConnections.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No platforms found or connected. Please connect platforms in settings.</p>
        ) : (
            <div className="space-y-2">
            {platformConnections.map(platform => (
                <label key={platform.id} className={`flex items-center p-3 border rounded-md cursor-pointer ${
                platform.connected ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
                }`}>
                <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={() => handlePlatformChange(platform.id)}
                    disabled={!platform.connected || isSubmitting}
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
        )}
        {errors.platforms && <FormErrorMessage error={errors.platforms} />}
      </div>

      <Input
        id="scheduledDate"
        name="scheduledDate"
        label="Schedule (Optional)"
        type="datetime-local"
        value={scheduledDate}
        onChange={(e) => {
            setScheduledDate(e.target.value);
        }}
        fullWidth
        helperText="Leave blank to publish immediately"
        disabled={isSubmitting}
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        fullWidth
      >
        {isSubmitting 
            ? (uploadProgress !== null ? `Uploading (${uploadProgress.toFixed(0)}%)...` : 'Processing...') 
            : (scheduledDate ? 'Schedule Content' : 'Create & Publish Now')}
      </Button>
    </form>
  );
} 