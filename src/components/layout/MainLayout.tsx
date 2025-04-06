'use client'; // Mark this as a Client Component

import React from 'react';
import { Inter } from "next/font/google"; // Keep font import if used for className
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout (Client Component)
 * Wraps the application content with providers, navbar, footer, and toaster.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    // Apply font className and layout structure here
    <div className={`${inter.className} flex flex-col min-h-screen`}>
      <AuthProvider>
        <NotificationsProvider>
          <Toaster 
            position="top-center" 
            reverseOrder={false} 
            toastOptions={{
              duration: 5000,
              style: {
                  background: '#363636',
                  color: '#fff',
              },
              success: {
                  duration: 3000,
                  theme: {
                      primary: 'green',
                      secondary: 'black',
                  },
              },
              error: {
                  duration: 5000,
              }
            }}
          />
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children} 
          </main>
          <Footer />
        </NotificationsProvider>
      </AuthProvider>
    </div>
  );
}; 