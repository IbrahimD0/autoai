import React from 'react';
import cn from 'classnames';

interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, className }) => {
  return (
    <div className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-orange-100 text-orange-700 font-medium',
      className
    )}>
      {children}
    </div>
  );
};

const Avatar: React.FC<AvatarProps> = ({ children, className }) => {
  return (
    <div className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}>
      {children}
    </div>
  );
};

export default Avatar;