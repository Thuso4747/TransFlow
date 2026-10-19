import React from 'react';
import { ScreenId } from '../../types/transit';
import { Heart, Menu } from 'lucide-react';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, savedCount = 0 }) => {
  const isPlanActive =
    currentScreen === 'home-dashboard' ||
    currentScreen === 'welcome' ||
    currentScreen === 'journey-planner' ||
    currentScreen === 'journey-results' ||
    currentScreen === 'journey-filter' ||
    currentScreen === 'journey-steps' ||
    currentScreen === 'journey-map' ||
    currentScreen === 'route-map' ||
    currentScreen === 'route-directory';

  const isTaxiActive = currentScreen === 'taxi-directory' || currentScreen === 'taxi-details' || currentScreen === 'report-issue' || currentScreen === 'report-received';

  const isSavedActive = currentScreen === 'saved-journeys' || currentScreen === 'offline-downloads' || currentScreen === 'offline-journey';

  const isMoreActive =
    currentScreen === 'more' ||
    currentScreen === 'settings' ||
    currentScreen === 'accessibility' ||
    currentScreen === 'language' ||
    currentScreen === 'clear-data' ||
    currentScreen === 'about' ||
    currentScreen === 'data-preferences' ||
    currentScreen === 'sources-data' ||
    currentScreen === 'help-faq' ||
    currentScreen === 'family-sharing' ||
    currentScreen === 'pair-viewer' ||
    currentScreen === 'sharing-consent' ||
    currentScreen === 'sharing-active' ||
    currentScreen === 'approved-viewer' ||
    currentScreen === 'updates-paused';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e5e2da] max-w-md mx-auto">
      <div className="flex items-center justify-around h-16 px-3">
        {/* Plan Tab */}
        <button
          onClick={() => onNavigate('home-dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isPlanActive ? 'text-[#0d1747]' : 'text-[#7e8597] hover:text-[#0d1747]'
          }`}
        >
          {/* Curved route line icon matching the PDF */}
          <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="19" r="3" />
            <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
            <circle cx="18" cy="5" r="3" />
          </svg>
          <span className={`text-[11px] mt-1 font-bold ${isPlanActive ? 'text-[#0d1747]' : 'text-[#7e8597]'}`}>
            Plan
          </span>
        </button>

        {/* Taxi Tab */}
        <button
          onClick={() => onNavigate('taxi-directory')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isTaxiActive ? 'text-[#0d1747]' : 'text-[#7e8597] hover:text-[#0d1747]'
          }`}
        >
          {/* Minibus Taxi icon matching PDF */}
          <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="13" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
          <span className={`text-[11px] mt-1 font-bold ${isTaxiActive ? 'text-[#0d1747]' : 'text-[#7e8597]'}`}>
            Taxi
          </span>
        </button>

        {/* Saved Tab */}
        <button
          onClick={() => onNavigate('saved-journeys')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
            isSavedActive ? 'text-[#0d1747]' : 'text-[#7e8597] hover:text-[#0d1747]'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${isSavedActive ? 'fill-[#0d1747] text-[#0d1747]' : 'text-[#7e8597]'}`} strokeWidth={2} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#84ad32] text-white text-[9px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </div>
          <span className={`text-[11px] mt-1 font-bold ${isSavedActive ? 'text-[#0d1747]' : 'text-[#7e8597]'}`}>
            Saved
          </span>
        </button>

        {/* More Tab */}
        <button
          onClick={() => onNavigate('more')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isMoreActive ? 'text-[#0d1747]' : 'text-[#7e8597] hover:text-[#0d1747]'
          }`}
        >
          <Menu className="w-5 h-5 stroke-current" strokeWidth={2.2} />
          <span className={`text-[11px] mt-1 font-bold ${isMoreActive ? 'text-[#0d1747]' : 'text-[#7e8597]'}`}>
            More
          </span>
        </button>
      </div>
    </nav>
  );
};
