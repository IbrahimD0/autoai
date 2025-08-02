import React, { ReactNode } from 'react';
import cn from 'classnames';

interface Props {
  title?: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
};

export default function Card({ title, description, footer, children, className }: Props) {
  const hasTitle = title !== undefined;
  
  if (!hasTitle) {
    // For cards without title (like in dashboard), use the provided className
    return (
      <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', className)}>
        {children}
      </div>
    );
  }
  
  // For cards with title (like signin forms), use light styling
  return (
    <div className="w-full max-w-md m-auto my-8 bg-white border border-gray-200 rounded-2xl shadow-lg">
      <div className="px-8 py-8">
        <h3 className="mb-2 text-3xl font-bold text-gray-900">{title}</h3>
        {description && <p className="text-gray-600 mb-6">{description}</p>}
        {children}
      </div>
      {footer && (
        <div className="px-8 py-6 border-t rounded-b-2xl border-gray-200 bg-gray-50 text-gray-600">
          {footer}
        </div>
      )}
    </div>
  );
}
