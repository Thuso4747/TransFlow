import React from 'react';
import { ScreenId, TaxiRank } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { Check, Flag, FileText, ArrowRight } from 'lucide-react';

interface TaxiRankDetailsProps {
  onNavigate: (screen: ScreenId) => void;
  selectedRank: TaxiRank | null;
  savedCount?: number;
}

export const TaxiRankDetailsScreen: React.FC<TaxiRankDetailsProps> = ({
  onNavigate,
  selectedRank,
  savedCount = 0,
}) => {
  const rank = selectedRank || {
    id: 'rank-1',
    name: 'Central taxi rank',
    destination: 'To Northside terminal',
    fareStatus: 'indicative' as const,
    fareRange: 'R 20,00 – R 25,00',
    source: 'TransFlow fictional seed network',
    lastReviewed: '14 Oct 2026, 09:00 SAST',
    isDemo: true,
    description: '',
    popularDestinations: [],
    boardingTips: '',
    connectingBus: '',
  };

  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} showBack backTo="taxi-directory" />

        <div className="px-5 pt-5 pb-2">
          
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            {rank.name}
          </h1>

          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-[#555d71] font-semibold">{rank.destination}</span>
          </div>

          
          <div className="bg-[#f0f6e6] rounded-2xl p-4 border border-[#d6e5be] mb-5">
            <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#456d17] mb-0.5">
              Indicative single fare
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#0d1747]">{rank.fareRange}</span>
              <span className="text-[11px] text-[#456d17] font-semibold">indicative</span>
            </div>
          </div>

          
          <div className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs mb-5 space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b border-[#f0eee6]">
              <span className="text-[#798090]">Destination</span>
              <span className="font-bold text-[#0d1747]">{rank.destination.replace('To ', '')}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#f0eee6]">
              <span className="text-[#798090]">Source</span>
              <span className="font-medium text-[#0d1747]">{rank.source}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#f0eee6]">
              <span className="text-[#798090]">Fare reviewed</span>
              <span className="font-medium text-[#0d1747]">{rank.lastReviewed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#798090]">Availability</span>
              <span className="font-medium text-[#0d1747]">Unknown · no live feed</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('sources-data')}
                className="text-xs font-bold text-[#0d1747] hover:underline flex items-center gap-1"
              >
                <span>View source reference</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          
          <div className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs mb-5 space-y-2.5 text-xs text-[#555d71]">
            <div className="flex items-start gap-2.5">
              <span className="text-[#84ad32] font-black text-sm leading-none">•</span>
              <p>Ask at the rank to confirm the boarding bay and direction.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-[#84ad32] font-black text-sm leading-none">•</span>
              <p>Confirm the actual fare and payment method.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-[#84ad32] font-black text-sm leading-none">•</span>
              <p>Departure time and seats are not guaranteed.</p>
            </div>
          </div>

          
          <button
            onClick={() => onNavigate('report-issue')}
            className="w-full bg-[#0d1747] hover:bg-[#15236b] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Flag className="w-4 h-4 text-white" />
            <span>Report an issue</span>
          </button>
        </div>
      </div>

      <BottomNav currentScreen="taxi-details" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
