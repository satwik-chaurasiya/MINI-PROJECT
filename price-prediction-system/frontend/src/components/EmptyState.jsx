import React from 'react';
import { PackageSearch, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmptyState({ 
  icon: Icon = PackageSearch, 
  title = "No items found", 
  description = "Start exploring to populate this section with real-time tracking.", 
  actionText = "Explore Deals", 
  actionLink = "/compare",
  onAction = null
}) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionLink) {
      navigate(actionLink);
    }
  };

  return (
    <div className="py-14 px-4 text-center flex flex-col items-center justify-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-emerald-400 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <div className="max-w-sm space-y-1">
        <h3 className="text-base font-semibold text-white font-display">{title}</h3>
        <p className="text-xs text-gray-400 font-light leading-relaxed">{description}</p>
      </div>
      {actionText && (
        <button
          onClick={handleAction}
          className="btn-primary btn-shimmer px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer mt-2"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
