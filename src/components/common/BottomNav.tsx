import React from 'react';
import { ScreenId } from '../../types/transit';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  savedCount?: number;
}

const PLAN_SCREENS: ScreenId[] = [
  'home-dashboard',
  'welcome',
  'journey-planner',
  'journey-filter',
  'journey-results',
];

const TRIP_SCREENS: ScreenId[] = ['journey-map', 'journey-steps'];

const ROUTES_SCREENS: ScreenId[] = ['route-directory', 'route-map'];

const SAVED_SCREENS: ScreenId[] = ['saved-journeys', 'offline-downloads', 'offline-journey'];

function PlanIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M0 0h24v24H0z" fill="none" />
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          d="M5.778 16C4.666 16.633 4 17.439 4 18.316C4 20.35 7.582 22 12 22s8-1.65 8-3.684c0-.877-.666-1.683-1.778-2.316"
        />
        <path d="M12.998 7h-1.996c-2.87 0-4.805 3.07-3.674 5.828a1 1 0 0 0 .918.633h.703c.237 0 .444.17.501.41l.905 3.786c.189.79.867 1.343 1.645 1.343s1.456-.554 1.645-1.343l.905-3.786a.52.52 0 0 1 .5-.41h.704a1 1 0 0 0 .918-.633C17.804 10.069 15.869 7 12.999 7Z" />
        <path d="M14.5 4.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z" />
      </g>
    </svg>
  );
}

function SavedIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="M22 4.67v12.07c0 .96-.78 1.86-1.74 1.98l-.33.04c-2.18.29-5.54 1.4-7.46 2.46c-.26.15-.69.15-.96 0l-.04-.02c-1.92-1.05-5.27-2.15-7.44-2.44l-.29-.04C2.78 18.6 2 17.7 2 16.74V4.66c0-1.19.97-2.09 2.16-1.99c2.1.17 5.28 1.23 7.06 2.34l.25.15c.29.18.77.18 1.06 0l.17-.11c.63-.39 1.43-.78 2.3-1.13V8l2-1.33L19 8V2.78c.27-.05.53-.08.77-.1h.06c1.19-.1 2.17.79 2.17 1.99m-10 .82v15" />
        <path d="M19 2.78V8l-2-1.33L15 8V3.92c1.31-.52 2.77-.94 4-1.14" />
      </g>
    </svg>
  );
}

function RoutesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      className={className}
      aria-hidden
    >
      <path d="M0 0h20v20H0z" fill="none" />
      <path
        fill="currentColor"
        d="M7.878 1.878a3 3 0 0 1 4.243 0l5.998 6a3 3 0 0 1 0 4.242l-5.998 5.999a3 3 0 0 1-4.243 0l-6-6a3 3 0 0 1 0-4.242zm3.535.707a2 2 0 0 0-2.828 0l-5.998 6a2 2 0 0 0 0 2.827l5.998 6a2 2 0 0 0 2.828 0l5.999-6a2 2 0 0 0 0-2.828zm-.767 2.562a.5.5 0 0 1 .707 0l2 2a.5.5 0 0 1 0 .707l-2 2a.5.5 0 0 1-.707-.707L11.793 8H10a2 2 0 0 0-2 2v3a.5.5 0 0 1-1 0v-3a3 3 0 0 1 3-3h1.793l-1.147-1.146a.5.5 0 0 1 0-.707"
      />
    </svg>
  );
}

function TripIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.75.75a4.5 4.5 0 0 1 4.5 4.5c0 1.921-2.688 5.577-3.909 7.138a.75.75 0 0 1-1.182 0c-1.221-1.562-3.909-5.217-3.909-7.138a4.5 4.5 0 0 1 4.5-4.5m-18 22.5l6-15m15 15l-3-7.5m-7.5 7.5v-1.5m0-4.5v-1.5m0-4.5v-1.5"
        />
        <path d="M18.75 5.625a.375.375 0 0 1 0-.75m0 .75a.375.375 0 0 0 0-.75" />
      </g>
    </svg>
  );
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, savedCount = 0 }) => {
  const tabs = [
    {
      id: 'plan',
      label: 'Plan',
      screen: 'home-dashboard' as ScreenId,
      active: PLAN_SCREENS.includes(currentScreen),
      icon: PlanIcon,
    },
    {
      id: 'trip',
      label: 'Trip',
      screen: 'journey-map' as ScreenId,
      active: TRIP_SCREENS.includes(currentScreen),
      icon: TripIcon,
    },
    {
      id: 'routes',
      label: 'Routes',
      screen: 'route-directory' as ScreenId,
      active: ROUTES_SCREENS.includes(currentScreen),
      icon: RoutesIcon,
    },
    {
      id: 'saved',
      label: 'Saved',
      screen: 'saved-journeys' as ScreenId,
      active: SAVED_SCREENS.includes(currentScreen),
      icon: SavedIcon,
      badge: savedCount,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e5e2da] max-w-md mx-auto">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.active;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.screen)}
              className={`flex flex-col items-center justify-center flex-1 py-1 min-w-0 ${
                isActive ? 'text-[#0d1747]' : 'text-[#7e8597]'
              }`}
            >
              <div className="relative leading-none">
                <Icon className="w-6 h-6" strokeWidth={2} />
                {tab.badge ? (
                  <span className="absolute -top-1 -right-2 bg-[#96BD47] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-xs mt-1 font-semibold leading-none ${isActive ? 'text-[#0d1747]' : 'text-[#7e8597]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
