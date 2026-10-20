import React, { useState } from 'react';
import { ScreenId, JourneySearchParams, JourneyOption } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { Plus, Minus, RotateCcw, Info, Compass } from 'lucide-react';

interface RouteMapScreenProps {
  onNavigate: (screen: ScreenId) => void;
  searchParams: JourneySearchParams;
  selectedJourney: JourneyOption | null;
  savedCount?: number;
}

export const RouteMapScreen: React.FC<RouteMapScreenProps> = ({
  onNavigate,
  searchParams,
  selectedJourney,
  savedCount = 0,
}) => {
  const [zoom, setZoom] = useState(1);
  const fromPlace = searchParams.fromLocation || 'Central interchange';
  const toPlace = searchParams.toLocation || 'Northside campus';
  const fare = selectedJourney?.fare || 'R 22,00';
  const duration = selectedJourney ? `${selectedJourney.durationMinutes} min` : '40 min';
  const times = selectedJourney
    ? `${selectedJourney.departureTime} → ${selectedJourney.arrivalTime}`
    : '08:30 → 09:10';

  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} showBack backTo="journey-steps" />

        <div className="px-5 pt-5 pb-2">
          
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            Your route, at a glance.
          </h1>

          
          <div className="flex items-center gap-2 text-sm font-semibold text-[#555d71] mb-4">
            <span>{fromPlace}</span>
            <span className="text-[#84ad32] font-bold">→</span>
            <span>{toPlace}</span>
          </div>

          
          <div className="bg-white rounded-2xl p-4 border border-[#dedad0] grid grid-cols-2 text-center mb-5 shadow-2xs">
            <div>
              <p className="text-xl font-extrabold text-[#0d1747]">{fare}</p>
              <p className="text-[10px] text-[#798090]">Indicative single</p>
            </div>
            <div className="border-l border-[#edeae2]">
              <p className="text-xl font-extrabold text-[#0d1747]">{duration}</p>
              <p className="text-[10px] text-[#798090]">Total duration</p>
            </div>
          </div>

          
          <div className="bg-[#edeae2] p-3 rounded-2xl flex items-center justify-between text-xs mb-4">
            <span className="text-[#798090] font-semibold">Scheduled: SAST</span>
            <span className="font-extrabold text-[#0d1747]">{times}</span>
          </div>

          
          <div className="rounded-3xl border border-[#dedad0] overflow-hidden relative bg-[#eef3e8] p-4 shadow-inner mb-4">
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[10px] font-bold text-[#0d1747] shadow-2xs border border-white">
                <Compass className="w-3.5 h-3.5 text-[#84ad32]" />
                <span>Schematic · demo network</span>
              </div>

              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoom((z) => Math.min(z + 0.15, 1.3))}
                  className="w-7 h-7 bg-white hover:bg-slate-100 rounded-lg shadow-2xs border border-[#dedad0] flex items-center justify-center text-[#0d1747]"
                  title="Zoom in"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.max(z - 0.15, 0.8))}
                  className="w-7 h-7 bg-white hover:bg-slate-100 rounded-lg shadow-2xs border border-[#dedad0] flex items-center justify-center text-[#0d1747]"
                  title="Zoom out"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="w-7 h-7 bg-white hover:bg-slate-100 rounded-lg shadow-2xs border border-[#dedad0] flex items-center justify-center text-[#0d1747]"
                  title="Reset zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            
            <div
              className="transition-transform duration-300 origin-center py-2"
              style={{ transform: `scale(${zoom})` }}
            >
              <svg viewBox="0 0 320 220" className="w-full h-56 select-none">
                
                <rect x="0" y="0" width="320" height="220" fill="#f4f7ee" rx="16" />
                <line x1="20" y1="60" x2="300" y2="60" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                <line x1="20" y1="140" x2="300" y2="140" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                <line x1="160" y1="20" x2="160" y2="200" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />

                
                <circle cx="100" cy="100" r="28" fill="#e2edce" />
                <circle cx="230" cy="140" r="32" fill="#e2edce" />

                
                <path
                  d="M 50 160 Q 110 140, 160 110 T 270 50"
                  stroke="#84ad32"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />

                
                <path
                  d="M 160 110 L 175 125"
                  stroke="#0d1747"
                  strokeWidth="3"
                  strokeDasharray="4 3"
                  fill="none"
                />

                
                <circle cx="50" cy="160" r="7" fill="#ffffff" stroke="#0d1747" strokeWidth="3.5" />
                <text x="50" y="185" fill="#0d1747" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Central Interchange
                </text>

                
                <circle cx="160" cy="110" r="6" fill="#84ad32" stroke="#ffffff" strokeWidth="2.5" />
                <text x="160" y="95" fill="#0d1747" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Oak Street (Transfer)
                </text>

                
                <circle cx="270" cy="50" r="7" fill="#84ad32" stroke="#0d1747" strokeWidth="3.5" />
                <text x="270" y="35" fill="#0d1747" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Northside Campus
                </text>
              </svg>
            </div>
          </div>

          
          <div className="p-3.5 bg-white rounded-2xl border border-[#dedad0] flex items-start gap-2.5 text-xs text-[#555d71] shadow-2xs mb-4">
            <Info className="w-4 h-4 text-[#798090] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This schematic is a topological companion. It shows the same stops and legs as the text directions.
            </p>
          </div>
        </div>
      </div>

      <BottomNav currentScreen="route-map" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
