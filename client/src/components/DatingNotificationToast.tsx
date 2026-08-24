import React from 'react';
import { Heart } from 'lucide-react';

interface DatingNotificationToastProps {
  message?: string;
  type?: 'match' | 'message' | 'like';
}

export function DatingNotificationToast({ message, type = 'message' }: DatingNotificationToastProps) {
  if (!message) return null;

  const icons = {
    match: <Heart className="w-5 h-5 text-red-500" />,
    message: <span>💬</span>,
    like: <Heart className="w-5 h-5 text-pink-500" />,
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg shadow-lg">
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

export default DatingNotificationToast;
