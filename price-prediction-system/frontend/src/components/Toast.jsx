import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: 'bg-[#06110C]/95 border-emerald-500/40 text-emerald-300',
    error: 'bg-[#171717]/95 border-[#A31C1B]/60 text-rose-300',
    info: 'bg-[#171717]/95 border-[#A31C1B]/40 text-rose-200'
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />,
    error: <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />,
    info: <Info className="w-4 h-4 shrink-0 text-rose-300" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl text-xs font-medium max-w-md ${styles[type] || styles.info}`}>
        {icons[type] || icons.info}
        <span className="flex-1">{message}</span>
        {onClose && (
          <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity p-0.5 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
