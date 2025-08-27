import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-black border border-[#333] rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;