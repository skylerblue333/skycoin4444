import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceCommandsUIProps {
  onCommand?: (command: string) => void;
}

export default function VoiceCommandsUI({ onCommand }: VoiceCommandsUIProps) {
  const [isListening, setIsListening] = useState(false);

  const handleToggle = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isListening ? 'default' : 'outline'}
        size="sm"
        onClick={handleToggle}
        className="gap-2"
      >
        <Mic className="w-4 h-4" />
        {isListening ? 'Listening...' : 'Voice'}
      </Button>
    </div>
  );
}
