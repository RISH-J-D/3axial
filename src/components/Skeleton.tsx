import React from 'react';

// Simple gray skeleton placeholder with pulse animation
export const Skeleton: React.FC<{height?: string; width?: string; className?: string}> = ({height = 'h-4', width = 'w-full', className = ''}) => (
  <div className={`${height} ${width} bg-gray-200 rounded animate-pulse ${className}`} />
);

