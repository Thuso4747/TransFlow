import React, { useState } from 'react';
import { ScreenId, JourneySearchParams } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { LocationConsentModal } from '../modals/LocationConsentModal';
import {
  ArrowUpDown,
  Calendar,
  Clock,
  Compass,
  Download,
  MapPin,
  Search,
  X,
  ChevronDown,
} from 'lucide-react';

interface JourneyPlannerProps {
  onNavigate: (screen: ScreenId) => void;
  searchParams: JourneySearchParams;
  onUpdateSearchParams: (params: Partial<JourneySearchParams>) => void;
  savedCount?: number;
}

export const JourneyPlannerScreen: React.FC<JourneyPlannerProps> = ({
  onNavigate,
  searchParams,
  onUpdateSearchParams,
  savedCount = 0,
}) => {
  const [fromLocation, setFromLocation] = useState(searchParams.fromLocation || 'Central interchange');
  const [toLocation, setToLocation] = useState(searchParams.toLocation || 'Northside campus');
  const [leaveDate, setLeaveDate] = useState(searchParams.leaveDate || '2026-11-17');
  const [leaveTime, setLeaveTime] = useState(searchParams.leaveTime || '08:15');
  const [whenType, setWhenType] = useState<'Depart at' | 'Arrive by'>(searchParams.whenType || 'Depart at');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
    onUpdateSearchParams({ fromLocation: toLocation, toLocation: temp });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSearchParams({
      fromLocation,
      toLocation,
      leaveDate,
      leaveTime,
      whenType,
    });
    onNavigate('journey-results');
  };

  const handleUseLocation = () => {
    setFromLocation('Park Station (Current stop nearby)');
    onUpdateSearchParams({ fromLocation: 'Park Station (Current stop nearby)' });
  };

  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} />

        <div className="px-5 pt-6 pb-2">
          {/* Section Tag */}
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
            LET&apos;S GET YOU THERE
          </p>

          {/* Headline */}
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-2">
            Where are you going?
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] text-[#555d71] leading-relaxed mb-5">
            Plan a journey with clearer information, from the first step to the last.
          </p>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#e5e1d7] mb-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f0eee6]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#0d1747]">Plan your journey</span>
              </div>
              <span className="text-[10px] font-bold text-[#84ad32] bg-[#f0f6e6] px-2 py-0.5 rounded-full border border-[#dce9c9]">
                Demo network
              </span>
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
              {/* FROM */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1">
                  From
                </label>
                <div className="relative flex items-center bg-[#f7f6f2] rounded-2xl border border-[#dedad0] px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#0d1747]">
                  <div className="w-4 h-4 rounded-full border-2 border-[#0d1747] mr-2.5 shrink-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0d1747]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Enter starting stop"
                    className="w-full bg-transparent text-xs font-bold text-[#0d1747] focus:outline-hidden"
                  />
                  {fromLocation && (
                    <button
                      type="button"
                      onClick={() => setFromLocation('')}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Swap Places Button */}
              <div className="flex justify-center -my-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[#0d1747] hover:text-[#1d2d7c] bg-[#f7f6f2] hover:bg-[#edeae2] px-3 py-1 rounded-full border border-[#dedad0] transition-colors"
                >
                  <ArrowUpDown className="w-3 h-3" />
                  <span>Swap places</span>
                </button>
              </div>

              {/* TO */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1">
                  To
                </label>
                <div className="relative flex items-center bg-[#f7f6f2] rounded-2xl border border-[#dedad0] px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#0d1747]">
                  <MapPin className="w-4 h-4 text-[#0d1747] mr-2.5 shrink-0" />
                  <input
                    type="text"
                    required
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Enter destination stop"
                    className="w-full bg-transparent text-xs font-bold text-[#0d1747] focus:outline-hidden"
                  />
                  {toLocation && (
                    <button
                      type="button"
                      onClick={() => setToLocation('')}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Use my location button */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#0d1747] hover:underline py-1"
                >
                  <Compass className="w-3.5 h-3.5 text-[#0d1747]" />
                  <span>Use my location</span>
                </button>
              </div>

              {/* Date & When to Travel Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1">
                    Travel date
                  </label>
                  <div className="flex items-center bg-[#f7f6f2] rounded-2xl border border-[#dedad0] px-3 py-2 text-xs font-bold text-[#0d1747]">
                    <Calendar className="w-3.5 h-3.5 text-[#798090] mr-2 shrink-0" />
                    <input
                      type="date"
                      value={leaveDate}
                      onChange={(e) => setLeaveDate(e.target.value)}
                      className="w-full bg-transparent focus:outline-hidden cursor-pointer"
                    />
                  </div>
                  <span className="text-[9px] text-[#798090] mt-0.5 block">YYYY-MM-DD · Tue, 17 Nov 2026</span>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1">
                    When to travel
                  </label>
                  <div className="relative">
                    <select
                      value={whenType}
                      onChange={(e) => setWhenType(e.target.value as any)}
                      className="w-full bg-[#f7f6f2] rounded-2xl border border-[#dedad0] px-3 py-2 text-xs font-bold text-[#0d1747] appearance-none pr-7 focus:outline-hidden cursor-pointer"
                    >
                      <option value="Depart at">Depart at</option>
                      <option value="Arrive by">Arrive by</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#798090] absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Departure Time */}
              <div className="pt-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1">
                  Departure time · SAST (24-hour)
                </label>
                <div className="flex items-center bg-[#f7f6f2] rounded-2xl border border-[#dedad0] px-3 py-2 text-xs font-bold text-[#0d1747]">
                  <Clock className="w-3.5 h-3.5 text-[#798090] mr-2 shrink-0" />
                  <input
                    type="time"
                    value={leaveTime}
                    onChange={(e) => setLeaveTime(e.target.value)}
                    className="w-full bg-transparent focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#0d1747] hover:bg-[#15236b] active:scale-[0.99] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Find a journey</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Cards Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div
              onClick={() => onNavigate('taxi-directory')}
              className="bg-white rounded-2xl p-3.5 border border-[#e5e1d7] cursor-pointer hover:border-[#0d1747] transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-[#edeae2] flex items-center justify-center text-[#0d1747] mb-2">
                <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="13" rx="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <h4 className="text-xs font-bold text-[#0d1747]">Taxi directory</h4>
              <p className="text-[10px] text-[#555d71] mt-0.5">Check rank information</p>
            </div>

            <div
              onClick={() => onNavigate('offline-downloads')}
              className="bg-white rounded-2xl p-3.5 border border-[#e5e1d7] cursor-pointer hover:border-[#0d1747] transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-[#edeae2] flex items-center justify-center text-[#0d1747] mb-2">
                <Download className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#0d1747]">Ready for offline</h4>
              <p className="text-[10px] text-[#555d71] mt-0.5">Take your directions</p>
            </div>
          </div>

          {/* SAST note */}
          <p className="text-[11px] text-[#798090] text-center pb-2">
            Time zone: South African Standard Time (SAST)
          </p>
        </div>
      </div>

      <LocationConsentModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onConfirm={handleUseLocation}
      />

      <BottomNav currentScreen="journey-planner" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
