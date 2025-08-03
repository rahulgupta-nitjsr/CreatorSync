'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { StatCard } from '@/components/common/StatCard';
import { getUserContent } from '@/services/firestore';
import { Content } from '@/models/content';
import { 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';
import { SkeletonDashboard } from '@/components/common/Skeleton';

interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalEarnings: number;
  averageEngagement: number;
  topPerformingContent: Content[];
  platformBreakdown: { platform: string; count: number }[];
  weeklyTrends: { date: string; views: number; likes: number }[];
}

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const content = await getUserContent(user.uid);
        
        // Calculate analytics
        const totalViews = content.reduce((sum, item) => sum + (item.views || 0), 0);
        const totalLikes = content.reduce((sum, item) => sum + (item.likes || 0), 0);
        const totalComments = content.reduce((sum, item) => sum + (item.commentsCount || 0), 0);
        
        const totalEarnings = content.reduce((sum, item) => {
          let itemTotal = 0;
          if (item.estimatedEarnings) {
            itemTotal = Object.values(item.estimatedEarnings).reduce((s: number, e: any) => s + e, 0);
          }
          return sum + itemTotal;
        }, 0);

        const averageEngagement = content.length > 0 
          ? ((totalLikes + totalComments) / content.length).toFixed(2)
          : 0;

        // Top performing content (by views)
        const topPerformingContent = content
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5);

        // Platform breakdown
        const platformCounts: { [key: string]: number } = {};
        content.forEach(item => {
          item.platforms?.forEach(platform => {
            platformCounts[platform] = (platformCounts[platform] || 0) + 1;
          });
        });

        const platformBreakdown = Object.entries(platformCounts).map(([platform, count]) => ({
          platform,
          count
        }));

        // Weekly trends (simplified - in real app, you'd have actual time-series data)
        const weeklyTrends = content.slice(0, 7).map((item, index) => ({
          date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          views: item.views || 0,
          likes: item.likes || 0
        }));

        setAnalyticsData({
          totalViews,
          totalLikes,
          totalComments,
          totalEarnings,
          averageEngagement: parseFloat(averageEngagement.toString()),
          topPerformingContent,
          platformBreakdown,
          weeklyTrends
        });

      } catch (error: any) {
        console.error('Failed to fetch analytics:', error);
        setError(error.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, timeRange]);

  if (authLoading || !user) {
    return (
      <div className="container mx-auto p-4">
        <SkeletonDashboard />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-6 bg-red-100 rounded-lg text-red-700" role="alert">
          Error loading analytics: {error}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-6">
          <p className="text-gray-500">No analytics data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <Button
            variant={timeRange === '7d' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Total Views" 
          value={analyticsData.totalViews.toLocaleString()} 
          icon={Eye}
          trend={12}
        />
        <StatCard 
          title="Total Likes" 
          value={analyticsData.totalLikes.toLocaleString()} 
          icon={ThumbsUp}
          trend={8}
        />
        <StatCard 
          title="Total Comments" 
          value={analyticsData.totalComments.toLocaleString()} 
          icon={MessageSquare}
          trend={15}
        />
        <StatCard 
          title="Est. Earnings" 
          value={`$${analyticsData.totalEarnings.toFixed(2)}`} 
          icon={DollarSign}
          trend={23}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Engagement Overview */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Engagement Overview</h3>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Engagement Rate</span>
              <span className="font-semibold">{analyticsData.averageEngagement}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Content Published</span>
              <span className="font-semibold">{analyticsData.topPerformingContent.length}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Platforms</span>
              <span className="font-semibold">{analyticsData.platformBreakdown.length}</span>
            </div>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Platform Distribution</h3>
            <PieChart className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="space-y-3">
            {analyticsData.platformBreakdown.map((platform) => (
              <div key={platform.platform} className="flex justify-between items-center">
                <span className="text-gray-600">{platform.platform}</span>
                <span className="font-semibold">{platform.count} posts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="mt-8 bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Performing Content</h3>
          <BarChart3 className="h-5 w-5 text-purple-600" />
        </div>
        
        <div className="space-y-4">
          {analyticsData.topPerformingContent.map((content, index) => (
            <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                <div>
                  <h4 className="font-medium">{content.title}</h4>
                  <p className="text-sm text-gray-500">
                    {content.platforms?.join(', ')} • {content.createdAt instanceof Date ? content.createdAt.toLocaleDateString() : content.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{content.views || 0}</div>
                  <div className="text-gray-500">Views</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{content.likes || 0}</div>
                  <div className="text-gray-500">Likes</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{content.commentsCount || 0}</div>
                  <div className="text-gray-500">Comments</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Trends */}
      <div className="mt-8 bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Weekly Trends</h3>
          <Calendar className="h-5 w-5 text-orange-600" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-7">
          {analyticsData.weeklyTrends.map((trend, index) => (
            <div key={index} className="text-center p-3 border rounded-lg">
              <div className="text-sm text-gray-500 mb-2">{trend.date}</div>
              <div className="font-semibold">{trend.views}</div>
              <div className="text-xs text-gray-500">views</div>
              <div className="font-semibold text-green-600">{trend.likes}</div>
              <div className="text-xs text-gray-500">likes</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 