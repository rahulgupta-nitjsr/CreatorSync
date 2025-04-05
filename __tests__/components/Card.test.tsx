import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/common/Card/Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div data-testid="card-content">Test content</div>
      </Card>
    );
    
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders title and subtitle when provided', () => {
    render(
      <Card title="Test Title" subtitle="Test Subtitle">
        Card content
      </Card>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(<Card data-testid="default-card">Default variant</Card>);
    
    const card = screen.getByTestId('default-card');
    expect(card.className).toContain('bg-white');
    expect(card.className).toContain('shadow-md');
  });

  it('applies different variant styles correctly', () => {
    render(<Card data-testid="outlined-card" variant="outlined">Outlined variant</Card>);
    
    const card = screen.getByTestId('outlined-card');
    expect(card.className).toContain('bg-white');
    expect(card.className).toContain('border');
    expect(card.className).toContain('border-gray-200');
    expect(card.className).not.toContain('shadow-md');
  });

  it('renders without padding when noPadding is true', () => {
    render(
      <Card noPadding>
        <div data-testid="content">No padding content</div>
      </Card>
    );
    
    const contentContainer = screen.getByTestId('content').parentElement;
    expect(contentContainer.className).not.toContain('p-6');
  });

  it('renders footer actions when provided', () => {
    const footerContent = <button>Footer Button</button>;
    
    render(
      <Card footerActions={footerContent}>
        Card with footer
      </Card>
    );
    
    expect(screen.getByRole('button', { name: 'Footer Button' })).toBeInTheDocument();
    expect(screen.getByText('Card with footer')).toBeInTheDocument();
  });

  it('renders header actions when provided', () => {
    const headerContent = <button>Header Button</button>;
    
    render(
      <Card title="Card Title" headerActions={headerContent}>
        Card with header actions
      </Card>
    );
    
    expect(screen.getByRole('button', { name: 'Header Button' })).toBeInTheDocument();
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card with header actions')).toBeInTheDocument();
  });
}); 