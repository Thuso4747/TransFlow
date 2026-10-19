import React, { useState } from 'react';
import { ScreenId } from '../../types/transit';
import { Layers, ChevronDown, Check, Smartphone, Monitor } from 'lucide-react';

interface ScreenSwitcherProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
}

const SCREENS: { id: ScreenId; label: string; tag: string }[] = [
  { id: 'onboarding-1', label: 'Onboarding 1', tag: 'Intro' },
  { id: 'onboarding-2', label: 'Onboarding 2', tag: 'Fares' },
  { id: 'onboarding-3', label: 'Onboarding 3', tag: 'Alerts' },
  { id: 'sign-in', label: 'Sign In', tag: 'Auth' },
  { id: 'create-profile', label: 'Create Profile', tag: 'Register' },
  { id: 'home-dashboard', label: 'Home Dashboard', tag: 'Plan' },
  { id: 'journey-map', label: 'Journey Map', tag: 'Map' },
  { id: 'journey-filter', label: 'Journey Results', tag: 'Filter' },
  { id: 'taxi-directory', label: 'Taxi Directory', tag: 'Taxis' },
  { id: 'route-directory', label: 'Route Directory', tag: 'Corridors' },
];

export const ScreenSwitcher: React.FC<ScreenSwitcherProps> = ({
  currentScreen,
  onSelectScreen,
  isDeviceFrame,
  onToggleDeviceFrame,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeScreenObj = SCREENS.find((s) => s.id === currentScreen) || SCREENS[0];

  return (
    <div className="sticky top-0 z-50 bg-[#0d1747] text-white shadow-md border-b border-[#1c2866]">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-[#1b2762] hover:bg-[#25357f] px-3 py-1.5 rounded-lg text-xs font-medium w-full text-left transition-all border border-white/10"
            title="Switch Figma Screen"
          >
            <Layers className="w-3.5 h-3.5 text-[#84ad32] shrink-0" />
            <span className="truncate flex-1">
              <span className="text-white/60 mr-1.5">Screen:</span>
              <span className="font-semibold text-white">{activeScreenObj.label}</span>
            </span>
            <span className="text-[10px] bg-[#84ad32]/20 text-[#a2d043] px-1.5 py-0.5 rounded font-mono">
              {activeScreenObj.tag}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0d1747] border border-white/15 rounded-xl shadow-2xl overflow-hidden max-h-[75vh] overflow-y-auto">
                <div className="p-2 border-b border-white/10 bg-[#080f33] flex items-center justify-between text-[11px] text-white/70">
                  <span className="font-semibold uppercase tracking-wider">All 10 Figma Screens</span>
                  <span className="text-white/40">10 of 10 ready</span>
                </div>
                <div className="p-1 space-y-0.5">
                  {SCREENS.map((screen, idx) => {
                    const isSelected = screen.id === currentScreen;
                    return (
                      <button
                        key={screen.id}
                        onClick={() => {
                          onSelectScreen(screen.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left ${
                          isSelected
                            ? 'bg-[#84ad32] text-white font-bold'
                            : 'hover:bg-white/10 text-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-[#0d1747] text-white' : 'bg-white/10 text-white/70'
                          }`}>
                            {idx + 1}
                          </span>
                          <span>{screen.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-black/20 text-white' : 'bg-white/10 text-white/60'
                          }`}>
                            {screen.tag}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Toggle between mobile frame & edge-to-edge view on larger displays */}
        <button
          onClick={onToggleDeviceFrame}
          className="shrink-0 p-1.5 bg-[#1b2762] hover:bg-[#25357f] border border-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
          title={isDeviceFrame ? "Show edge-to-edge view" : "Show mobile device frame"}
        >
          {isDeviceFrame ? (
            <Monitor className="w-3.5 h-3.5 text-white/70" />
          ) : (
            <Smartphone className="w-3.5 h-3.5 text-[#84ad32]" />
          )}
        </button>
      </div>
    </div>
  );
};
