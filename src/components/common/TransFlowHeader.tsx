import React from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { ScreenId } from '../../types/transit';
import transflowLogo from '../../assets/transflow-logo.png';
import { MoreDrawer } from './MoreDrawer';
import { useMoreMenu } from './MoreMenuContext';

interface TransFlowHeaderProps {
  onNavigate?: (screen: ScreenId) => void;
  showBack?: boolean;
  backTo?: ScreenId;
  onBack?: () => void;
  onOpenAccount?: () => void;
  className?: string;
}

export const TransFlowHeader: React.FC<TransFlowHeaderProps> = ({
  onNavigate,
  showBack = false,
  backTo,
  onBack,
  className = '',
}) => {
  const { isOpen, open, close, handleSelect, handleBackToMenu } = useMoreMenu();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (backTo === 'more') {
      handleBackToMenu();
      return;
    }
    if (onNavigate && backTo) {
      onNavigate(backTo);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 grid grid-cols-3 items-center py-3 px-4 bg-[#f7f6f2] border-b border-[#ece9e0] ${className}`}
      >
        <div className="flex items-center justify-start">
          {showBack && (backTo || onBack) ? (
            <button
              onClick={handleBack}
              className="p-1 -ml-1 text-[#0d1747] hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
          ) : null}
        </div>

        <button
          onClick={() => onNavigate && onNavigate('home-dashboard')}
          className="flex items-center justify-center"
          title="TransFlow home"
        >
          <img
            src={transflowLogo}
            alt="TransFlow"
            className="h-7 w-auto object-contain"
          />
        </button>

        <div className="flex items-center justify-end">
          <button
            onClick={open}
            className="p-1.5 -mr-1 text-[#0d1747] hover:opacity-70 flex items-center justify-center transition-opacity"
            title="More"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" strokeWidth={2.2} />
          </button>
        </div>
      </header>

      {isOpen && (
        <MoreDrawer isOpen={isOpen} onClose={close} onNavigate={handleSelect} />
      )}
    </>
  );
};
