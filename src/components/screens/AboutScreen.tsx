import React from 'react';
import { ScreenId } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { ArrowRight, ShieldCheck, Users } from 'lucide-react';

interface AboutScreenProps {
  onNavigate: (screen: ScreenId) => void;
  savedCount?: number;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onNavigate, savedCount = 0 }) => {
  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

        <div className="px-5 pt-5 pb-2">
          {/* Tag */}
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
            OUR PROJECT
          </p>

          {/* Title */}
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            Know before you go.
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] text-[#555d71] leading-relaxed mb-6">
            Clearer information for everyday journeys.
          </p>

          {/* Project Attribution Card matching Screen 18 */}
          <div className="bg-white rounded-3xl p-6 border border-[#e5e1d7] shadow-xs mb-5">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#0d1747] flex items-center justify-center text-white">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17l9.2-9.2M17 17V7.8H7.8" stroke="#84ad32" strokeWidth="2.5" />
                </svg>
              </div>
              <span className="font-extrabold text-lg text-[#0d1747]">TRANSFLOW</span>
            </div>

            <p className="text-xs text-[#0d1747] font-semibold leading-relaxed mb-4">
              A CTU Software Engineer Year 2 student project by <span className="font-extrabold underline">Elmey Stapelberg</span>.
            </p>

            <p className="text-xs text-[#555d71] leading-relaxed mb-5">
              Journey steps, indicative fares, taxi information and optional consent-based family sharing, brought into one responsive interface.
            </p>

            {/* Spec Table */}
            <div className="bg-[#f7f6f2] rounded-2xl p-3.5 border border-[#dedad0] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#798090]">Build:</span>
                <span className="font-bold text-[#0d1747]">2.0.0 · Working local app</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#798090]">Transport network:</span>
                <span className="font-bold text-[#0d1747]">Seeded demo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#798090]">Storage:</span>
                <span className="font-bold text-[#0d1747]">Local browser + local SQLite server</span>
              </div>
            </div>
          </div>

          {/* Privacy made visible card */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs mb-5 space-y-3 text-xs text-[#555d71]">
            <h3 className="font-extrabold text-sm text-[#0d1747]">
              Privacy, made visible.
            </h3>
            <p className="leading-relaxed">
              Sharing is optional and time-limited. The server retains only the latest location point while active; it removes coordinates at stop or expiry. Minimal non-location consent records expire after the configured retention period (default 30 days).
            </p>
            <p className="leading-relaxed">
              Background location delivery depends on browser, permission, GPS and connectivity. This is not an emergency service.
            </p>

            <div className="pt-2 border-t border-[#f0eee6]">
              <button
                onClick={() => onNavigate('family-sharing')}
                className="font-bold text-[#0d1747] hover:underline flex items-center gap-1.5"
              >
                <span>Family sharing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav currentScreen="about" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
