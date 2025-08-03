'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Notification } from '@/services/notifications';
import { Button } from '@/components/common/Button';
import { 
  Bell, 
  Settings, 
  User, 
  Home, 
  BarChart3, 
  Users, 
  CreditCard, 
  Menu, 
  X,
  LogOut,
  Sparkles
} from 'lucide-react';

export function Navbar() {
  const { user, loading, logOut, userProfile } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSignOut = async () => {
    try {
      await logOut();
      setIsMenuOpen(false);
      setIsNotificationsOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
  ];
  
  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
      ${scrolled 
        ? 'glass-card-dark backdrop-blur-2xl shadow-glass-hover' 
        : 'glass-ultra-light backdrop-blur-md'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left section - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="glass-light p-2 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-primary-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    CreatorSync
                  </span>
                  <span className="text-xs text-surface-500 -mt-1">
                    Premium Edition
                  </span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {user && !loading && navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group relative px-4 py-2 rounded-xl font-medium text-sm
                      transition-all duration-300 ease-out
                      ${active 
                        ? 'glass-medium text-primary-700 shadow-warm' 
                        : 'text-surface-600 hover:text-surface-900 hover:glass-light'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${active ? 'text-primary-600' : 'text-surface-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-primary rounded-full animate-glow" />
                    )}
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300" />
                  </Link>
                );
              })}
              
              {/* Public navigation for non-authenticated users */}
              {!user && !loading && (
                <>
                  <Link
                    href="/"
                    className={`
                      group relative px-4 py-2 rounded-xl font-medium text-sm
                      transition-all duration-300 ease-out
                      ${isActive('/') && !isActive('/dashboard')
                        ? 'glass-medium text-primary-700 shadow-warm' 
                        : 'text-surface-600 hover:text-surface-900 hover:glass-light'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </div>
                  </Link>
                  
                  <Link
                    href="/pricing"
                    className={`
                      group relative px-4 py-2 rounded-xl font-medium text-sm
                      transition-all duration-300 ease-out
                      ${isActive('/pricing')
                        ? 'glass-medium text-primary-700 shadow-warm' 
                        : 'text-surface-600 hover:text-surface-900 hover:glass-light'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Pricing</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Right section - User actions and authentication */}
          <div className="flex items-center space-x-4">
            {/* Authentication buttons for non-logged in users */}
            {!user && !loading && (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  <Link href="/login">Log in</Link>
                </Button>
                
                <Button 
                  variant="primary" 
                  size="sm"
                  glow
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
            
            {/* User actions for authenticated users */}
            {user && !loading && (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <div className="relative">
                  <button
                    type="button"
                    className="glass-light p-3 rounded-2xl hover:glass-medium transition-all duration-300 group"
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  >
                    <Bell className="h-5 w-5 text-surface-600 group-hover:text-primary-600 transition-colors" />
                    
                    {/* Notification badge */}
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications dropdown */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-4 w-96 glass-card animate-slide-down z-50">
                      <div className="p-4 border-b border-glass-border">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-surface-900">Notifications</h3>
                          <Button 
                            variant="text" 
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            Mark all read
                          </Button>
                        </div>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="h-12 w-12 text-surface-300 mx-auto mb-4" />
                            <p className="text-surface-500">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.slice(0, 5).map(notification => (
                            <div 
                              key={notification.id} 
                              className={`p-4 border-b border-glass-border last:border-0 hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent transition-all duration-200 ${
                                !notification.read ? 'bg-primary-50/20' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-surface-800 capitalize">
                                  {notification.type}
                                </span>
                                <span className="text-xs text-surface-500">
                                  {notification.createdAt?.toDate().toLocaleDateString() || 'Unknown'}
                                </span>
                              </div>
                              <p className="text-sm text-surface-600">{notification.message}</p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 animate-pulse" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      
                      {notifications.length > 0 && (
                        <div className="p-4 border-t border-glass-border">
                          <Button 
                            variant="ghost" 
                            fullWidth
                            onClick={() => {
                              setIsNotificationsOpen(false);
                              // Navigate to notifications page
                            }}
                          >
                            View All Notifications
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              
                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center space-x-3 glass-light p-2 pr-4 rounded-2xl hover:glass-medium transition-all duration-300 group"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    {user.photoURL ? (
                      <img 
                        className="h-8 w-8 rounded-xl object-cover shadow-md" 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-sm">
                          {user.displayName?.[0] || user.email?.[0] || '?'}
                        </span>
                      </div>
                    )}
                    
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-surface-800 group-hover:text-primary-700 transition-colors">
                        {user.displayName || 'User'}
                      </div>
                      <div className="text-xs text-surface-500">
                        {userProfile?.tier || 'Free Plan'}
                      </div>
                    </div>
                    
                    <Settings className="h-4 w-4 text-surface-400 group-hover:text-primary-500 transition-colors hidden sm:block" />
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-4 w-64 glass-card animate-slide-down z-50">
                      {/* User info header */}
                      <div className="p-4 border-b border-glass-border">
                        <div className="flex items-center space-x-3">
                          {user.photoURL ? (
                            <img 
                              className="h-12 w-12 rounded-2xl object-cover shadow-md" 
                              src={user.photoURL} 
                              alt={user.displayName || 'User'} 
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-lg">
                                {user.displayName?.[0] || user.email?.[0] || '?'}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-surface-900">
                              {user.displayName || 'User'}
                            </div>
                            <div className="text-sm text-surface-500 truncate max-w-[180px]">
                              {user.email}
                            </div>
                            <div className="text-xs text-primary-600 font-medium">
                              {userProfile?.tier || 'Free Plan'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu items */}
                      <div className="p-2">
                        <Link
                          href="/settings/profile"
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent transition-all duration-200 group"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="h-4 w-4 text-surface-500 group-hover:text-primary-600" />
                          <span className="text-surface-700 group-hover:text-surface-900">Profile Settings</span>
                        </Link>
                        
                        <Link
                          href="/settings/accounts"
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent transition-all duration-200 group"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 text-surface-500 group-hover:text-primary-600" />
                          <span className="text-surface-700 group-hover:text-surface-900">Connected Accounts</span>
                        </Link>
                        
                        <div className="border-t border-glass-border my-2" />
                        
                        <button
                          type="button"
                          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition-all duration-200 group"
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleSignOut();
                          }}
                        >
                          <LogOut className="h-4 w-4 text-surface-500 group-hover:text-red-600" />
                          <span className="text-surface-700 group-hover:text-red-600">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="glass-light p-3 rounded-2xl hover:glass-medium transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-surface-600" />
                ) : (
                  <Menu className="h-6 w-6 text-surface-600" />
                )}
              </button>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile menu panel */}
          <div className="relative flex flex-col ml-auto h-full w-full max-w-sm glass-card-dark animate-slide-down">
            <div className="flex items-center justify-between p-6 border-b border-glass-border">
              <div className="flex items-center space-x-3">
                <div className="glass-light p-2 rounded-xl">
                  <Sparkles className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-bold text-surface-900">CreatorSync</div>
                  <div className="text-xs text-surface-500">Premium Edition</div>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="glass-light p-2 rounded-xl hover:glass-medium transition-all duration-300"
              >
                <X className="h-5 w-5 text-surface-600" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {/* Navigation items */}
              <div className="space-y-2">
                {/* Public navigation */}
                {!user && !loading && (
                  <>
                    <Link
                      href="/"
                      className={`flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 ${
                        isActive('/') && !isActive('/dashboard')
                          ? 'glass-medium text-primary-700 shadow-warm'
                          : 'text-surface-600 hover:glass-light hover:text-surface-900'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Home className="h-5 w-5" />
                      <span className="font-medium">Home</span>
                    </Link>
                    
                    <Link
                      href="/pricing"
                      className={`flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 ${
                        isActive('/pricing')
                          ? 'glass-medium text-primary-700 shadow-warm'
                          : 'text-surface-600 hover:glass-light hover:text-surface-900'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CreditCard className="h-5 w-5" />
                      <span className="font-medium">Pricing</span>
                    </Link>
                  </>
                )}
                
                {/* Authenticated navigation */}
                {user && !loading && navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 ${
                        active 
                          ? 'glass-medium text-primary-700 shadow-warm' 
                          : 'text-surface-600 hover:glass-light hover:text-surface-900'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                      {active && (
                        <div className="ml-auto w-2 h-2 bg-gradient-primary rounded-full animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Mobile footer */}
            <div className="border-t border-glass-border p-6">
              {!user && !loading ? (
                <div className="space-y-3">
                  <Button 
                    variant="ghost" 
                    fullWidth 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/login" className="w-full">Log In</Link>
                  </Button>
                  <Button 
                    variant="primary" 
                    fullWidth 
                    glow
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/register" className="w-full">Get Started</Link>
                  </Button>
                </div>
              ) : user ? (
                <div className="space-y-4">
                  {/* User profile section */}
                  <div className="flex items-center space-x-3 p-4 glass-light rounded-2xl">
                    {user.photoURL ? (
                      <img 
                        className="h-12 w-12 rounded-2xl object-cover shadow-md" 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">
                          {user.displayName?.[0] || user.email?.[0] || '?'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-surface-900 truncate">
                        {user.displayName || 'User'}
                      </div>
                      <div className="text-sm text-surface-500 truncate">
                        {user.email}
                      </div>
                      <div className="text-xs text-primary-600 font-medium">
                        {userProfile?.tier || 'Free Plan'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick actions */}
                  <div className="space-y-2">
                    <Link
                      href="/settings/profile"
                      className="flex items-center space-x-3 p-3 rounded-xl hover:glass-light transition-all duration-200 text-surface-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                    
                    <Link
                      href="/settings/accounts"
                      className="flex items-center space-x-3 p-3 rounded-xl hover:glass-light transition-all duration-200 text-surface-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Connected Accounts</span>
                    </Link>
                    
                    <button
                      type="button"
                      className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-all duration-200 text-surface-700 hover:text-red-600"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 