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
    default: 'bg-zinc-900 text-white border-zinc-900',
    secondary: 'bg-zinc-100 text-zinc-900 border-zinc-200',
    destructive: 'bg-red-500 text-white border-red-500',
    outline: 'bg-transparent border-zinc-300 text-zinc-900'
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