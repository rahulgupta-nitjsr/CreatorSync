'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { StatCard } from '@/components/common/StatCard';
import { getUserContent } from '@/services/firestore.service';
import { Content } from '@/models/content';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2,
  TrendingUp,
  Globe,
  UserPlus,
  Activity
} from 'lucide-react';
import { SkeletonDashboard } from '@/components/common/Skeleton';

interface CommunityData {
  totalFollowers: number;
  totalComments: number;
  totalShares: number;
  engagementRate: number;
  audienceGrowth: number;
  topEngagedContent: Content[];
  audienceDemographics: { age: string; percentage: number }[];
  platformAudience: { platform: string; followers: number }[];
  recentComments: { id: string; user: string; comment: string; date: string; content: string }[];
}

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const content = await getUserContent(user.uid);
        
        // Calculate community metrics
        const totalFollowers = content.reduce((sum, item) => sum + (item.followers || 0), 0);
        const totalComments = content.reduce((sum, item) => sum + (item.commentsCount || 0), 0);
        const totalShares = content.reduce((sum, item) => sum + (item.shares || 0), 0);
        
        const totalEngagement = content.reduce((sum, item) => 
          sum + (item.likes || 0) + (item.commentsCount || 0) + (item.shares || 0), 0
        );
        
        const engagementRate = content.length > 0 
          ? ((totalEngagement / content.length) / Math.max(totalFollowers, 1)) * 100
          : 0;

        const audienceGrowth = 12.5; // Mock growth rate

        // Top engaged content
        const topEngagedContent = content
          .sort((a, b) => {
            const aEngagement = (a.likes || 0) + (a.commentsCount || 0) + (a.shares || 0);
            const bEngagement = (b.likes || 0) + (b.commentsCount || 0) + (b.shares || 0);
            return bEngagement - aEngagement;
          })
          .slice(0, 5);

        // Mock audience demographics
        const audienceDemographics = [
          { age: '18-24', percentage: 25 },
          { age: '25-34', percentage: 35 },
          { age: '35-44', percentage: 20 },
          { age: '45-54', percentage: 15 },
          { age: '55+', percentage: 5 }
        ];

        // Platform audience breakdown
        const platformAudience = [
          { platform: 'TikTok', followers: totalFollowers * 0.4 },
          { platform: 'Instagram', followers: totalFollowers * 0.35 },
          { platform: 'X (Twitter)', followers: totalFollowers * 0.25 }
        ];

        // Mock recent comments
        const recentComments = [
          { id: '1', user: 'Sarah M.', comment: 'Love this content! Keep it up!', date: '2 hours ago', content: 'How to Grow Your Audience' },
          { id: '2', user: 'Mike R.', comment: 'This is exactly what I needed!', date: '4 hours ago', content: '10 Tips for Better Content' },
          { id: '3', user: 'Emma L.', comment: 'Great tips, thank you!', date: '6 hours ago', content: 'Creating Engaging Videos' },
          { id: '4', user: 'David K.', comment: 'Very helpful information', date: '1 day ago', content: 'Monetization Strategies' },
          { id: '5', user: 'Lisa P.', comment: 'Can\'t wait for more content!', date: '2 days ago', content: 'Building Your Brand' }
        ];

        setCommunityData({
          totalFollowers,
          totalComments,
          totalShares,
          engagementRate,
          audienceGrowth,
          topEngagedContent,
          audienceDemographics,
          platformAudience,
          recentComments
        });

      } catch (error: any) {
        console.error('Failed to fetch community data:', error);
        setError(error.message || 'Failed to load community data');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [user, selectedPeriod]);

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
            <p className="text-gray-500">Loading community data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-6 bg-red-100 rounded-lg text-red-700" role="alert">
          Error loading community data: {error}
        </div>
      </div>
    );
  }

  if (!communityData) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-6">
          <p className="text-gray-500">No community data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Community Dashboard</h1>
        <div className="flex space-x-2">
          <Button
            variant={selectedPeriod === '7d' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={selectedPeriod === '30d' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={selectedPeriod === '90d' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Community Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Total Followers" 
          value={communityData.totalFollowers.toLocaleString()} 
          icon={Users}
          trend={`+${communityData.audienceGrowth}%`}
          trendUp={true}
        />
        <StatCard 
          title="Total Comments" 
          value={communityData.totalComments.toLocaleString()} 
          icon={MessageSquare}
          trend="+18%"
          trendUp={true}
        />
        <StatCard 
          title="Total Shares" 
          value={communityData.totalShares.toLocaleString()} 
          icon={Share2}
          trend="+25%"
          trendUp={true}
        />
        <StatCard 
          title="Engagement Rate" 
          value={`${communityData.engagementRate.toFixed(1)}%`} 
          icon={Heart}
          trend="+8%"
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Audience Demographics */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Audience Demographics</h3>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="space-y-4">
            {communityData.audienceDemographics.map((demo) => (
              <div key={demo.age}>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-600">{demo.age}</span>
                  <span className="font-semibold">{demo.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${demo.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Audience */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Platform Audience</h3>
            <Globe className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="space-y-4">
            {communityData.platformAudience.map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">{platform.platform}</div>
                    <div className="text-sm text-gray-500">{platform.followers.toLocaleString()} followers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {((platform.followers / communityData.totalFollowers) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Engaged Content */}
      <div className="mt-8 bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Engaged Content</h3>
          <TrendingUp className="h-5 w-5 text-purple-600" />
        </div>
        
        <div className="space-y-4">
          {communityData.topEngagedContent.map((content, index) => {
            const engagement = (content.likes || 0) + (content.commentsCount || 0) + (content.shares || 0);
            return (
              <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <h4 className="font-medium">{content.title}</h4>
                    <p className="text-sm text-gray-500">
                      {content.platforms?.join(', ')} • {content.createdAt?.toDate().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">{content.likes || 0}</div>
                    <div className="text-gray-500">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{content.commentsCount || 0}</div>
                    <div className="text-gray-500">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{content.shares || 0}</div>
                    <div className="text-gray-500">Shares</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{engagement}</div>
                    <div className="text-gray-500">Total</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Comments */}
      <div className="mt-8 bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Comments</h3>
          <MessageSquare className="h-5 w-5 text-orange-600" />
        </div>
        
        <div className="space-y-4">
          {communityData.recentComments.map((comment) => (
            <div key={comment.id} className="p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {comment.user.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{comment.user}</span>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{comment.comment}</p>
                  <div className="text-xs text-gray-500">
                    On: <span className="font-medium">{comment.content}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Reply</Button>
                  <Button size="sm" variant="outline">Like</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Growth Tips */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Community Growth Tips</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <p className="text-sm">Respond to comments within 24 hours</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <p className="text-sm">Create content that encourages discussion</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-sm">Host live Q&A sessions regularly</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-sm">Collaborate with other creators</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 