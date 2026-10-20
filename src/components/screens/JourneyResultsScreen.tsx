import React, { useState } from 'react';
import { ScreenId, JourneyOption, JourneySearchParams } from '../../types/transit';
import { JOURNEY_RESULTS_DATA } from '../../data/mockData';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { ResultsFilterModal } from '../modals/ResultsFilterModal';
import {
  Pencil,
  Calendar,
  Filter,
  Heart,
  Footprints,
  Bus,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

interface JourneyResultsProps {
  onNavigate: (screen: ScreenId) => void;
  searchParams: JourneySearchParams;
  onSelectJourney: (journey: JourneyOption) => void;
  savedJourneys: string[];
  onToggleSaveJourney: (journeyId: string) => void;
  savedCount?: number;
}

export const JourneyResultsScreen: React.FC<JourneyResultsProps> = ({
  onNavigate,
  searchParams,
  onSelectJourney,
  savedJourneys,
  onToggleSaveJourney,
  savedCount = 0,
}) => {
  const fromPlace = searchParams.fromLocation || 'Central interchange';
  const toPlace = searchParams.toLocation || 'Northside campus';
  const [currentSort, setCurrentSort] = useState<'fastest' | 'earliest' | 'transfers' | 'fare'>('fastest');
  const [maxTransfers, setMaxTransfers] = useState('all');
  const [walkingPreference, setWalkingPreference] = useState('any');
  const [busCorridors, setBusCorridors] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const journeys = JOURNEY_RESULTS_DATA.map((j) => ({
    ...j,
    origin: fromPlace,
    destination: toPlace,
  }));

  const filteredJourneys = journeys
    .filter((j) => {
      if (maxTransfers === '0' && !j.isDirect) return false;
      if (maxTransfers === '1' && j.transfersCount > 1) return false;
      if (maxTransfers === '2' && j.transfersCount > 2) return false;
      return true;
    })
    .sort((a, b) => {
      if (currentSort === 'fastest') return a.durationMinutes - b.durationMinutes;
      if (currentSort === 'fare') return parseInt(a.fare.replace(/\D/g, '')) - parseInt(b.fare.replace(/\D/g, ''));
      if (currentSort === 'transfers') return a.transfersCount - b.transfersCount;
      return a.departureTime.localeCompare(b.departureTime);
    });

  const handleCardClick = (j: JourneyOption) => {
    onSelectJourney(j);
    onNavigate('journey-steps');
  };

  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} showBack backTo="journey-planner" />

        <div className="px-5 pt-5 pb-2">
          
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            Find your way forward.
          </h1>

          
          <div className="flex items-center gap-2 text-sm font-semibold text-[#555d71] mb-3">
            <span>{fromPlace}</span>
            <span className="text-[#84ad32] font-bold">→</span>
            <span>{toPlace}</span>
          </div>

          
          <button
            onClick={() => onNavigate('journey-planner')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0d1747] rounded-xl text-xs font-bold text-[#0d1747] hover:bg-[#0d1747] hover:text-white transition-all mb-4"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit search</span>
          </button>

          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs mb-3">
            <div className="bg-white border border-[#dedad0] rounded-xl px-3 py-1.5 flex items-center gap-1.5 font-semibold text-[#0d1747] shrink-0 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#555d71]" />
              <span>Tue, 17 Nov 2026 · SAST 08:15</span>
            </div>

            <div className="bg-white border border-[#dedad0] rounded-xl px-3 py-1.5 font-semibold text-[#0d1747] shrink-0 shadow-2xs">
              <span>Transfers allowed</span>
            </div>
          </div>

          
          <div className="flex items-center justify-between py-2 mb-3 border-y border-[#e5e1d7]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0d1747]">
              <span className="text-[#798090]">Sort:</span>
              <select
                value={currentSort}
                onChange={(e) => setCurrentSort(e.target.value as any)}
                className="bg-transparent font-bold text-[#0d1747] focus:outline-hidden cursor-pointer"
              >
                <option value="fastest">Fastest</option>
                <option value="earliest">Earliest departure</option>
                <option value="transfers">Fewest transfers</option>
                <option value="fare">Lowest fare</option>
              </select>
            </div>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-1.5 bg-white border border-[#0d1747] px-3 py-1 rounded-xl text-xs font-bold text-[#0d1747] hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              <span className="w-2 h-2 rounded-full bg-[#84ad32]" />
            </button>
          </div>

          
          <div className="space-y-3.5">
            {filteredJourneys.map((journey) => {
              const isSaved = savedJourneys.includes(journey.id);

              return (
                <div
                  key={journey.id}
                  onClick={() => handleCardClick(journey)}
                  className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs hover:border-[#84ad32] transition-all cursor-pointer"
                >
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-sm ${journey.badgeStyle}`}>
                      {journey.badge}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveJourney(journey.id);
                      }}
                      className="p-1 text-[#666f82] hover:text-red-500 transition-colors"
                      title="Save to favorites"
                    >
                      <Heart
                        className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </button>
                  </div>

                  
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-3">
                    <div>
                      <p className="text-2xl font-extrabold text-[#0d1747] leading-tight">
                        {journey.departureTime}
                      </p>
                      <p className="text-[11px] text-[#555d71] font-medium leading-tight truncate">
                        {journey.origin}
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold text-[#555d71] mb-1">
                        {journey.durationMinutes} min
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="bg-[#edeae2] px-2 py-0.5 rounded text-[10px] font-bold text-[#0d1747] flex items-center gap-1">
                          <Bus className="w-3 h-3 text-[#0d1747]" />
                          <span>{journey.busLine}</span>
                        </span>
                        {!journey.isDirect && (
                          <>
                            <span className="text-[10px] text-[#8e96a8]">&amp;</span>
                            <span className="bg-[#edeae2] px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#0d1747]">
                              4m walk
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-[9px] text-[#717b94] mt-0.5">
                        • {journey.transferDetails}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-[#0d1747] leading-tight">
                        {journey.arrivalTime}
                      </p>
                      <p className="text-[11px] text-[#555d71] font-medium leading-tight truncate">
                        {journey.destination}
                      </p>
                    </div>
                  </div>

                  
                  <div className="flex items-center justify-between pt-2 pb-2 text-xs">
                    <div>
                      <span className="font-extrabold text-[#0d1747] text-base">
                        {journey.fare}
                      </span>
                      <p className="text-[10px] text-[#717b94]">
                        {journey.fareType}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#717b94]">Crowding: </span>
                      <span className={`text-[11px] font-extrabold ${journey.crowdingColor}`}>
                        {journey.crowding}
                      </span>
                    </div>
                  </div>

                  
                  <div className="border-t border-dashed border-[#e0dcce] pt-2 mt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#0d1747] hover:text-[#84ad32] transition-colors">
                      <span>View journey steps</span>
                      <span>+</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ResultsFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentSort={currentSort}
        onSelectSort={setCurrentSort}
        maxTransfers={maxTransfers}
        onSelectMaxTransfers={setMaxTransfers}
        walkingPreference={walkingPreference}
        onSelectWalkingPreference={setWalkingPreference}
        busCorridors={busCorridors}
        onToggleBusCorridors={setBusCorridors}
        onReset={() => {
          setCurrentSort('fastest');
          setMaxTransfers('all');
          setWalkingPreference('any');
          setBusCorridors(true);
        }}
      />

      <BottomNav currentScreen="journey-results" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
