import React from 'react';
import { ScreenId } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { ArrowRight, Check, Compass, Download, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  savedCount?: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate, savedCount = 0 }) => {
  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} />

        <div className="px-5 pt-6 pb-2">
          {/* Section Tag */}
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
            WELCOME TO TRANSFLOW
          </p>

          {/* Headline */}
          <h1 className="text-[34px] font-extrabold text-[#0d1747] tracking-tight leading-[1.08] mb-3">
            A clearer way<br />to get there.
          </h1>

          {/* Subtitle */}
          <p className="text-[13.5px] text-[#555d71] leading-relaxed mb-5">
            Know where to board, what to expect and how to find your way. One place for your everyday journey.
          </p>

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('journey-planner')}
            className="w-full bg-[#84ad32] hover:bg-[#749b29] active:scale-[0.99] text-white py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all mb-4"
          >
            <span>Plan journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Checklist row */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-semibold text-[#555d71] mb-6">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#84ad32]" />
              <span>Clear transit advice</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#84ad32]" />
              <span>Indicative fares</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#84ad32]" />
              <span>Offline directions</span>
            </span>
          </div>

          {/* Clarity Card matching PDF */}
          <div className="bg-[#0d1747] text-white rounded-3xl p-5 shadow-md mb-5 overflow-hidden relative">
            <p className="text-[9px] font-extrabold tracking-widest uppercase text-white/70 mb-3">
              A LITTLE CLARITY GOES A LONG WAY
            </p>

            {/* Schematic Network illustration */}
            <div className="bg-[#121c4e] border border-white/10 rounded-2xl p-3.5 mb-4 relative">
              <div className="flex items-center gap-1.5 text-[9px] text-white/60 mb-2">
                <Compass className="w-3 h-3 text-[#84ad32]" />
                <span>Schematic · demo network</span>
              </div>

              <svg viewBox="0 0 280 90" className="w-full h-20">
                {/* Background grid dots */}
                <circle cx="20" cy="45" r="1.5" fill="rgba(255,255,255,0.15)" />
                <circle cx="80" cy="20" r="1.5" fill="rgba(255,255,255,0.15)" />
                <circle cx="160" cy="70" r="1.5" fill="rgba(255,255,255,0.15)" />
                <circle cx="240" cy="30" r="1.5" fill="rgba(255,255,255,0.15)" />

                {/* Main line */}
                <path
                  d="M 25 60 Q 80 20, 140 45 T 255 30"
                  stroke="#84ad32"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Transfer branch */}
                <path
                  d="M 140 45 L 180 80"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  fill="none"
                />

                {/* Nodes */}
                <circle cx="25" cy="60" r="5" fill="#84ad32" stroke="#ffffff" strokeWidth="2" />
                <circle cx="140" cy="45" r="5" fill="#0d1747" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="255" cy="30" r="5" fill="#84ad32" stroke="#ffffff" strokeWidth="2" />
                <circle cx="180" cy="80" r="4" fill="#ffffff" />
              </svg>

              <div className="flex items-center justify-between text-[11px] text-white/80 pt-1">
                <span>Central Interchange</span>
                <span>Northside Campus</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-xs font-bold text-white">
                Central – Northside
              </span>
              <div className="text-right">
                <span className="text-sm font-black text-white">R 22.00</span>
                <span className="block text-[9px] text-white/60">demo estimate</span>
              </div>
            </div>
          </div>

          {/* Quick feature links */}
          <div className="space-y-2.5 mb-5">
            {/* Know before you board */}
            <div
              onClick={() => onNavigate('taxi-directory')}
              className="bg-white rounded-2xl p-4 border border-[#e5e1d7] flex items-center justify-between cursor-pointer hover:border-[#0d1747] transition-all shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#edeae2] flex items-center justify-center text-[#0d1747] shrink-0 mt-0.5">
                  <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="13" rx="2" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0d1747]">
                    Know before you board →
                  </h4>
                  <p className="text-[11px] text-[#555d71] mt-0.5">
                    Check taxi rank details and where information came from
                  </p>
                </div>
              </div>
            </div>

            {/* Keep your directions */}
            <div
              onClick={() => onNavigate('saved-journeys')}
              className="bg-white rounded-2xl p-4 border border-[#e5e1d7] flex items-center justify-between cursor-pointer hover:border-[#0d1747] transition-all shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#edeae2] flex items-center justify-center text-[#0d1747] shrink-0 mt-0.5">
                  <Download className="w-4 h-4 text-[#0d1747]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0d1747]">
                    Keep your directions
                  </h4>
                  <p className="text-[11px] text-[#555d71] mt-0.5">
                    Save a route or download a complete offline copy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transport names disclaimer */}
          <div className="p-3 bg-[#edeae2]/60 rounded-2xl border border-[#dedad0] text-[11px] text-[#555d71] leading-relaxed mb-4">
            Transport names, fares and timetables are fictional demo data. Confirm real travel details with the operator.
          </div>

          {/* Accessibility link */}
          <div className="text-center pb-4">
            <button
              onClick={() => onNavigate('accessibility')}
              className="text-xs font-bold text-[#0d1747] hover:underline"
            >
              Accessibility options →
            </button>
          </div>
        </div>
      </div>

      <BottomNav currentScreen="welcome" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
