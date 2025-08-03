'use client'; // Mark this as a Client Component

import React from 'react';
import { Inter } from "next/font/google"; // Keep font import if used for className
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
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
    <div className={`${inter.className} min-h-screen`}>
      <AuthProvider>
        <NotificationsProvider>
          <Toaster 
            position="top-center" 
            reverseOrder={false} 
            toastOptions={{
              duration: 5000,
              style: {
                background: 'rgba(55, 65, 81, 0.95)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              },
              success: {
                duration: 3000,
                style: {
                  background: 'rgba(34, 197, 94, 0.95)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: 'rgba(239, 68, 68, 0.95)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                },
              }
            }}
          />
          <Navbar />
          <main className="min-h-screen">
            {children} 
          </main>
          <Footer />
        </NotificationsProvider>
      </AuthProvider>
    </div>
  );
}; 