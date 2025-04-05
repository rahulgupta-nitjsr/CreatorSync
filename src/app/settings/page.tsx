'use client';

import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

type SettingsTab = 'profile' | 'account' | 'notifications' | 'billing' | 'api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Profile settings form state
  const [profileForm, setProfileForm] = useState({
    name: 'John Doe',
    bio: 'Content creator and digital marketer',
    website: 'https://example.com',
    twitter: '@johndoe',
    instagram: '@johndoe'
  });
  
  // Account settings form state
  const [accountForm, setAccountForm] = useState({
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Notification settings form state
  const [notificationSettings, setNotificationSettings] = useState({
    emailDigest: true,
    contentComments: true,
    newFollowers: true,
    contentPerformance: true,
    productUpdates: false,
    marketingEmails: false
  });
  
  // Billing settings
  const [billingPlan, setBillingPlan] = useState('pro');
  
  // API settings
  const [apiKey, setApiKey] = useState('sk_test_1234567890abcdef');
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Would save to Firebase here
    console.log('Saving profile:', profileForm);
    
    setSuccessMessage('Profile updated successfully');
    setLoading(false);
  };
  
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    
    // Validate passwords
    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Would update account in Firebase here
    console.log('Updating account:', accountForm);
    
    setSuccessMessage('Account updated successfully');
    setLoading(false);
    setAccountForm(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };
  
  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Would save to Firebase here
    console.log('Saving notification preferences:', notificationSettings);
    
    setSuccessMessage('Notification preferences updated successfully');
    setLoading(false);
  };
  
  const generateNewApiKey = async () => {
    setLoading(true);
    setSuccessMessage(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a random API key
    const newKey = 'sk_test_' + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    
    setSuccessMessage('New API key generated successfully');
    setLoading(false);
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <Input
                id="name"
                name="name"
                label="Full Name"
                value={profileForm.name}
                onChange={handleProfileChange}
                required
                fullWidth
              />
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={profileForm.bio}
                onChange={handleProfileChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                Brief description for your profile. URLs are hyperlinked.
              </p>
            </div>
            
            <div>
              <Input
                id="website"
                name="website"
                label="Website"
                type="url"
                placeholder="https://"
                value={profileForm.website}
                onChange={handleProfileChange}
                fullWidth
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Input
                  id="twitter"
                  name="twitter"
                  label="Twitter"
                  placeholder="@username"
                  value={profileForm.twitter}
                  onChange={handleProfileChange}
                  fullWidth
                />
              </div>
              <div>
                <Input
                  id="instagram"
                  name="instagram"
                  label="Instagram"
                  placeholder="@username"
                  value={profileForm.instagram}
                  onChange={handleProfileChange}
                  fullWidth
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" isLoading={loading}>
                Save Profile
              </Button>
            </div>
          </form>
        );
        
      case 'account':
        return (
          <form onSubmit={handleAccountSubmit} className="space-y-6">
            <div>
              <Input
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={accountForm.email}
                onChange={handleAccountChange}
                required
                fullWidth
              />
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
              <p className="mt-1 text-sm text-gray-500">
                Leave blank if you don't want to change your password.
              </p>
              
              <div className="mt-6 space-y-6">
                <div>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    value={accountForm.currentPassword}
                    onChange={handleAccountChange}
                    fullWidth
                  />
                </div>
                
                <div>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    type="password"
                    value={accountForm.newPassword}
                    onChange={handleAccountChange}
                    fullWidth
                  />
                </div>
                
                <div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    value={accountForm.confirmPassword}
                    onChange={handleAccountChange}
                    fullWidth
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Danger Zone</h3>
              <div className="mt-4">
                <Button type="button" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" isLoading={loading}>
                Update Account
              </Button>
            </div>
          </form>
        );
        
      case 'notifications':
        return (
          <form onSubmit={handleNotificationSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Email Notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage the emails you want to receive
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailDigest"
                      name="emailDigest"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={notificationSettings.emailDigest}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailDigest" className="font-medium text-gray-700">Weekly Digest</label>
                    <p className="text-gray-500">Get a weekly summary of your account activity</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="contentComments"
                      name="contentComments"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={notificationSettings.contentComments}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="contentComments" className="font-medium text-gray-700">Content Comments</label>
                    <p className="text-gray-500">Get notified when someone comments on your content</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="newFollowers"
                      name="newFollowers"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={notificationSettings.newFollowers}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="newFollowers" className="font-medium text-gray-700">New Followers</label>
                    <p className="text-gray-500">Get notified when someone follows you</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="contentPerformance"
                      name="contentPerformance"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={notificationSettings.contentPerformance}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="contentPerformance" className="font-medium text-gray-700">Content Performance</label>
                    <p className="text-gray-500">Get insights about your content performance</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Marketing Emails</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="productUpdates"
                      name="productUpdates"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={notificationSettings.productUpdates}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="productUpdates" className="font-medium text-gray-700">Product Updates</label>
                    <p className="text-gray-500">Get emails about new features and improvements</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="marketingEmails"
                      name="marketingEmails"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={notificationSettings.marketingEmails}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="marketingEmails" className="font-medium text-gray-700">Marketing Emails</label>
                    <p className="text-gray-500">Get emails about promotions and special offers</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" isLoading={loading}>
                Save Preferences
              </Button>
            </div>
          </form>
        );
        
      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Current Plan</h3>
              <div className="mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-medium text-blue-700">Pro Plan</span>
                    <p className="text-sm text-blue-600">$19/month, billed monthly</p>
                  </div>
                  <Button variant="outline">
                    Change Plan
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Method</h3>
              <div className="mt-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2H4zm0 2h16v12H4V6zm2 3h12v2H6V9zm0 4h6v2H6v-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <span className="text-sm font-medium text-gray-700">Visa ending in 4242</span>
                      <p className="text-sm text-gray-500">Expires 12/2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Billing History</h3>
              <div className="mt-4">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Mar 1, 2023
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          $19.00
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a href="#" className="text-blue-600 hover:text-blue-900">
                            Download
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Feb 1, 2023
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          $19.00
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a href="#" className="text-blue-600 hover:text-blue-900">
                            Download
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">API Access</h3>
              <p className="mt-1 text-sm text-gray-500">
                Use these credentials to access the CreatorSync API
              </p>
              
              <div className="mt-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">API Key</span>
                      <div className="mt-1 flex items-center">
                        <input
                          type="password"
                          value={apiKey}
                          readOnly
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-100"
                        />
                        <button
                          type="button"
                          className="ml-2 p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => {
                            navigator.clipboard.writeText(apiKey);
                            alert('API key copied to clipboard');
                          }}
                        >
                          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <Button
                      onClick={generateNewApiKey}
                      isLoading={loading}
                      variant="outline"
                    >
                      Generate New Key
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Last generated: March 15, 2023
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">API Documentation</h3>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Check out our comprehensive API documentation to learn how to integrate with CreatorSync.
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View API Docs
                  </a>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Rate Limits</h3>
              <div className="mt-4">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Endpoint
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate Limit
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Usage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Content API
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          100 requests/min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          12%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Analytics API
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          50 requests/min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          5%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          User API
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          200 requests/min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          8%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
      
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <nav className="flex flex-col">
              <button
                className={`px-4 py-3 text-left ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`px-4 py-3 text-left ${activeTab === 'account' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('account')}
              >
                Account
              </button>
              <button
                className={`px-4 py-3 text-left ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications
              </button>
              <button
                className={`px-4 py-3 text-left ${activeTab === 'billing' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('billing')}
              >
                Billing
              </button>
              <button
                className={`px-4 py-3 text-left ${activeTab === 'api' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('api')}
              >
                API
              </button>
            </nav>
          </div>
        </div>
        
        <div className="flex-1">
          <Card>
            <div className="p-6">
              {renderTabContent()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 