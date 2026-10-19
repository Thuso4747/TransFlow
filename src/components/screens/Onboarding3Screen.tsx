import React from 'react';
import { ScreenId } from '../../types/transit';
import { ArrowRight, Lock } from 'lucide-react';
import { TransFlowLogo } from '../common/TransFlowLogo';

interface OnboardingProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Onboarding3Screen: React.FC<OnboardingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-between px-6 py-8 max-w-md mx-auto">
      {/* Top Logo Container */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="text-center">
          <TransFlowLogo size="lg" />
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-extrabold text-[#0d1747] tracking-tight leading-tight">
          Stay ahead of delays &amp; disruptions.
        </h1>
        <p className="text-[14px] text-[#555d71] leading-relaxed max-w-sm mx-auto">
          Get instant WhatsApp and SMS alerts for traffic bottlenecks, load shedding impacts, and corridor schedule shifts before you head out.
        </p>

        {/* Stepper Dots: 3rd Active */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="w-2 h-2 rounded-full bg-[#ccd3e0]" />
          <div className="w-2 h-2 rounded-full bg-[#ccd3e0]" />
          <div className="w-8 h-2 rounded-full bg-[#5d7d1e]" />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <button
            onClick={() => onNavigate('home-dashboard')}
            className="w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#0d1747]/15 transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('sign-in')}
            className="w-full bg-[#e8f0fe] hover:bg-[#dbe7fd] active:scale-[0.99] text-[#0d1747] py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all border border-[#d2e3fc]"
          >
            <Lock className="w-4 h-4 text-[#5d7d1e]" />
            <span>Sign In</span>
          </button>
        </div>

        {/* Terms footer */}
        <p className="text-[11px] text-[#717b94] pt-2 leading-relaxed">
          By continuing, you agree to TransFlow Commuter Terms of Service &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
};
