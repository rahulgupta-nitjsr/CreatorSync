import React from 'react';
import { render, screen } from '@testing-library/react';
import FormErrorMessage from '@/components/common/FormErrorMessage';

describe('<FormErrorMessage />', () => {
  it('should render the error message when an error prop is provided', () => {
    const errorMessage = 'This is an error';
    render(<FormErrorMessage error={errorMessage} />);
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('text-sm text-red-600 mt-1');
  });

  it('should render nothing when the error prop is null', () => {
    const { container } = render(<FormErrorMessage error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when the error prop is undefined', () => {
    const { container } = render(<FormErrorMessage />); // error is undefined
    expect(container.firstChild).toBeNull();
  });

  it('should apply additional className when provided', () => {
    const errorMessage = 'Another error';
    const customClass = 'my-custom-class';
    render(<FormErrorMessage error={errorMessage} className={customClass} />);
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toHaveClass('text-sm text-red-600 mt-1', customClass);
  });

  it('should have role="alert" for accessibility', () => {
    const errorMessage = 'Alert error';
    render(<FormErrorMessage error={errorMessage} />);
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
  });
}); 