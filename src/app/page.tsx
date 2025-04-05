import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">CreatorSync</div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/features" className="text-gray-500 hover:text-gray-900">Features</Link>
            <Link href="/pricing" className="text-gray-500 hover:text-gray-900">Pricing</Link>
            <Link href="/blog" className="text-gray-500 hover:text-gray-900">Blog</Link>
          </nav>
          <div className="flex space-x-4">
            <Link 
              href="/app/(auth)/login" 
              className="px-4 py-2 rounded text-blue-600 hover:text-blue-800"
            >
              Log in
            </Link>
            <Link 
              href="/app/(auth)/register" 
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                Manage Your Creator Business Across Platforms
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                CreatorSync helps you streamline content management, analytics, and monetization for TikTok, Instagram Reels, and X.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/app/(auth)/register" 
                  className="inline-block px-8 py-4 text-center rounded-lg bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg"
                >
                  Start for free
                </Link>
                <Link 
                  href="/features" 
                  className="inline-block px-8 py-4 text-center rounded-lg border-2 border-white text-white hover:bg-white/10 font-bold text-lg"
                >
                  Learn more
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative h-96">
              {/* Placeholder for screenshot/illustration */}
              <div className="bg-blue-800/30 w-full h-full rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">Platform Dashboard Preview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Your Creator Tools in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CreatorSync brings together everything you need to manage your content creator business efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Unified Content Studio</h3>
              <p className="text-gray-600 mb-4">
                Create, schedule, and publish content across TikTok, Instagram Reels, and X from a single dashboard.
              </p>
              <Link href="/features#content" className="text-blue-600 hover:text-blue-800 font-medium">
                Learn more →
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cross-Platform Analytics</h3>
              <p className="text-gray-600 mb-4">
                Get unified insights into your performance across all platforms with actionable recommendations.
              </p>
              <Link href="/features#analytics" className="text-blue-600 hover:text-blue-800 font-medium">
                Learn more →
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Monetization Tracking</h3>
              <p className="text-gray-600 mb-4">
                Track revenue streams, manage brand deals, and optimize your monetization strategy.
              </p>
              <Link href="/features#monetization" className="text-blue-600 hover:text-blue-800 font-medium">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Streamline Your Creator Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of creators who are saving time and growing their audience with CreatorSync.
          </p>
          <Link 
            href="/app/(auth)/register" 
            className="inline-block px-8 py-4 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold text-lg"
          >
            Get started today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CreatorSync</h3>
              <p className="text-gray-300">
                The all-in-one platform for content creators.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-300 hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-300 hover:text-white">Pricing</Link></li>
                <li><Link href="/roadmap" className="text-gray-300 hover:text-white">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
                <li><Link href="/guides" className="text-gray-300 hover:text-white">Creator Guides</Link></li>
                <li><Link href="/support" className="text-gray-300 hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 CreatorSync. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 