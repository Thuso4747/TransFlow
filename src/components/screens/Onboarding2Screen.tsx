import React from 'react';
import { ScreenId } from '../../types/transit';
import { ArrowRight, CreditCard, ShieldCheck, Wallet } from 'lucide-react';

interface OnboardingProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Onboarding2Screen: React.FC<OnboardingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-between px-6 py-8 max-w-md mx-auto">
      {/* Top illustration container */}
      <div className="flex-1 flex items-center justify-center py-6">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#e8f1d8]/50 rounded-full blur-2xl transform scale-90" />
          <div className="relative w-56 h-56 rounded-3xl bg-gradient-to-b from-[#f2f6ea] to-[#e4edd2] border border-[#d6e5be] shadow-inner p-5 flex flex-col justify-between overflow-hidden">
            {/* MetroCard Mockup graphic */}
            <div className="w-full bg-[#0d1747] text-white p-4 rounded-2xl shadow-md border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-widest font-extrabold uppercase text-[#84ad32]">
                  Joburg MetroCard
                </span>
                <CreditCard className="w-4 h-4 text-white/80" />
              </div>
              <div className="text-sm font-mono tracking-widest text-white/90 mb-2">
                9400 •••• •••• 0192
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/70">
                <span>Commuter Tap</span>
                <span className="text-white font-bold bg-[#84ad32] px-2 py-0.5 rounded text-[10px]">
                  R 124.50
                </span>
              </div>
            </div>

            {/* Transparent rank fare badge */}
            <div className="flex items-center gap-3 bg-white/95 p-3 rounded-2xl shadow-sm border border-white">
              <div className="w-8 h-8 rounded-xl bg-[#84ad32]/20 text-[#4b7a15] flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#717b94] font-semibold uppercase">Taxi Rank Fare</p>
                <p className="text-xs font-extrabold text-[#0d1747]">R 20,00 – R 25,00</p>
              </div>
              <ShieldCheck className="w-4 h-4 text-[#84ad32]" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-extrabold text-[#0d1747] tracking-tight leading-tight">
          Know before you go. Transparent fares.
        </h1>
        <p className="text-[14px] text-[#555d71] leading-relaxed max-w-sm mx-auto">
          No unexpected costs or taxi rank confusion. Check indicative rank fares, link your MetroCard, and tap seamlessly with real-time balance tracking.
        </p>

        {/* Stepper Dots: 2nd Active */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="w-2 h-2 rounded-full bg-[#ccd3e0]" />
          <div className="w-8 h-2 rounded-full bg-[#5d7d1e]" />
          <div className="w-2 h-2 rounded-full bg-[#ccd3e0]" />
        </div>

        {/* Primary Action Button */}
        <div className="pt-4">
          <button
            onClick={() => onNavigate('onboarding-3')}
            className="w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#0d1747]/15 transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Link */}
        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigate('sign-in')}
            className="text-xs font-semibold text-[#0d1747] hover:underline"
          >
            Skip to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
