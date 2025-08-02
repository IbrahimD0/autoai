import React from 'react';
import cn from 'classnames';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  className,
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-orange-500 text-white border-orange-500',
    secondary: 'bg-gray-100 text-gray-700 border-gray-200',
    destructive: 'bg-red-500 text-white border-red-500',
    outline: 'bg-transparent border-gray-300 text-gray-700'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;