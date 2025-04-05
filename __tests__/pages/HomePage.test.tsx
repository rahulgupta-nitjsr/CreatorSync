import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => {
    return <img src={src} alt={alt} />;
  },
}));

describe('HomePage', () => {
  it('renders the hero section', () => {
    render(<HomePage />);
    
    // Check for main heading
    expect(screen.getByText(/Manage Your Creator Business Across Platforms/i)).toBeInTheDocument();
    
    // Check for subheading
    expect(screen.getByText(/CreatorSync helps you streamline content management/i)).toBeInTheDocument();
    
    // Check for CTA buttons
    expect(screen.getByRole('link', { name: /Start for free/i })).toBeInTheDocument();
    
    // Use getAllByRole since there are multiple "Learn more" links
    const learnMoreLinks = screen.getAllByRole('link', { name: /Learn more/i });
    expect(learnMoreLinks.length).toBeGreaterThan(0);
  });

  it('renders the features section', () => {
    render(<HomePage />);
    
    // Check for features title
    expect(screen.getByText(/All Your Creator Tools in One Place/i)).toBeInTheDocument();
    
    // Check for feature descriptions
    expect(screen.getByText(/CreatorSync brings together everything you need/i)).toBeInTheDocument();
    
    // Check for specific feature cards (look for headings)
    expect(screen.getByText(/Unified Content Studio/i)).toBeInTheDocument();
    expect(screen.getByText(/Create, schedule, and publish content/i)).toBeInTheDocument();
  });

  it('has correct navigation links', () => {
    render(<HomePage />);
    
    // Check for Sign up and Login links
    const signUpLink = screen.getByRole('link', { name: /Sign up/i });
    const loginLink = screen.getByRole('link', { name: /Log in/i });
    
    expect(signUpLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
    
    // Check the href attributes
    expect(signUpLink).toHaveAttribute('href', '/app/(auth)/register');
    expect(loginLink).toHaveAttribute('href', '/app/(auth)/login');
  });

  it('renders feature cards with proper sections', () => {
    render(<HomePage />);
    
    // Get all "Learn more" links to count feature cards
    const learnMoreLinks = screen.getAllByText(/Learn more/i);
    
    // There should be at least one feature card
    expect(learnMoreLinks.length).toBeGreaterThan(0);
    
    // Check for feature icon presence
    const featureIcons = document.querySelectorAll('svg');
    expect(featureIcons.length).toBeGreaterThan(0);
  });
}); 