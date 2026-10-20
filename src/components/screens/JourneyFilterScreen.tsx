import React, { useState } from 'react';
import { ScreenId, JourneyOption, JourneySearchParams } from '../../types/transit';
import { JOURNEY_RESULTS_DATA } from '../../data/mockData';
import {
  Pencil,
  Calendar,
  Filter,
  Heart,
  ChevronDown,
  Plus,
  Minus,
  Footprints,
  Bus,
  ArrowRight,
  SlidersHorizontal,
  X,
  Check,
} from 'lucide-react';
import { BottomNav } from '../common/BottomNav';
import { TransFlowHeader } from '../common/TransFlowHeader';

interface JourneyFilterProps {
  onNavigate: (screen: ScreenId) => void;
  searchParams?: JourneySearchParams;
  onSelectJourneyForMap?: (journey: JourneyOption) => void;
}

export const JourneyFilterScreen: React.FC<JourneyFilterProps> = ({
  onNavigate,
  searchParams,
  onSelectJourneyForMap,
}) => {
  const fromPlace = searchParams?.fromLocation || 'Central interchange';
  const toPlace = searchParams?.toLocation || 'Northside campus';
  const departString = searchParams?.leaveTime || 'Tue, 17 Oct · Depart at 08:15 SAST';

  const [journeys, setJourneys] = useState<JourneyOption[]>(() => {
    return JOURNEY_RESULTS_DATA.map((j) => ({
      ...j,
      origin: fromPlace,
      destination: toPlace,
    }));
  });
  const [sortBy, setSortBy] = useState<'earliest' | 'duration' | 'fare'>('earliest');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [expandedJourneyId, setExpandedJourneyId] = useState<string | null>('jr-1');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [transfersFilter, setTransfersFilter] = useState<'all' | 'direct' | 'one'>('all');
  const [crowdingFilter, setCrowdingFilter] = useState<'all' | 'seats'>('all');

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id: string) => {
    setExpandedJourneyId(expandedJourneyId === id ? null : id);
  };

  const handleSelectJourney = (journey: JourneyOption) => {
    if (onSelectJourneyForMap) {
      onSelectJourneyForMap(journey);
    }
    onNavigate('journey-map');
  };

  const filteredJourneys = journeys
    .filter((j) => {
      if (transfersFilter === 'direct' && !j.isDirect) return false;
      if (transfersFilter === 'one' && j.transfersCount > 1) return false;
      if (crowdingFilter === 'seats' && j.crowding !== 'Seats available') return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
      if (sortBy === 'fare') return parseInt(a.fare.replace(/\D/g, '')) - parseInt(b.fare.replace(/\D/g, ''));
      return a.departureTime.localeCompare(b.departureTime);
    });

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto">
      <TransFlowHeader onNavigate={onNavigate} />

      <div className="pt-5 px-4">
      
      <div className="mb-4">
        <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
          Find your way forward.
        </h1>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#555d71] mb-3">
          <span>{fromPlace}</span>
          <span className="text-[#84ad32] font-bold">➔</span>
          <span>{toPlace}</span>
        </div>

        
        <button
          onClick={() => onNavigate('home-dashboard')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0d1747] rounded-xl text-xs font-bold text-[#0d1747] hover:bg-[#0d1747] hover:text-white transition-all mb-4"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit search</span>
        </button>

        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <div className="bg-white border border-[#dedad0] rounded-xl px-3 py-1.5 flex items-center gap-1.5 font-semibold text-[#0d1747] shrink-0 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#555d71]" />
            <span>{departString}</span>
          </div>

          <div className="bg-white border border-[#dedad0] rounded-xl px-3 py-1.5 font-semibold text-[#0d1747] shrink-0 shadow-2xs">
            <span>Transfers allowed</span>
          </div>
        </div>
      </div>

      
      <div className="flex items-center justify-between py-2.5 mb-3 border-y border-[#e5e1d7]">
        <div className="flex items-center gap-1 text-xs font-bold text-[#0d1747]">
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-bold text-[#0d1747] focus:outline-hidden cursor-pointer"
          >
            <option value="earliest">Earliest departure</option>
            <option value="duration">Fastest duration</option>
            <option value="fare">Lowest fare</option>
          </select>
        </div>

        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-1.5 bg-white border border-[#0d1747] px-3 py-1 rounded-xl text-xs font-bold text-[#0d1747] hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
          <span className="w-2 h-2 rounded-full bg-[#84ad32]" />
        </button>
      </div>

      
      <div className="space-y-3.5">
        {filteredJourneys.map((journey) => {
          const isExpanded = expandedJourneyId === journey.id;
          const isFav = favorites[journey.id];

          return (
            <div
              key={journey.id}
              className="bg-white rounded-2xl p-4 border border-[#e5e1d7] shadow-xs hover:border-[#84ad32] transition-all"
            >
              
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-sm ${journey.badgeStyle}`}>
                  {journey.badge}
                </span>
                <button
                  onClick={(e) => toggleFavorite(journey.id, e)}
                  className="p-1 text-[#666f82] hover:text-red-500 transition-colors"
                  title="Save to favorites"
                >
                  <Heart
                    className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`}
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
                <button
                  onClick={() => toggleExpand(journey.id)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#0d1747] hover:text-[#84ad32] transition-colors"
                >
                  <span>{isExpanded ? 'Hide journey steps' : 'View journey steps'}</span>
                  <span>{isExpanded ? '−' : '+'}</span>
                </button>

                
                {isExpanded && (
                  <div className="mt-3 pt-2 border-t border-[#f0eee8] space-y-2.5">
                    {journey.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <div className="w-6 h-6 rounded-lg bg-[#edeae2] text-[#0d1747] flex items-center justify-center shrink-0 mt-0.5">
                          {step.type === 'walk' ? (
                            <Footprints className="w-3.5 h-3.5" />
                          ) : (
                            <Bus className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between font-bold text-[#0d1747]">
                            <span>{step.title}</span>
                            <span className="text-[#6d7589] font-medium">{step.duration}</span>
                          </div>
                          <p className="text-[11px] text-[#555d71] leading-relaxed">
                            {step.instruction}
                          </p>
                          {step.details && (
                            <p className="text-[10px] text-[#4b7a15] font-semibold mt-0.5">
                              {step.details}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="pt-2">
                      <button
                        onClick={() => handleSelectJourney(journey)}
                        className="w-full bg-[#84ad32] hover:bg-[#73992b] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98"
                      >
                        <span>Select this itinerary</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center">
          <div className="bg-white rounded-t-3xl max-w-md w-full p-5 max-h-[85vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between pb-4 border-b border-[#eeebe3]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#0d1747]" />
                <h3 className="font-extrabold text-lg text-[#0d1747]">
                  Filter Journeys
                </h3>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-[#555d71]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-[#0d1747] uppercase tracking-wider mb-2">
                  Transfers
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  {[
                    { id: 'all', label: 'Any Transfers' },
                    { id: 'direct', label: 'Direct Only' },
                    { id: 'one', label: 'Max 1 Transfer' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTransfersFilter(t.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        transfersFilter === t.id
                          ? 'border-[#0d1747] bg-[#0d1747] text-white font-bold'
                          : 'border-[#dbd7cc] bg-[#f9f8f5] text-[#0d1747]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              
              <div>
                <label className="block text-xs font-bold text-[#0d1747] uppercase tracking-wider mb-2">
                  Crowding Preference
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {[
                    { id: 'all', label: 'All Crowding Levels' },
                    { id: 'seats', label: 'Seats Available Only' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCrowdingFilter(c.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        crowdingFilter === c.id
                          ? 'border-[#0d1747] bg-[#0d1747] text-white font-bold'
                          : 'border-[#dbd7cc] bg-[#f9f8f5] text-[#0d1747]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setTransfersFilter('all');
                    setCrowdingFilter('all');
                  }}
                  className="flex-1 py-3 border border-[#dbd7cc] rounded-2xl text-xs font-bold text-[#555d71] hover:bg-slate-50"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-2 py-3 bg-[#0d1747] text-white rounded-2xl text-xs font-bold hover:bg-[#142161]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>

      
      <BottomNav currentScreen="journey-filter" onNavigate={onNavigate} />
    </div>
  );
};
