import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Sparkles, PlayCircle, ArrowRight, BarChart3, Zap, DollarSign } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-50 via-surface-100 to-primary-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-primary-300/10 to-accent-300/10 rounded-full blur-3xl animate-float" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 glass-light px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-surface-700">
                  Trusted by 10,000+ creators
                </span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-surface-900 leading-tight">
                  Manage Your{' '}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Creator Business{' '}
                  </span>
                  Across Platforms
                </h1>
                
                <p className="text-xl md:text-2xl text-surface-600 max-w-2xl">
                  CreatorSync helps you streamline content management, analytics, and monetization for{' '}
                  <span className="text-primary-600 font-semibold">TikTok</span>,{' '}
                  <span className="text-primary-600 font-semibold">Instagram Reels</span>, and{' '}
                  <span className="text-primary-600 font-semibold">X</span>.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button 
                    variant="primary" 
                    size="xl"
                    glow
                    className="group w-full sm:w-auto"
                  >
                    <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Start for Free
                  </Button>
                </Link>
                
                <Link href="#features">
                  <Button 
                    variant="glass" 
                    size="xl"
                    className="group w-full sm:w-auto"
                  >
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-surface-900">10K+</div>
                  <div className="text-sm text-surface-500">Active Creators</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-surface-900">50M+</div>
                  <div className="text-sm text-surface-500">Content Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-surface-900">$2M+</div>
                  <div className="text-sm text-surface-500">Creator Revenue</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image/Dashboard Preview */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card p-8 bg-gradient-to-br from-surface-50/50 via-transparent to-primary-50/30">
                {/* Mock Dashboard */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-surface-900">CreatorSync</div>
                        <div className="text-sm text-surface-500">Dashboard Preview</div>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-light p-4 rounded-2xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-primary-600" />
                        <span className="text-sm text-surface-600">Views</span>
                      </div>
                      <div className="text-2xl font-bold text-surface-900">2.4M</div>
                      <div className="text-sm text-emerald-600">+12.5%</div>
                    </div>
                    
                    <div className="glass-light p-4 rounded-2xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-4 h-4 text-accent-600" />
                        <span className="text-sm text-surface-600">Revenue</span>
                      </div>
                      <div className="text-2xl font-bold text-surface-900">$8.2K</div>
                      <div className="text-sm text-emerald-600">+24.3%</div>
                    </div>
                  </div>
                  
                  {/* Chart Placeholder */}
                  <div className="glass-light p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-surface-700">Performance Overview</span>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-primary-400 rounded-full" />
                        <div className="w-3 h-3 bg-accent-400 rounded-full" />
                        <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                      </div>
                    </div>
                    
                    {/* Mock Chart Bars */}
                    <div className="flex items-end space-x-2 h-24">
                      <div className="bg-gradient-to-t from-primary-400 to-primary-300 w-4 h-16 rounded-t-lg" />
                      <div className="bg-gradient-to-t from-primary-500 to-primary-400 w-4 h-20 rounded-t-lg" />
                      <div className="bg-gradient-to-t from-primary-600 to-primary-500 w-4 h-24 rounded-t-lg" />
                      <div className="bg-gradient-to-t from-primary-500 to-primary-400 w-4 h-18 rounded-t-lg" />
                      <div className="bg-gradient-to-t from-primary-400 to-primary-300 w-4 h-14 rounded-t-lg" />
                      <div className="bg-gradient-to-t from-primary-600 to-primary-500 w-4 h-22 rounded-t-lg" />
                      <div className="bg-gradient-to-t from-primary-700 to-primary-600 w-4 h-24 rounded-t-lg" />
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex space-x-3">
                    <div className="flex-1 glass-light p-3 rounded-xl text-center">
                      <Zap className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                      <div className="text-xs text-surface-600">Quick Post</div>
                    </div>
                    <div className="flex-1 glass-light p-3 rounded-xl text-center">
                      <BarChart3 className="w-5 h-5 text-accent-600 mx-auto mb-1" />
                      <div className="text-xs text-surface-600">Analytics</div>
                    </div>
                    <div className="flex-1 glass-light p-3 rounded-xl text-center">
                      <DollarSign className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                      <div className="text-xs text-surface-600">Revenue</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-50 to-surface-100" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-200/20 to-accent-200/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 glass-light px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-surface-700">
                Everything You Need
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-surface-900 mb-6">
              All Your{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Creator Tools
              </span>{' '}
              in One Place
            </h2>
            <p className="text-xl text-surface-600 max-w-3xl mx-auto">
              CreatorSync brings together everything you need to manage your content creator business efficiently and scale your impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 group hover:shadow-warm-lg transition-all duration-300 animate-fade-in-up">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-surface-900 mb-4 group-hover:text-primary-700 transition-colors">
                  Unified Content Studio
                </h3>
                <p className="text-surface-600 mb-6 leading-relaxed">
                  Create, schedule, and publish content across TikTok, Instagram Reels, and X from a single, powerful dashboard.
                </p>
                
                <Link href="/features#content" className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold group-hover:translate-x-1 transition-all duration-200">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                {/* Gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 group hover:shadow-warm-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <BarChart3 className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-surface-900 mb-4 group-hover:text-emerald-700 transition-colors">
                  Cross-Platform Analytics
                </h3>
                <p className="text-surface-600 mb-6 leading-relaxed">
                  Get unified insights into your performance across all platforms with actionable recommendations and deep analytics.
                </p>
                
                <Link href="/features#analytics" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold group-hover:translate-x-1 transition-all duration-200">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                {/* Gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 group hover:shadow-warm-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center text-accent-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <DollarSign className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-surface-900 mb-4 group-hover:text-accent-700 transition-colors">
                  Monetization Tracking
                </h3>
                <p className="text-surface-600 mb-6 leading-relaxed">
                  Track revenue streams, manage brand deals, and optimize your monetization strategy with intelligent insights.
                </p>
                
                <Link href="/features#monetization" className="inline-flex items-center space-x-2 text-accent-600 hover:text-accent-700 font-semibold group-hover:translate-x-1 transition-all duration-200">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                {/* Gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 to-accent-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-surface-50 to-accent-50/50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-accent-300/20 to-primary-300/20 rounded-full blur-2xl" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 md:p-16 text-center bg-gradient-to-br from-surface-50/50 via-transparent to-primary-50/30">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 glass-light px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-surface-700">
                  Join the Community
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-surface-900 mb-6">
                Ready to{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Streamline
                </span>{' '}
                Your Creator Business?
              </h2>
              
              <p className="text-xl text-surface-600 max-w-3xl mx-auto mb-10">
                Join thousands of creators who are saving time and growing their audience with CreatorSync's powerful platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button 
                    variant="primary" 
                    size="xl"
                    glow
                    className="group w-full sm:w-auto"
                  >
                    <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Get Started Today
                  </Button>
                </Link>
                
                <Link href="/pricing">
                  <Button 
                    variant="glass" 
                    size="xl"
                    className="group w-full sm:w-auto"
                  >
                    View Pricing
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="pt-8 border-t border-glass-border">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12">
                  <div className="flex items-center space-x-2 text-surface-600">
                    <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Free 14-day trial</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-surface-600">
                    <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">No credit card required</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-surface-600">
                    <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 text-white py-20">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-primary opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-accent-500/10 to-primary-500/10 rounded-full blur-2xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">CreatorSync</h3>
                  <div className="text-sm text-surface-400">Premium Edition</div>
                </div>
              </div>
              <p className="text-surface-300 leading-relaxed">
                The all-in-one platform for content creators who want to scale their business across multiple platforms.
              </p>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="font-semibold mb-6 text-surface-100">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/features" className="text-surface-300 hover:text-primary-400 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-surface-300 hover:text-primary-400 transition-colors">Pricing</Link></li>
                <li><Link href="/roadmap" className="text-surface-300 hover:text-primary-400 transition-colors">Roadmap</Link></li>
                <li><Link href="/integrations" className="text-surface-300 hover:text-primary-400 transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-6 text-surface-100">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/blog" className="text-surface-300 hover:text-primary-400 transition-colors">Blog</Link></li>
                <li><Link href="/guides" className="text-surface-300 hover:text-primary-400 transition-colors">Creator Guides</Link></li>
                <li><Link href="/support" className="text-surface-300 hover:text-primary-400 transition-colors">Support</Link></li>
                <li><Link href="/community" className="text-surface-300 hover:text-primary-400 transition-colors">Community</Link></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="font-semibold mb-6 text-surface-100">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-surface-300 hover:text-primary-400 transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-surface-300 hover:text-primary-400 transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-surface-300 hover:text-primary-400 transition-colors">Contact</Link></li>
                <li><Link href="/press" className="text-surface-300 hover:text-primary-400 transition-colors">Press</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom section */}
          <div className="border-t border-surface-700 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-surface-400">© 2025 CreatorSync. All rights reserved.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <Link href="/privacy" className="text-surface-400 hover:text-primary-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-surface-400 hover:text-primary-400 transition-colors">Terms</Link>
              <Link href="/cookies" className="text-surface-400 hover:text-primary-400 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 