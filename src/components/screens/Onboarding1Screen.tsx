import React from 'react';
import { ScreenId } from '../../types/transit';
import { ArrowRight, Bus, MapPin, Navigation } from 'lucide-react';

interface OnboardingProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Onboarding1Screen: React.FC<OnboardingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-between px-6 py-8 max-w-md mx-auto">
      {/* Top illustration container */}
      <div className="flex-1 flex items-center justify-center py-6">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Subtle geometric background rings */}
          <div className="absolute inset-0 bg-[#e8f1d8]/50 rounded-full blur-2xl transform scale-90" />
          <div className="relative w-56 h-56 rounded-3xl bg-gradient-to-b from-[#f2f6ea] to-[#e4edd2] border border-[#d6e5be] shadow-inner p-6 flex flex-col justify-between overflow-hidden">
            {/* Transit Map lines graphic */}
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 200 200">
              <path d="M 20 160 Q 70 80 140 100 T 190 40" stroke="#84ad32" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M 10 90 Q 90 120 180 150" stroke="#0d1747" strokeWidth="4" strokeDasharray="6 4" fill="none" />
              <circle cx="70" cy="88" r="6" fill="#0d1747" stroke="#ffffff" strokeWidth="3" />
              <circle cx="140" cy="100" r="6" fill="#84ad32" stroke="#ffffff" strokeWidth="3" />
            </svg>

            <div className="flex justify-between items-start z-10">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-[#0d1747]">
                <Bus className="w-6 h-6 text-[#0d1747]" />
              </div>
              <div className="px-3 py-1 bg-[#84ad32] text-white text-[11px] font-bold rounded-full shadow-xs">
                Metrobus
              </div>
            </div>

            <div className="z-10 flex items-center gap-3 bg-white/90 backdrop-blur-xs p-3 rounded-2xl shadow-sm border border-white">
              <div className="w-8 h-8 rounded-xl bg-[#0d1747] text-white flex items-center justify-center">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#717b94] font-medium">Corridor A</p>
                <p className="text-xs font-bold text-[#0d1747] truncate">Park Station → Rosebank</p>
              </div>
              <span className="text-[11px] font-bold text-[#84ad32]">36m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-extrabold text-[#0d1747] tracking-tight leading-tight">
          Seamless travel across Johannesburg.
        </h1>
        <p className="text-[14px] text-[#555d71] leading-relaxed max-w-sm mx-auto">
          Connect buses, commuter taxis, and metro lines in one intuitive map. Plan your daily commute with reliable schedules and step-by-step directions.
        </p>

        {/* Stepper Dots: 1st Active */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="w-8 h-2 rounded-full bg-[#8fb339]" />
          <div className="w-2 h-2 rounded-full bg-[#ccd3e0]" />
          <div className="w-2 h-2 rounded-full bg-[#ccd3e0]" />
        </div>

        {/* Primary Action Button */}
        <div className="pt-4">
          <button
            onClick={() => onNavigate('onboarding-2')}
            className="w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#0d1747]/15 transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-between pt-2 px-1 text-xs font-semibold">
          <button
            onClick={() => onNavigate('sign-in')}
            className="text-[#0d1747] hover:underline"
          >
            Already have an account? Sign In
          </button>
          <button
            onClick={() => onNavigate('create-profile')}
            className="text-[#4b7a15] hover:underline font-bold"
          >
            Skip to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
