'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { ProfileCard } from '@/components/user/ProfileCard';

type ValidationErrors = {
  displayName?: string;
};

export default function ProfileSettingsPage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Set initial values from user data when it becomes available
  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);
  
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Display name validation
    if (!displayName.trim()) {
      newErrors.displayName = 'Display name is required';
      isValid = false;
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
      isValid = false;
    } else if (displayName.trim().length > 30) {
      newErrors.displayName = 'Display name must be less than 30 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
    
    // Clear errors when user types
    if (errors.displayName) {
      setErrors({});
    }
    
    // Clear general error and success message when user makes changes
    if (generalError) {
      setGeneralError(null);
    }
    if (success) {
      setSuccess(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setGeneralError(null);
    setSuccess(false);
    
    try {
      await updateProfile({ displayName });
      setSuccess(true);
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setGeneralError('For security reasons, please log out and log in again before changing your profile');
      } else {
        setGeneralError(err.message || 'An error occurred while updating your profile');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            {user && <ProfileCard user={user} showActions={false} />}
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-xl font-semibold mb-6">Update Profile Information</h2>
                
                {generalError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <span className="block sm:inline">{generalError}</span>
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                    <span className="block sm:inline">Profile updated successfully!</span>
                  </div>
                )}
                
                <div className="mb-6">
                  <Input
                    id="displayName"
                    name="displayName"
                    label="Display Name"
                    value={displayName}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={errors.displayName}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    isLoading={loading}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
} 