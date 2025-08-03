'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Sparkles, Check, ArrowRight, Zap, Crown, Building2 } from 'lucide-react';

interface PricingTier {
  name: string;
  description: string;
  price: string;
  frequency: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
  icon: React.ElementType;
  color: 'emerald' | 'primary' | 'accent';
}

const tiers: PricingTier[] = [
  {
    name: 'Free',
    description: 'Perfect for getting started with basic creator tools.',
    price: '$0',
    frequency: 'forever',
    features: [
      'Up to 2 social media accounts',
      'Basic analytics dashboard',
      'Manual content publishing',
      'Limited content history (30 days)',
      'Email support',
      'Mobile app access',
    ],
    cta: 'Get Started Free',
    href: '/register',
    icon: Zap,
    color: 'emerald',
  },
  {
    name: 'Pro',
    description: 'For serious creators scaling their influence.',
    price: '$19',
    frequency: 'per month',
    features: [
      'Up to 10 social media accounts',
      'Advanced analytics & insights',
      'Automated scheduling',
      'Content history (1 year)',
      'Priority email support',
      'Performance reports & AI suggestions',
      'Brand collaboration tools',
      'Custom branding options',
    ],
    cta: 'Start Free Trial',
    href: '/register?plan=pro',
    popular: true,
    icon: Crown,
    color: 'primary',
  },
  {
    name: 'Business',
    description: 'For teams and agencies managing multiple creators.',
    price: '$49',
    frequency: 'per month',
    features: [
      'Unlimited social media accounts',
      'Enterprise-grade analytics',
      'Advanced automation & workflows',
      'Unlimited content history',
      '24/7 priority support',
      'Advanced reporting & white-label',
      'Team collaboration & permissions',
      'API access & custom integrations',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    icon: Building2,
    color: 'accent',
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          iconBg: 'bg-gradient-to-br from-emerald-100 to-emerald-200',
          iconColor: 'text-emerald-600',
          buttonVariant: 'success' as const,
        };
      case 'accent':
        return {
          iconBg: 'bg-gradient-to-br from-accent-100 to-accent-200',
          iconColor: 'text-accent-600',
          buttonVariant: 'outline' as const,
        };
      default: // primary
        return {
          iconBg: 'bg-gradient-to-br from-primary-100 to-primary-200',
          iconColor: 'text-primary-600',
          buttonVariant: 'primary' as const,
        };
    }
  };

  return (
    <div className="min-h-screen pt-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-50 via-surface-100 to-primary-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-accent-300/20 to-primary-300/20 rounded-full blur-2xl" />
      
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 glass-light px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-surface-700">
              Transparent Pricing
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-surface-900 mb-6">
            Choose Your{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Creator Plan
            </span>
          </h1>
          <p className="text-xl text-surface-600 max-w-3xl mx-auto mb-10">
            Start with our free plan and scale as you grow. 
            All plans include our core features with no hidden fees.
          </p>
          
          {/* Billing Toggle */}
          <div className="glass-card inline-flex p-1 rounded-2xl">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                !isAnnual 
                  ? 'bg-gradient-primary text-white shadow-warm' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                isAnnual 
                  ? 'bg-gradient-primary text-white shadow-warm' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              Annual billing
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 max-w-6xl mx-auto">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            const colorClasses = getColorClasses(tier.color);
            const annualPrice = tier.price === '$0' ? '$0' : `$${Math.floor(parseInt(tier.price.replace('$', '')) * 0.8)}`;
            
            return (
              <div
                key={tier.name}
                className={`glass-card group relative overflow-hidden ${
                  tier.popular ? 'ring-2 ring-primary-400 shadow-warm-lg' : ''
                } hover:shadow-warm-lg transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-primary text-white px-6 py-2 rounded-full text-sm font-semibold shadow-warm">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  {/* Icon and Title */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-12 h-12 ${colorClasses.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className={`h-6 w-6 ${colorClasses.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-surface-900">{tier.name}</h3>
                      <p className="text-surface-600">{tier.description}</p>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-surface-900">
                        {isAnnual ? annualPrice : tier.price}
                      </span>
                      {tier.price !== '$0' && (
                        <span className="text-surface-500 ml-2">/{isAnnual ? 'month' : tier.frequency}</span>
                      )}
                    </div>
                    {isAnnual && tier.price !== '$0' && (
                      <p className="text-sm text-emerald-600 font-medium mt-1">
                        Billed annually (Save 20%)
                      </p>
                    )}
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-surface-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                  {/* CTA Button */}
                  <Link href={tier.href} className="block">
                    <Button
                      variant={colorClasses.buttonVariant}
                      fullWidth
                      size="lg"
                      glow={tier.popular}
                      className="group"
                    >
                      {tier.cta}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                
                {/* Gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            );
          })}
        </div>
        
        {/* FAQ Section */}
        <div className="mt-32">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 glass-light px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-surface-700">
                Questions & Answers
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Frequently Asked{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-surface-600 max-w-2xl mx-auto">
              Everything you need to know about our plans and pricing.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6 animate-fade-in-up">
                <h3 className="text-lg font-semibold text-surface-900 mb-3">
                  Can I change my plan later?
                </h3>
                <p className="text-surface-600 leading-relaxed">
                  Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes apply at the end of your current billing cycle, and we'll prorate any differences.
                </p>
              </div>
              
              <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-semibold text-surface-900 mb-3">
                  Do you offer any discounts?
                </h3>
                <p className="text-surface-600 leading-relaxed">
                  We offer a 20% discount for annual billing on all paid plans. We also have special pricing for educational institutions and non-profit organizations.
                </p>
              </div>
              
              <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold text-surface-900 mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-surface-600 leading-relaxed">
                  We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support payments via PayPal and bank transfers.
                </p>
              </div>
              
              <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-lg font-semibold text-surface-900 mb-3">
                  Is there a free trial for paid plans?
                </h3>
                <p className="text-surface-600 leading-relaxed">
                  Yes, both our Pro and Business plans come with a 14-day free trial. No credit card required to start your trial, and you can cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Final CTA Section */}
        <div className="mt-32">
          <div className="glass-card p-12 md:p-16 bg-gradient-to-br from-primary-50/50 via-transparent to-accent-50/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-full blur-xl" />
            
            <div className="relative lg:flex lg:items-center lg:justify-between">
              <div className="mb-8 lg:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
                  Ready to{' '}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Transform
                  </span>{' '}
                  Your Creator Business?
              </h2>
                <p className="text-xl text-surface-600 max-w-2xl">
                  Join thousands of content creators who are streamlining their workflow and growing their audience with CreatorSync.
                </p>
                
                {/* Trust indicators */}
                <div className="flex items-center space-x-8 mt-6">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-surface-600 font-medium">14-day free trial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-surface-600 font-medium">Cancel anytime</span>
                  </div>
                </div>
            </div>
              
              <div className="flex flex-col sm:flex-row gap-4 lg:flex-shrink-0">
                <Link href="/register">
                  <Button 
                    variant="primary" 
                    size="xl"
                    glow
                    className="group"
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Start Free Trial
                  </Button>
                </Link>
                
                <Link href="/contact">
                  <Button 
                    variant="glass" 
                    size="xl"
                    className="group"
                  >
                    Talk to Sales
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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