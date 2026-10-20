import React from 'react';
import { ScreenId } from '../../types/transit';
import { ArrowRight } from 'lucide-react';
import onboardingBus from '../../assets/onboarding-hero.jpg';
import transflowLogo from '../../assets/transflow-logo.png';

interface OnboardingProps {
  onNavigate: (screen: ScreenId) => void;
}

const IMAGE_FADE =
  'linear-gradient(to bottom, #000 0%, #000 38%, rgba(0,0,0,0.92) 50%, rgba(0,0,0,0.68) 62%, rgba(0,0,0,0.38) 74%, rgba(0,0,0,0.14) 86%, rgba(0,0,0,0.03) 94%, transparent 100%)';

export const Onboarding1Screen: React.FC<OnboardingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col max-w-md mx-auto bg-[#f7f6f2]">
      
      <div className="relative w-full h-[56vh] min-h-[320px] shrink-0 overflow-hidden">
        <img
          src={onboardingBus}
          alt="Blue city bus moving through Johannesburg at dusk"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{
            WebkitMaskImage: IMAGE_FADE,
            maskImage: IMAGE_FADE,
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        />
        <div className="absolute top-0 inset-x-0 z-10 flex justify-center pt-5 pointer-events-none">
          <img
            src={transflowLogo}
            alt="TransFlow"
            className="h-8 w-auto object-contain"
            style={{
              filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.45)) drop-shadow(0 1px 0 rgba(255,255,255,0.25))',
            }}
          />
        </div>
      </div>

      
      <div className="relative z-10 -mt-28 px-6 pb-8 flex-1 flex flex-col justify-end space-y-4 text-center">
        <h1 className="text-3xl font-extrabold text-[#0d1747] tracking-tight leading-tight">
          Seamless travel across Johannesburg.
        </h1>
        <p className="text-[14px] text-[#555d71] leading-relaxed max-w-sm mx-auto">
          Connect buses, commuter taxis, and metro lines in one intuitive map. Plan your daily commute with reliable schedules and step-by-step directions.
        </p>

        
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="w-8 h-2 rounded-full bg-[#96BD47]" />
          <div className="w-2 h-2 rounded-full bg-[#ccd3e0]" />
          <div className="w-2 h-2 rounded-full bg-[#ccd3e0]" />
        </div>

        
        <div className="pt-4">
          <button
            onClick={() => onNavigate('onboarding-2')}
            className="w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#0d1747]/15 transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        
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
