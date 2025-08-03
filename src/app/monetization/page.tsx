'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { StatCard } from '@/components/common/StatCard';
import { getUserContent } from '@/services/firestore';
import { Content } from '@/models/content';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Wallet,
  PieChart,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import { SkeletonDashboard } from '@/components/common/Skeleton';

interface MonetizationData {
  totalRevenue: number;
  monthlyRevenue: number;
  averagePerContent: number;
  revenueGrowth: number;
  revenueStreams: { name: string; amount: number; percentage: number }[];
  topEarningContent: Content[];
  monthlyTrends: { month: string; revenue: number }[];
  paymentMethods: { type: string; lastFour: string; isDefault: boolean }[];
}

export default function MonetizationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [monetizationData, setMonetizationData] = useState<MonetizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchMonetizationData = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const content = await getUserContent(user.uid);
        
        // Calculate revenue metrics
        const totalRevenue = content.reduce((sum, item) => {
          let itemTotal = 0;
          if (item.estimatedEarnings) {
            itemTotal = Object.values(item.estimatedEarnings).reduce((s: number, e: any) => s + e, 0);
          }
          return sum + itemTotal;
        }, 0);

        const monthlyRevenue = totalRevenue * 0.3; // Simplified calculation
        const averagePerContent = content.length > 0 ? totalRevenue / content.length : 0;
        const revenueGrowth = 15.3; // Mock growth rate

        // Revenue streams breakdown
        const revenueStreams = [
          { name: 'Ad Revenue', amount: totalRevenue * 0.4, percentage: 40 },
          { name: 'Sponsorships', amount: totalRevenue * 0.3, percentage: 30 },
          { name: 'Affiliate Sales', amount: totalRevenue * 0.2, percentage: 20 },
          { name: 'Direct Sales', amount: totalRevenue * 0.1, percentage: 10 }
        ];

        // Top earning content
        const topEarningContent = content
          .filter(item => item.estimatedEarnings)
          .sort((a, b) => {
            const aEarnings = Object.values(a.estimatedEarnings || {}).reduce((s: number, e: any) => s + e, 0);
            const bEarnings = Object.values(b.estimatedEarnings || {}).reduce((s: number, e: any) => s + e, 0);
            return bEarnings - aEarnings;
          })
          .slice(0, 5);

        // Monthly trends
        const monthlyTrends = [
          { month: 'Jan', revenue: totalRevenue * 0.8 },
          { month: 'Feb', revenue: totalRevenue * 0.9 },
          { month: 'Mar', revenue: totalRevenue * 1.0 },
          { month: 'Apr', revenue: totalRevenue * 1.1 },
          { month: 'May', revenue: totalRevenue * 1.2 },
          { month: 'Jun', revenue: totalRevenue * 1.3 }
        ];

        // Mock payment methods
        const paymentMethods = [
          { type: 'Visa', lastFour: '4242', isDefault: true },
          { type: 'Mastercard', lastFour: '8888', isDefault: false },
          { type: 'PayPal', lastFour: '****', isDefault: false }
        ];

        setMonetizationData({
          totalRevenue,
          monthlyRevenue,
          averagePerContent,
          revenueGrowth,
          revenueStreams,
          topEarningContent,
          monthlyTrends,
          paymentMethods
        });

      } catch (error: any) {
        console.error('Failed to fetch monetization data:', error);
        setError(error.message || 'Failed to load monetization data');
      } finally {
        setLoading(false);
      }
    };

    fetchMonetizationData();
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
            <p className="text-gray-500">Loading monetization data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-6 bg-red-100 rounded-lg text-red-700" role="alert">
          Error loading monetization data: {error}
        </div>
      </div>
    );
  }

  if (!monetizationData) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-6">
          <p className="text-gray-500">No monetization data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Monetization Dashboard</h1>
        <div className="flex space-x-2">
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
          <Button
            variant={selectedPeriod === '1y' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('1y')}
          >
            1 Year
          </Button>
        </div>
      </div>

      {/* Key Revenue Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Total Revenue" 
          value={`$${monetizationData.totalRevenue.toFixed(2)}`} 
          icon={DollarSign}
          trend={`+${monetizationData.revenueGrowth}%`}
          trendUp={true}
        />
        <StatCard 
          title="Monthly Revenue" 
          value={`$${monetizationData.monthlyRevenue.toFixed(2)}`} 
          icon={TrendingUp}
          trend="+8%"
          trendUp={true}
        />
        <StatCard 
          title="Avg. Per Content" 
          value={`$${monetizationData.averagePerContent.toFixed(2)}`} 
          icon={Target}
          trend="+12%"
          trendUp={true}
        />
        <StatCard 
          title="Revenue Growth" 
          value={`${monetizationData.revenueGrowth}%`} 
          icon={Zap}
          trend="+5%"
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Streams */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Revenue Streams</h3>
            <PieChart className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="space-y-4">
            {monetizationData.revenueStreams.map((stream) => (
              <div key={stream.name}>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-600">{stream.name}</span>
                  <span className="font-semibold">${stream.amount.toFixed(2)} ({stream.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stream.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Payment Methods</h3>
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="space-y-3">
            {monetizationData.paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">{method.type}</div>
                    <div className="text-sm text-gray-500">**** {method.lastFour}</div>
                  </div>
                </div>
                {method.isDefault && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Top Earning Content */}
      <div className="mt-8 bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Earning Content</h3>
          <Wallet className="h-5 w-5 text-purple-600" />
        </div>
        
        <div className="space-y-4">
          {monetizationData.topEarningContent.map((content, index) => {
            const earnings = Object.values(content.estimatedEarnings || {}).reduce((s: number, e: any) => s + e, 0);
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
                
                <div className="text-right">
                  <div className="font-semibold text-green-600">${earnings.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">earned</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Revenue Trends */}
      <div className="mt-8 bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Monthly Revenue Trends</h3>
          <Calendar className="h-5 w-5 text-orange-600" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-6">
          {monetizationData.monthlyTrends.map((trend, index) => (
            <div key={index} className="text-center p-3 border rounded-lg">
              <div className="text-sm text-gray-500 mb-2">{trend.month}</div>
              <div className="font-semibold text-green-600">${trend.revenue.toFixed(0)}</div>
              <div className="text-xs text-gray-500">revenue</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monetization Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Monetization Tips</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-sm">Optimize your content for better engagement rates</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-sm">Diversify your revenue streams</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <p className="text-sm">Build relationships with brands for sponsorships</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <p className="text-sm">Track your performance metrics regularly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 