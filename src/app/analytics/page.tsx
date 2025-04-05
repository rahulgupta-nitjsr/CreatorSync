'use client';

import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

type TimeRange = '7d' | '30d' | '90d' | '12m' | 'all';
type AnalyticsTab = 'overview' | 'content' | 'audience' | 'revenue';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  
  // Mock data for analytics
  const overviewStats = {
    views: 24789,
    viewsChange: 12.5,
    engagement: 3254,
    engagementChange: 8.2,
    followers: 1543,
    followersChange: 4.7,
    revenue: 2890,
    revenueChange: 15.3,
  };
  
  const topContent = [
    { id: 1, title: 'How to Grow Your Audience', views: 5421, engagement: 423, revenue: 320 },
    { id: 2, title: '10 Tips for Better Content', views: 4210, engagement: 312, revenue: 280 },
    { id: 3, title: 'Creating Engaging Videos', views: 3567, engagement: 287, revenue: 210 },
    { id: 4, title: 'Monetization Strategies', views: 2943, engagement: 198, revenue: 175 },
    { id: 5, title: 'Building Your Brand', views: 2420, engagement: 176, revenue: 150 },
  ];
  
  const audienceData = {
    demographics: [
      { age: '18-24', percentage: 22 },
      { age: '25-34', percentage: 38 },
      { age: '35-44', percentage: 25 },
      { age: '45-54', percentage: 10 },
      { age: '55+', percentage: 5 },
    ],
    locations: [
      { country: 'United States', percentage: 45 },
      { country: 'United Kingdom', percentage: 15 },
      { country: 'Canada', percentage: 12 },
      { country: 'Australia', percentage: 8 },
      { country: 'Germany', percentage: 6 },
      { country: 'Other', percentage: 14 },
    ],
    platforms: [
      { name: 'Mobile', percentage: 68 },
      { name: 'Desktop', percentage: 24 },
      { name: 'Tablet', percentage: 8 },
    ],
  };
  
  const revenueData = {
    streams: [
      { name: 'Subscriptions', amount: 1450, percentage: 50 },
      { name: 'One-time Purchases', amount: 870, percentage: 30 },
      { name: 'Affiliate', amount: 435, percentage: 15 },
      { name: 'Donations', amount: 145, percentage: 5 },
    ],
    monthly: [
      { month: 'Jan', amount: 1800 },
      { month: 'Feb', amount: 2100 },
      { month: 'Mar', amount: 2400 },
      { month: 'Apr', amount: 2200 },
      { month: 'May', amount: 2600 },
      { month: 'Jun', amount: 2900 },
    ],
  };
  
  const renderStatCard = (title: string, value: number | string, change: number, prefix: string = '') => (
    <Card>
      <div className="px-4 py-5 sm:p-6">
        <div className="text-sm font-medium text-gray-500 truncate">
          {title}
        </div>
        <div className="mt-1 text-3xl font-semibold text-gray-900">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="mt-2">
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 ml-2">
            vs previous period
          </span>
        </div>
      </div>
    </Card>
  );
  
  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {renderStatCard('Total Views', overviewStats.views, overviewStats.viewsChange)}
        {renderStatCard('Engagement', overviewStats.engagement, overviewStats.engagementChange)}
        {renderStatCard('Followers', overviewStats.followers, overviewStats.followersChange)}
        {renderStatCard('Revenue', overviewStats.revenue, overviewStats.revenueChange, '$')}
      </div>
      
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Audience Growth</h3>
        <Card>
          <div className="p-6">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-center">
                [Chart Placeholder]<br/>
                Line chart showing audience growth over time
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Top Performing Content</h3>
        <Card>
          <div className="overflow-x-auto">
            <div className="align-middle inline-block min-w-full">
              <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Engagement
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topContent.map((content) => (
                      <tr key={content.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{content.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{content.views.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{content.engagement.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${content.revenue.toLocaleString()}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
  
  const renderContentTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {renderStatCard('Total Content', 47, 12.8)}
        {renderStatCard('Avg. View Duration', '3:24', 5.2)}
        {renderStatCard('Completion Rate', '68%', -2.1)}
      </div>
      
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Content Performance</h3>
        <Card>
          <div className="p-6">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-center">
                [Chart Placeholder]<br/>
                Bar chart showing performance metrics by content type
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Content Engagement</h3>
        <Card>
          <div className="p-6">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-center">
                [Chart Placeholder]<br/>
                Line chart showing engagement metrics over time
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Content Publication</h3>
        <Card>
          <div className="p-6">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-center">
                [Chart Placeholder]<br/>
                Calendar heat map showing content publication frequency
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
  
  const renderAudienceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {renderStatCard('Total Audience', 1543, 4.7)}
        {renderStatCard('Engagement Rate', '13.1%', 2.3)}
        {renderStatCard('Subscribers', 487, 8.5)}
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Age Demographics</h3>
          <Card>
            <div className="p-6">
              <div className="space-y-4">
                {audienceData.demographics.map((item) => (
                  <div key={item.age}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{item.age}</span>
                      <span className="text-gray-900 font-medium">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Geographic Distribution</h3>
          <Card>
            <div className="p-6">
              <div className="space-y-4">
                {audienceData.locations.map((item) => (
                  <div key={item.country}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{item.country}</span>
                      <span className="text-gray-900 font-medium">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Platforms</h3>
        <Card>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {audienceData.platforms.map((platform) => (
                <div key={platform.name} className="text-center">
                  <div className="relative h-24 mb-4">
                    <div 
                      className="absolute bottom-0 inset-x-0 bg-purple-500 rounded-t-lg"
                      style={{ height: `${platform.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                  <div className="text-sm text-gray-500">{platform.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
  
  const renderRevenueTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {renderStatCard('Total Revenue', 2890, 15.3, '$')}
        {renderStatCard('Avg. Revenue per User', 1.87, 4.2, '$')}
        {renderStatCard('MoM Growth', '12.4%', 3.1)}
      </div>
      
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Revenue Streams</h3>
        <Card>
          <div className="p-6">
            <div className="space-y-4">
              {revenueData.streams.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-900 font-medium">${item.amount} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Monthly Revenue</h3>
        <Card>
          <div className="p-6">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-center">
                [Chart Placeholder]<br/>
                Bar chart showing monthly revenue
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-6 gap-2">
              {revenueData.monthly.map((item) => (
                <div key={item.month} className="text-center">
                  <div className="text-xs font-medium text-gray-500">{item.month}</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">${item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Revenue Forecasting</h3>
        <Card>
          <div className="p-6">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-center">
                [Chart Placeholder]<br/>
                Line chart showing revenue forecasting
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
  
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'content':
        return renderContentTab();
      case 'audience':
        return renderAudienceTab();
      case 'revenue':
        return renderRevenueTab();
      default:
        return renderOverviewTab();
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Insights and statistics about your content performance and audience
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <span className="text-sm text-gray-500">Time Range:</span>
          <div className="relative z-0 inline-flex shadow-sm rounded-md">
            <button
              type="button"
              className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-l-md ${
                timeRange === '7d' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
              onClick={() => setTimeRange('7d')}
            >
              7D
            </button>
            <button
              type="button"
              className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium ${
                timeRange === '30d' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
              onClick={() => setTimeRange('30d')}
            >
              30D
            </button>
            <button
              type="button"
              className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium ${
                timeRange === '90d' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
              onClick={() => setTimeRange('90d')}
            >
              90D
            </button>
            <button
              type="button"
              className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium ${
                timeRange === '12m' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
              onClick={() => setTimeRange('12m')}
            >
              12M
            </button>
            <button
              type="button"
              className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-r-md ${
                timeRange === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
              onClick={() => setTimeRange('all')}
            >
              All
            </button>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="ml-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            Export
          </Button>
        </div>
      </div>
      
      <div className="mb-6 bg-white border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'audience'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('audience')}
          >
            Audience
          </button>
          
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'revenue'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('revenue')}
          >
            Revenue
          </button>
        </nav>
      </div>
      
      {renderActiveTabContent()}
    </div>
  );
} 