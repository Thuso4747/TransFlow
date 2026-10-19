import React from 'react';
import { User, ArrowLeft } from 'lucide-react';
import { ScreenId } from '../../types/transit';

interface TransFlowHeaderProps {
  onNavigate?: (screen: ScreenId) => void;
  showBack?: boolean;
  backTo?: ScreenId;
  onOpenAccount?: () => void;
  className?: string;
}

export const TransFlowHeader: React.FC<TransFlowHeaderProps> = ({
  onNavigate,
  showBack = false,
  backTo,
  onOpenAccount,
  className = '',
}) => {
  return (
    <header className={`flex items-center justify-between py-3 px-4 bg-[#f7f6f2] border-b border-[#ece9e0] ${className}`}>
      {/* Left: Back button or TransFlow logo */}
      <div className="flex items-center gap-2.5">
        {showBack && onNavigate && backTo ? (
          <button
            onClick={() => onNavigate(backTo)}
            className="p-1 -ml-1 text-[#0d1747] hover:bg-slate-200/60 rounded-lg transition-colors flex items-center gap-1.5"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
        ) : null}

        <button
          onClick={() => onNavigate && onNavigate('welcome')}
          className="flex items-center gap-2 group text-left"
        >
          {/* Logo icon */}
          <div className="w-7 h-7 rounded-full bg-[#0d1747] flex items-center justify-center text-white shrink-0 shadow-2xs">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" strokeWidth="2" strokeOpacity="0.25" />
              <path d="M7 17l9.2-9.2M17 17V7.8H7.8" stroke="#84ad32" strokeWidth="2.5" />
            </svg>
          </div>
          <span className="font-extrabold text-[15px] tracking-wider text-[#0d1747] group-hover:text-[#1c2e8a] transition-colors">
            TRANSFLOW
          </span>
        </button>
      </div>


      {/* Right: User Icon */}
      <button
        onClick={() => {
          if (onOpenAccount) {
            onOpenAccount();
          } else if (onNavigate) {
            onNavigate('settings');
          }
        }}
        className="w-8 h-8 rounded-full border border-[#dedad0] bg-white hover:bg-slate-100 flex items-center justify-center text-[#0d1747] shadow-2xs transition-colors"
        title="Account & Settings"
      >
        <User className="w-4 h-4 text-[#0d1747]" />
      </button>
    </header>
  );
};
