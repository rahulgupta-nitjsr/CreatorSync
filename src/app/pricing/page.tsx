'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

interface PricingTier {
  name: string;
  description: string;
  price: string;
  frequency: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: 'Free',
    description: 'Perfect for getting started with basic features.',
    price: '$0',
    frequency: 'forever',
    features: [
      'Up to 2 social media accounts',
      'Basic analytics',
      'Manual content publishing',
      'Limited content history (30 days)',
      'Email support',
    ],
    cta: 'Get Started',
    href: '/register',
  },
  {
    name: 'Pro',
    description: 'For serious creators with multiple platforms.',
    price: '$19',
    frequency: 'per month',
    features: [
      'Up to 10 social media accounts',
      'Advanced analytics and insights',
      'Scheduled publishing',
      'Content history (1 year)',
      'Priority email support',
      'Content performance reports',
      'AI content suggestions',
    ],
    cta: 'Start Free Trial',
    href: '/register?plan=pro',
    popular: true,
  },
  {
    name: 'Business',
    description: 'For teams and businesses managing multiple creators.',
    price: '$49',
    frequency: 'per month',
    features: [
      'Unlimited social media accounts',
      'Enterprise-grade analytics',
      'Advanced scheduling and automation',
      'Unlimited content history',
      '24/7 priority support',
      'Advanced reporting',
      'Team collaboration tools',
      'API access',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    href: '/contact',
  },
];

export default function PricingPage() {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">Pricing Plans</h1>
          <p className="mt-5 text-xl text-gray-500 sm:text-center">
            Choose the perfect plan for your content creation needs.
            Start with our free plan and upgrade as you grow.
          </p>
          
          <div className="relative mt-6 bg-gray-100 rounded-lg p-0.5 flex self-center sm:mt-8">
            <button
              type="button"
              className="relative bg-white border-gray-200 rounded-md py-2 px-8 shadow-sm text-sm font-medium text-gray-900 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10"
            >
              Monthly billing
            </button>
            <button
              type="button"
              className="relative ml-0.5 border border-transparent rounded-md py-2 px-8 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10"
            >
              Annual billing
            </button>
          </div>
        </div>
        
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {tiers.map((tier) => (
            <Card key={tier.name} className={tier.popular ? 'border-blue-500' : ''}>
              <div className="p-6">
                {tier.popular && (
                  <div className="absolute top-0 right-0 -mt-3 mr-6 px-4 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full transform translate-y-2">
                    Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                <p className="mt-2 text-gray-500">{tier.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>{' '}
                  <span className="text-base font-medium text-gray-500">/{tier.frequency}</span>
                </p>
                
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex">
                      <div className="flex-shrink-0">
                        <i className="fas fa-check text-blue-500"></i>
                      </div>
                      <p className="ml-3 text-base text-gray-500">{feature}</p>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Link href={tier.href}>
                    <Button
                      variant={tier.popular ? 'primary' : 'outline'}
                      fullWidth
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-20">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center">Frequently Asked Questions</h2>
          <div className="mt-12 max-w-3xl mx-auto">
            <dl className="space-y-10">
              <div>
                <dt className="text-lg font-medium text-gray-900">Can I change my plan later?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes, you can upgrade, downgrade, or cancel your plan at any time. If you downgrade, the changes will apply at the end of your current billing cycle.
                </dd>
              </div>
              
              <div>
                <dt className="text-lg font-medium text-gray-900">Do you offer any discounts?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  We offer a 20% discount for annual billing on all paid plans. We also have special pricing for educational institutions and non-profit organizations.
                </dd>
              </div>
              
              <div>
                <dt className="text-lg font-medium text-gray-900">What payment methods do you accept?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support payments via PayPal.
                </dd>
              </div>
              
              <div>
                <dt className="text-lg font-medium text-gray-900">Is there a free trial for paid plans?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes, both our Pro and Business plans come with a 14-day free trial. No credit card required to start your trial.
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-20 bg-blue-50 rounded-lg overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Ready to get started with CreatorSync?
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-3xl">
                Sign up today and join thousands of content creators who are streamlining their social media workflow and growing their audience.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/register">
                  <Button size="lg">
                    Sign up for free
                  </Button>
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Talk to sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 