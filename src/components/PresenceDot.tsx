import type { UserStatus } from '../types';

interface PresenceDotProps {
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function PresenceDot({ status, size = 'md' }: PresenceDotProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-400',
    busy: 'bg-red-500',
    invisible: 'bg-gray-500',
  };

  return (
    <div className={`rounded-full ${sizeClasses[size]} ${statusColors[status]} ring-2 ring-uq-navy`} />
  );
}
