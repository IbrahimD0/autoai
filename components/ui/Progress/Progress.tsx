import React from 'react';
import cn from 'classnames';

interface ProgressProps {
  value: number;
  className?: string;
  max?: number;
}

const Progress: React.FC<ProgressProps> = ({ value, className, max = 100 }) => {
  const percentage = Math.min(Math.max(0, value), max) / max * 100;
  
  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2.5 overflow-hidden', className)}>
      <div
        className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default Progress;