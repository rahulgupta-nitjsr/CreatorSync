'use client';

import React from 'react';
import Image from 'next/image';
import { User } from 'firebase/auth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

interface ProfileCardProps {
  user: User;
  showActions?: boolean;
  onEditProfile?: () => void;
}

export function ProfileCard({ user, showActions = true, onEditProfile }: ProfileCardProps) {
  return (
    <Card>
      <div className="flex flex-col items-center p-6">
        <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'User profile'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-blue-100 h-full w-full flex items-center justify-center">
              <span className="text-blue-500 text-2xl font-bold">
                {user.displayName?.[0] || user.email?.[0] || '?'}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-1">
          {user.displayName || 'Anonymous User'}
        </h3>
        
        {user.email && (
          <p className="text-gray-500 mb-4">{user.email}</p>
        )}

        {showActions && (
          <div className="mt-4 w-full">
            <Button 
              onClick={onEditProfile} 
              variant="outline" 
              fullWidth
            >
              Edit Profile
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
} 