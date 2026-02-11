import React from 'react';

interface ShelbyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ShelbyLogo: React.FC<ShelbyLogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <img 
      src="/shelby-logo.jpg" 
      alt="Shelby" 
      className={`${sizes[size]} rounded-full object-cover shadow-lg ${className}`}
    />
  );
};

export default ShelbyLogo;
