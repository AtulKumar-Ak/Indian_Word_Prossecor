import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TooltipButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

const TooltipButton = ({ icon: Icon, label, onClick, isActive, disabled }: TooltipButtonProps) => {
  return (
    <div className="relative group flex items-center justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded-sm transition-colors flex items-center justify-center
          ${isActive ? 'bg-blue-900/40 text-blue-400' : 'text-gray-300 hover:bg-zinc-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <Icon size={18} strokeWidth={2} />
      </button>
      
      {/* Tooltip */}
      <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-gray-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-md border border-zinc-700">
        {label}
      </div>
    </div>
  );
};

export default TooltipButton;