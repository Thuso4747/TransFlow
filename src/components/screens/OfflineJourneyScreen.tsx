import React, { useState } from 'react';
import { ScreenId } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { AlertCircle, Footprints, Bus, MapPin, Compass, Info } from 'lucide-react';

interface OfflineJourneyProps {
  onNavigate: (screen: ScreenId) => void;
  savedCount?: number;
}

export const OfflineJourneyScreen: React.FC<OfflineJourneyProps> = ({
  onNavigate,
  savedCount = 0,
}) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} showBack backTo="offline-downloads" />

        <div className="px-5 pt-5 pb-2">
          
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            Directions you can count on offline.
          </h1>

          
          <p className="text-[13px] text-[#555d71] leading-relaxed mb-4">
            Offline copies are stored on this device. Fares and service information can become outdated.
          </p>

          
          <div className="p-3.5 bg-[#fff8e6] border border-[#f5dfa6] rounded-2xl flex items-start gap-2.5 mb-5 text-[11px] text-[#8a5b00]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold">Offline copy:</span> Downloaded 16 Oct 2026, 09:00 SAST. No live availability or family updates can refresh here.
            </p>
          </div>

          
          <div className="bg-white rounded-2xl p-4 border border-[#dedad0] grid grid-cols-2 text-center mb-4 shadow-2xs">
            <div>
              <p className="text-xl font-extrabold text-[#0d1747]">R 22,00</p>
              <p className="text-[10px] text-[#798090]">Indicative total fare</p>
            </div>
            <div className="border-l border-[#edeae2]">
              <p className="text-xl font-extrabold text-[#0d1747]">40 min</p>
              <p className="text-[10px] text-[#798090]">Total duration</p>
            </div>
          </div>

          
          <div className="bg-[#edeae2] p-3 rounded-2xl flex items-center justify-between text-xs mb-4">
            <span className="text-[#798090] font-semibold">Scheduled: SAST</span>
            <span className="font-extrabold text-[#0d1747]">08:30 → 09:10</span>
          </div>

          
          <div className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs mb-4 space-y-4">
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#edeae2] flex items-center justify-center text-[#0d1747] shrink-0 mt-0.5">
                <Footprints className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0d1747]">Walk to Central interchange · Bay A</h4>
                  <span className="text-[10px] text-[#798090]">3 min</span>
                </div>
                <p className="text-[11px] text-[#555d71] mt-0.5">
                  Walk to Bay A. Follow the signed pedestrian path.
                </p>
              </div>
            </div>

            
            <div className="flex items-start gap-3 bg-[#f2f7e8] p-3 rounded-2xl border border-[#d6e5be]">
              <div className="w-8 h-8 rounded-xl bg-[#84ad32] text-white flex items-center justify-center font-black text-xs shrink-0">
                B
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[#0d1747]">Board Line B – Northside campus</h4>
                  <span className="text-[10px] text-[#556345] font-bold">18 min</span>
                </div>
                <p className="text-[11px] text-[#556345] mt-0.5">
                  Get off at Oak Street · Bay B.
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold bg-white text-[#456d17] px-2 py-0.5 rounded border border-[#d2e2b9]">
                  R 12.00 · Indicative
                </span>
              </div>
            </div>

            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#edeae2] flex items-center justify-center text-[#0d1747] shrink-0 mt-0.5">
                <Footprints className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0d1747]">Walk to Oak Street · Bay B</h4>
                  <span className="text-[10px] text-[#798090]">2 min</span>
                </div>
                <p className="text-[11px] text-[#555d71] mt-0.5">
                  Transfer across marked pedestrian crossing to Bay B.
                </p>
              </div>
            </div>

            
            <div className="flex items-start gap-3 bg-[#f2f7e8] p-3 rounded-2xl border border-[#d6e5be]">
              <div className="w-8 h-8 rounded-xl bg-[#0d1747] text-white flex items-center justify-center font-black text-xs shrink-0">
                B
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[#0d1747]">Board Line B – Northside campus</h4>
                  <span className="text-[10px] text-[#556345] font-bold">17 min</span>
                </div>
                <p className="text-[11px] text-[#556345] mt-0.5">
                  Get off at Campus gate / Library entrance.
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold bg-white text-[#456d17] px-2 py-0.5 rounded border border-[#d2e2b9]">
                  R 10.00 · Indicative
                </span>
              </div>
            </div>

            
            <div className="flex items-start gap-3 pt-1">
              <MapPin className="w-5 h-5 text-[#84ad32] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#0d1747]">Get off at Northside campus</h4>
                <p className="text-[11px] text-[#555d71] mt-0.5">
                  Confirm the drop-off point. Your journey ends here.
                </p>
              </div>
            </div>
          </div>

          
          <div className="bg-[#edeae2] p-4 rounded-3xl border border-[#dedad0] mb-5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0d1747] mb-2">
              <Compass className="w-3.5 h-3.5 text-[#84ad32]" />
              <span>Schematic · demo network snapshot</span>
            </div>
            <svg viewBox="0 0 300 80" className="w-full h-16">
              <path d="M 30 50 Q 100 20, 160 40 T 270 30" stroke="#84ad32" strokeWidth="4" fill="none" />
              <circle cx="30" cy="50" r="5" fill="#ffffff" stroke="#0d1747" strokeWidth="2.5" />
              <circle cx="160" cy="40" r="4.5" fill="#84ad32" stroke="#ffffff" strokeWidth="2" />
              <circle cx="270" cy="30" r="5" fill="#84ad32" stroke="#0d1747" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>

      <BottomNav currentScreen="offline-downloads" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
