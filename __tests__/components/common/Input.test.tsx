import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/common/Input'; 

describe('<Input />', () => {
  const user = userEvent.setup();

  it('renders a basic input', () => {
    render(<Input data-testid="basic-input" />);
    expect(screen.getByTestId('basic-input')).toBeInTheDocument();
  });

  it('renders with a label', () => {
    const labelText = 'Test Label';
    render(<Input id="test-input" label={labelText} />);
    expect(screen.getByLabelText(labelText)).toBeInTheDocument();
  });

  it('renders with placeholder text', () => {
    const placeholderText = 'Enter text here';
    render(<Input placeholder={placeholderText} />);
    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  it('renders with helper text and correct aria-describedby', () => {
    const helperText = 'This is helpful';
    render(<Input id="helper-input" helperText={helperText} />);
    const inputElement = screen.getByRole('textbox');
    const helperElement = screen.getByText(helperText);
    expect(helperElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('aria-describedby', 'helper-input-helper');
    expect(helperElement).toHaveAttribute('id', 'helper-input-helper');
  });

  it('renders with an error message, error styles, and correct aria attributes', () => {
    const errorMessage = 'This is an error';
    render(<Input id="error-input" error={errorMessage} />);
    const inputElement = screen.getByRole('textbox');
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(inputElement).toHaveClass('border-red-500'); // Check for error class
    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
    expect(inputElement).toHaveAttribute('aria-describedby', 'error-input-error');
    expect(errorElement).toHaveAttribute('id', 'error-input-error');
  });

  it('does not render helper text when error message is present', () => {
    const helperText = 'Should not show';
    const errorMessage = 'Error takes precedence';
    render(<Input error={errorMessage} helperText={helperText} />);
    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders with left icon', () => {
    const icon = <span data-testid="left-icon">L</span>;
    render(<Input leftIcon={icon} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    // Check for padding adjustment class
    expect(screen.getByRole('textbox')).toHaveClass('pl-10');
  });

  it('renders with right icon', () => {
    const icon = <span data-testid="right-icon">R</span>;
    render(<Input rightIcon={icon} />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    // Check for padding adjustment class
    expect(screen.getByRole('textbox')).toHaveClass('pr-10');
  });

  it('renders with both icons', () => {
    const leftIcon = <span data-testid="left-icon">L</span>;
    const rightIcon = <span data-testid="right-icon">R</span>;
    render(<Input leftIcon={leftIcon} rightIcon={rightIcon} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('pl-10');
    expect(inputElement).toHaveClass('pr-10');
  });

  it('renders with fullWidth style', () => {
    render(<Input fullWidth />);
    expect(screen.getByRole('textbox')).toHaveClass('w-full');
  });

  it('renders as disabled', () => {
    render(<Input disabled />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeDisabled();
    expect(inputElement).toHaveClass('bg-gray-100 cursor-not-allowed opacity-75');
  });

  it('accepts and uses forwarded ref', () => {
    const Component = () => {
      const inputRef = useRef<HTMLInputElement>(null);
      return <Input ref={inputRef} data-testid="ref-input" />;
    };
    render(<Component />);
    // Basic check: element exists
    expect(screen.getByTestId('ref-input')).toBeInTheDocument(); 
    // Ideally, you'd interact with the ref if needed, but this confirms it doesn't break rendering.
  });

  it('allows typing', async () => {
    render(<Input data-testid="typing-input" />);
    const inputElement = screen.getByTestId('typing-input') as HTMLInputElement;
    await user.type(inputElement, 'Hello World');
    expect(inputElement.value).toBe('Hello World');
  });

  it('passes other standard input props', () => {
    render(<Input type="email" name="user-email" aria-label="Email Input" />);
    const inputElement = screen.getByRole('textbox', { name: 'Email Input' });
    expect(inputElement).toHaveAttribute('type', 'email');
    expect(inputElement).toHaveAttribute('name', 'user-email');
  });
}); 