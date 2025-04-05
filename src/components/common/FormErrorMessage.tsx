import React from 'react';

interface FormErrorMessageProps {
  error?: string | null;
  className?: string;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ 
  error, 
  className = '' 
}) => {
  if (!error) return null;

  return (
    <p className={`text-sm text-red-600 mt-1 ${className}`} role="alert">
      {error}
    </p>
  );
};

export default FormErrorMessage; 