import React from "react";
import { Heart } from "lucide-react";

interface DatingNotificationToastProps {
  message: string;
  type?: "match" | "message" | "like";
}

export function DatingNotificationToast({
  message,
  type = "message",
}: DatingNotificationToastProps) {
  const icons = {
    match: <Heart className="h-5 w-5 text-red-500" />,
    message: <span aria-hidden="true">Message</span>,
    like: <Heart className="h-5 w-5 text-pink-500" />,
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-lg">
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

export default DatingNotificationToast;
