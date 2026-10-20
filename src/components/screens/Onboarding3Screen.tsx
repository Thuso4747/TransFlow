import React from 'react';
import { ScreenId } from '../../types/transit';
import { ArrowRight } from 'lucide-react';
import onboardingAlerts from '../../assets/onboarding-alerts.jpg';
import transflowLogo from '../../assets/transflow-logo.png';

interface OnboardingProps {
  onNavigate: (screen: ScreenId) => void;
}

const IMAGE_FADE =
  'linear-gradient(to bottom, #000 0%, #000 38%, rgba(0,0,0,0.92) 50%, rgba(0,0,0,0.68) 62%, rgba(0,0,0,0.38) 74%, rgba(0,0,0,0.14) 86%, rgba(0,0,0,0.03) 94%, transparent 100%)';

export const Onboarding3Screen: React.FC<OnboardingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col max-w-md mx-auto bg-[#f7f6f2]">
      <div className="relative w-full h-[56vh] min-h-[320px] shrink-0 overflow-hidden">
        <img
          src={onboardingAlerts}
          alt="Passenger boarding a city bus"
          className="absolute inset-0 w-full h-full object-cover object-[center_38%]"
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
          Stay ahead of delays &amp; disruptions.
        </h1>
        <p className="text-[14px] text-[#555d71] leading-relaxed max-w-sm mx-auto">
          Get instant WhatsApp and SMS alerts for traffic bottlenecks, load shedding impacts, and corridor schedule shifts before you head out.
        </p>

        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="w-2 h-2 rounded-full bg-[#ccd3e0]" />
          <div className="w-2 h-2 rounded-full bg-[#ccd3e0]" />
          <div className="w-8 h-2 rounded-full bg-[#96BD47]" />
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={() => onNavigate('home-dashboard')}
            className="w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#0d1747]/15 transition-all"
          >
            <span>Get started</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('sign-in')}
            className="w-full py-3 text-sm font-semibold text-[#0d1747] hover:text-[#96BD47] transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>

        <p className="text-[11px] text-[#717b94] leading-relaxed">
          By continuing, you agree to TransFlow Commuter Terms of Service &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
};
