// CardWrapper.tsx
import React from 'react';

interface CardWrapperProps {
  children: React.ReactNode;
  category?: string;
}

const categoryColors = {
  work: 'bg-blue-50',
  personal: 'bg-purple-50',
  shopping: 'bg-green-50',
  health: 'bg-red-50',
  default: 'bg-gray-50'
};

const CardWrapper: React.FC<CardWrapperProps> = ({ children, category = 'default' }) => {
  const backgroundColor = categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
  
  return (
    <div className={`${backgroundColor} shadow-lg rounded-lg p-6 border border-gray-100`}>
      {children}
    </div>
  );
};

export default CardWrapper;