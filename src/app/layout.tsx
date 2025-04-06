import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Keep font if used by MainLayout
import "./globals.css";
// Remove client-side imports like Navbar, Footer, AppProviders, Toaster
import { MainLayout } from "@/components/layout/MainLayout"; // Import the new client layout component

// Font instance can stay if MainLayout needs the className
const inter = Inter({ subsets: ["latin"] }); 

// Metadata export remains here in the Server Component
export const metadata: Metadata = {
  title: "CreatorSync - Manage Your Content",
  description: "Sync your content across TikTok, Instagram Reels, and X.",
};

/**
 * RootLayout (Server Component)
 * Sets up HTML structure and renders the client-side MainLayout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Remove className from body here if it's applied inside MainLayout */}
      <body> 
        {/* Render the MainLayout client component, passing children */}
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
} 