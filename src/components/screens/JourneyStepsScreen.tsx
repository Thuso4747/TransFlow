import React, { useState } from 'react';
import { ScreenId, JourneyOption, JourneySearchParams } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import {
  Footprints,
  Bus,
  MapPin,
  Heart,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Info,
  Flag,
  ArrowRight,
  Check,
} from 'lucide-react';

interface JourneyStepsProps {
  onNavigate: (screen: ScreenId) => void;
  selectedJourney: JourneyOption | null;
  searchParams: JourneySearchParams;
  isSaved: boolean;
  onToggleSave: () => void;
  isDownloaded: boolean;
  onDownloadOffline: () => void;
  savedCount?: number;
}

export const JourneyStepsScreen: React.FC<JourneyStepsProps> = ({
  onNavigate,
  selectedJourney,
  searchParams,
  isSaved,
  onToggleSave,
  isDownloaded,
  onDownloadOffline,
  savedCount = 0,
}) => {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const fromPlace = searchParams.fromLocation || selectedJourney?.origin || 'Central interchange';
  const toPlace = searchParams.toLocation || selectedJourney?.destination || 'Northside campus';
  const fare = selectedJourney?.fare || 'R 22,00';
  const duration = selectedJourney ? `${selectedJourney.durationMinutes} min` : '40 min';
  const times = selectedJourney
    ? `${selectedJourney.departureTime} – ${selectedJourney.arrivalTime}`
    : '08:30 – 09:10';

  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} showBack backTo="journey-results" />

        <div className="px-5 pt-5 pb-2">
          
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            Your journey, made clearer.
          </h1>

          
          <div className="flex items-center gap-2 text-sm font-semibold text-[#555d71] mb-4">
            <span>{fromPlace}</span>
            <span className="text-[#84ad32] font-bold">→</span>
            <span>{toPlace}</span>
          </div>

          
          <div className="bg-white rounded-2xl p-4 border border-[#dedad0] grid grid-cols-3 text-center mb-5 shadow-2xs">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#798090] font-bold mb-0.5">
                Indicative Single
              </p>
              <p className="text-base font-extrabold text-[#0d1747]">{fare}</p>
            </div>
            <div className="border-x border-[#edeae2]">
              <p className="text-[9px] uppercase tracking-wider text-[#798090] font-bold mb-0.5">
                Total Time
              </p>
              <p className="text-base font-extrabold text-[#0d1747]">{duration}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#798090] font-bold mb-0.5">
                Departure
              </p>
              <p className="text-xs font-extrabold text-[#0d1747] mt-1">{times}</p>
            </div>
          </div>

          
          <div className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs mb-5 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#798090] mb-2">
              Follow your journey · Tue, 17 Nov 2026
            </h3>

            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#edeae2] flex items-center justify-center text-[#0d1747] shrink-0 mt-0.5">
                <Footprints className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0d1747]">
                    Walk to Central interchange · Bay A
                  </h4>
                  <span className="text-[10px] text-[#798090]">3 min</span>
                </div>
                <p className="text-[11px] text-[#555d71] mt-0.5">
                  Walk to Bay A. Follow the signed pedestrian path.
                </p>
              </div>
            </div>

            
            <div className="flex items-start gap-3 bg-[#f2f7e8] p-3.5 rounded-2xl border border-[#d6e5be]">
              <div className="w-8 h-8 rounded-xl bg-[#84ad32] text-white flex items-center justify-center font-black text-xs shrink-0">
                B
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[#0d1747]">
                    Board Line B – Northside campus
                  </h4>
                  <span className="text-[10px] text-[#556345] font-bold">18 min</span>
                </div>
                <p className="text-[11px] text-[#556345] mt-0.5">
                  Board Line B towards Northside Campus. Get off at Oak Street transfer bay.
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
                  <h4 className="text-xs font-bold text-[#0d1747]">
                    Walk to Oak Street · Bay B
                  </h4>
                  <span className="text-[10px] text-[#798090]">2 min</span>
                </div>
                <p className="text-[11px] text-[#555d71] mt-0.5">
                  Transfer across the marked pedestrian crossing to Bay B. Confirm the stop before boarding.
                </p>
              </div>
            </div>

            
            <div className="flex items-start gap-3 bg-[#f2f7e8] p-3.5 rounded-2xl border border-[#d6e5be]">
              <div className="w-8 h-8 rounded-xl bg-[#0d1747] text-white flex items-center justify-center font-black text-xs shrink-0">
                B
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[#0d1747]">
                    Board Line B – Northside campus
                  </h4>
                  <span className="text-[10px] text-[#556345] font-bold">17 min</span>
                </div>
                <p className="text-[11px] text-[#556345] mt-0.5">
                  Board Line B towards Northside Campus. Get off at Campus gate / Library entrance.
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold bg-white text-[#456d17] px-2 py-0.5 rounded border border-[#d2e2b9]">
                  R 10.00 · Indicative
                </span>
              </div>
            </div>

            
            <div className="flex items-start gap-3 pt-1">
              <MapPin className="w-5 h-5 text-[#84ad32] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#0d1747]">
                  Get off at Northside campus
                </h4>
                <p className="text-[11px] text-[#555d71] mt-0.5">
                  Confirm the drop-off point. Your journey ends here.
                </p>
              </div>
            </div>

            
            <div className="pt-2">
              <button
                onClick={() => onNavigate('route-map')}
                className="w-full bg-[#84ad32] hover:bg-[#749b29] text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>View route map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => alert('Standard Metrobus fares apply. Concessions available for registered learners, university students, and pensioners with MetroCard.')}
                className="text-[11px] font-bold text-[#0d1747] hover:underline"
              >
                Fare &amp; concessions →
              </button>
            </div>
          </div>

          
          <div className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs mb-5 space-y-3">
            <h3 className="text-xs font-extrabold text-[#0d1747] mb-1">
              Ready when you are.
            </h3>
            <p className="text-[11px] text-[#555d71] mb-2">
              Keep this journey close, download for offline, or share live updates with family.
            </p>

            
            <button
              onClick={onToggleSave}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                isSaved
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-white text-[#0d1747] border-[#dedad0] hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{isSaved ? 'Remove saved journey' : 'Save journey'}</span>
            </button>

            
            <button
              onClick={onDownloadOffline}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                isDownloaded
                  ? 'bg-[#f0f6e6] text-[#456d17] border-[#d2e2b9]'
                  : 'bg-[#0d1747] text-white hover:bg-[#15236b]'
              }`}
            >
              {isDownloaded ? <Check className="w-4 h-4 text-[#84ad32]" /> : <Download className="w-4 h-4" />}
              <span>{isDownloaded ? 'Downloaded for offline (38 KB)' : 'Download for offline'}</span>
            </button>

            
            <button
              onClick={() => onNavigate('sharing-consent')}
              className="w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 bg-[#f0eee6] hover:bg-[#e4e1d7] text-[#0d1747] transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#0d1747]" />
              <span>Start sharing</span>
            </button>
          </div>

          
          <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs mb-4">
            <button
              onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              className="w-full flex items-center justify-between text-xs font-bold text-[#0d1747]"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#798090]" />
                <span>About this information</span>
              </div>
              {isAboutExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isAboutExpanded && (
              <div className="mt-3 pt-3 border-t border-[#f0eee6] space-y-2 text-[11px] text-[#555d71]">
                <div className="flex justify-between">
                  <span className="text-[#798090]">Provider:</span>
                  <span className="font-semibold text-[#0d1747]">TransFlow fictional seed network</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#798090]">Last reviewed:</span>
                  <span>14 Oct 2026, 09:00 SAST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#798090]">Accessibility:</span>
                  <span>Unknown · confirm with operator</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('sources-data')}
                    className="text-xs font-bold text-[#0d1747] hover:underline"
                  >
                    Understand data labels →
                  </button>
                </div>
              </div>
            )}
          </div>

          
          <div className="text-center pb-3">
            <button
              onClick={() => onNavigate('report-issue')}
              className="text-xs font-bold text-[#0d1747] hover:underline flex items-center justify-center gap-1.5 mx-auto"
            >
              <Flag className="w-3.5 h-3.5 text-[#798090]" />
              <span>Report an issue</span>
            </button>
          </div>
        </div>
      </div>

      <BottomNav currentScreen="journey-steps" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
