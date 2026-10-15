import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[110] max-w-sm animate-fadeIn" role="status">
      <div className="flex items-start gap-3 border border-line border-l-[3px] border-l-green bg-white px-5 py-4 shadow-[0_20px_50px_-15px_rgba(14,99,224,0.35)]">
        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green" strokeWidth={2} />
        <span className="text-[14px] leading-snug text-ink">{message}</span>
        <button onClick={onClose} className="ml-2 text-muted transition-colors hover:text-ink" aria-label="Dismiss">
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
};
