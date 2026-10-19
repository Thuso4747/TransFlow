import React, { useState } from 'react';
import { ScreenId, CommuterUser, JourneySearchParams } from '../../types/transit';
import {
  ArrowUpDown,
  Clock,
  MapPin,
  ChevronDown,
  ChevronRight,
  Search,
  Sliders,
  Footprints,
  Info,
  ArrowRight,
  User,
  CreditCard,
  Check,
} from 'lucide-react';
import { DisclaimerFooter } from '../common/DisclaimerFooter';
import { BottomNav } from '../common/BottomNav';

interface HomeDashboardProps {
  onNavigate: (screen: ScreenId) => void;
  searchParams: JourneySearchParams;
  onUpdateSearchParams: (params: Partial<JourneySearchParams>) => void;
  commuter: CommuterUser;
  onOpenProfile: () => void;
}

const COMMON_JOBURG_STOPS = [
  'Park Station',
  'Rosebank Mall',
  'Sandton City',
  'Gandhi Square',
  'Braamfontein',
  'Wits University',
  'Auckland Park UJ',
  'Cresta Shopping Centre',
  'Soweto Orlando',
  'Eastgate Mall',
];

export const HomeDashboardScreen: React.FC<HomeDashboardProps> = ({
  onNavigate,
  searchParams,
  onUpdateSearchParams,
  commuter,
  onOpenProfile,
}) => {
  const [fromQuery, setFromQuery] = useState(searchParams.fromLocation || 'Park Station');
  const [toQuery, setToQuery] = useState(searchParams.toLocation || 'Rosebank Mall');
  const [leaveTime, setLeaveTime] = useState(searchParams.leaveTime || 'Wed, 14 Oct · 08:10');
  const [preferences, setPreferences] = useState(searchParams.preferences || 'Bus + walking · fewest transfers');
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null);

  const handleSwap = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
    onUpdateSearchParams({ fromLocation: toQuery, toLocation: temp });
  };

  const handleFindJourney = () => {
    onUpdateSearchParams({
      fromLocation: fromQuery || 'Park Station',
      toLocation: toQuery || 'Rosebank Mall',
      leaveTime,
      preferences,
    });
    onNavigate('journey-filter');
  };

  const handleViewJourneyMap = (departureOverride?: string) => {
    onUpdateSearchParams({
      fromLocation: fromQuery || 'Park Station',
      toLocation: toQuery || 'Rosebank Mall',
      leaveTime: departureOverride || leaveTime,
      preferences,
    });
    onNavigate('journey-map');
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-md mx-auto">
      {/* Headline Header matching Figma */}
      <div className="mb-5">
        <p className="text-[11px] font-extrabold tracking-wider text-[#0d1747] uppercase mb-1">
          Johannesburg / Journey Planner
        </p>
        <h1 className="text-[34px] font-extrabold text-[#0d1747] tracking-tight leading-[1.08] mb-2">
          Your city.<br />Your next stop.
        </h1>
        <p className="text-[14px] text-[#555d71]">
          Plan a Metrobus journey across Johannesburg.
        </p>
      </div>

      {/* Main Search Card */}
      <div className="bg-white rounded-3xl p-4.5 shadow-sm border border-[#e6e2d8] mb-6">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-lg font-bold text-[#0d1747]">
            Let&apos;s get you there.
          </h2>
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="p-1.5 text-[#0d1747] hover:bg-slate-100 rounded-xl transition-colors"
            title="Search options & preferences"
          >
            <Sliders className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Inputs stack */}
        <div className="space-y-2 relative">
          {/* FROM input */}
          <div className="bg-[#edeae2] rounded-2xl p-3 flex items-center gap-3 relative focus-within:ring-2 focus-within:ring-[#0d1747] transition-all">
            <div className="w-6 h-6 rounded-full border-2 border-[#0d1747] flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#0d1747]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#687085]">
                From
              </span>
              <input
                type="text"
                value={fromQuery}
                onFocus={() => setActiveInput('from')}
                onChange={(e) => {
                  setFromQuery(e.target.value);
                  onUpdateSearchParams({ fromLocation: e.target.value });
                }}
                placeholder="Enter starting stop or station"
                className="w-full bg-transparent font-bold text-sm text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Swap Button on right */}
          <div className="flex justify-end pr-3 -my-2 relative z-10">
            <button
              onClick={handleSwap}
              className="w-7 h-7 bg-white hover:bg-slate-100 rounded-full border border-[#d8d3c7] shadow-xs flex items-center justify-center text-[#0d1747] active:scale-95 transition-transform"
              title="Swap origin and destination"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TO input */}
          <div className="bg-[#edeae2] rounded-2xl p-3 flex items-center gap-3 relative focus-within:ring-2 focus-within:ring-[#0d1747] transition-all">
            <MapPin className="w-5 h-5 text-[#0d1747] shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#687085]">
                To
              </span>
              <input
                type="text"
                value={toQuery}
                onFocus={() => setActiveInput('to')}
                onChange={(e) => {
                  setToQuery(e.target.value);
                  onUpdateSearchParams({ toLocation: e.target.value });
                }}
                placeholder="Enter destination or landmark"
                className="w-full bg-transparent font-bold text-sm text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Quick stop autocomplete suggestions pill bar if typing/focused */}
          {activeInput && (
            <div className="p-2.5 bg-[#f5f3ec] rounded-2xl border border-[#dedad0] animate-fadeIn">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[10px] font-bold text-[#6d7589] uppercase tracking-wider">
                  Quick Select Stop for {activeInput === 'from' ? 'Origin' : 'Destination'}:
                </span>
                <button
                  onClick={() => setActiveInput(null)}
                  className="text-[10px] font-bold text-[#0d1747]"
                >
                  Done
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {COMMON_JOBURG_STOPS.map((stop) => (
                  <button
                    key={stop}
                    type="button"
                    onClick={() => {
                      if (activeInput === 'from') {
                        setFromQuery(stop);
                        onUpdateSearchParams({ fromLocation: stop });
                      } else {
                        setToQuery(stop);
                        onUpdateSearchParams({ toLocation: stop });
                      }
                      setActiveInput(null);
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-[#0d1747] hover:text-white rounded-lg text-xs font-semibold text-[#0d1747] border border-[#dedad0] transition-colors"
                  >
                    {stop}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* LEAVE AT input */}
          <div
            onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
            className="border border-[#dbd7cc] bg-white rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:border-[#0d1747] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#0d1747] shrink-0" />
              <div>
                <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#687085]">
                  Leave at
                </span>
                <span className="font-bold text-xs text-[#0d1747]">
                  {leaveTime}
                </span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#555d71] transition-transform ${isTimePickerOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Time Picker Dropdown */}
          {isTimePickerOpen && (
            <div className="p-2 bg-[#f4f2ec] rounded-2xl border border-[#d8d3c7] space-y-1 text-xs font-semibold animate-fadeIn">
              {[
                'Depart Now (Live)',
                'Wed, 14 Oct · 08:10',
                'Wed, 14 Oct · 08:40',
                'Wed, 14 Oct · 09:10',
                'Today · 17:15 (Afternoon Peak)',
              ].map((time) => (
                <div
                  key={time}
                  onClick={() => {
                    setLeaveTime(time);
                    setIsTimePickerOpen(false);
                    onUpdateSearchParams({ leaveTime: time });
                  }}
                  className="px-3 py-2 rounded-xl hover:bg-white cursor-pointer text-[#0d1747] flex items-center justify-between"
                >
                  <span>{time}</span>
                  {leaveTime === time && <Check className="w-3.5 h-3.5 text-[#84ad32]" />}
                </div>
              ))}
            </div>
          )}

          {/* Preference Row */}
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-[#485065] hover:text-[#0d1747]"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" />
              <span className="font-medium text-[12px]">{preferences}</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Find a journey Button */}
          <div className="pt-1">
            <button
              onClick={handleFindJourney}
              className="w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0d1747]/15 transition-all"
            >
              <span>Find a journey</span>
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Journey */}
          <div className="pt-3 border-t border-[#edeae2] flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#798090] shrink-0" />
            <div
              onClick={() => {
                setFromQuery('Park Station');
                setToQuery('Rosebank Mall');
                onUpdateSearchParams({ fromLocation: 'Park Station', toLocation: 'Rosebank Mall' });
              }}
              className="cursor-pointer"
            >
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#798090]">
                Recent Journey
              </p>
              <p className="text-xs font-bold text-[#0d1747] hover:underline">
                Park Station → Rosebank Mall
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Your journey options Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-[#0d1747]">
              Your journey options
            </h3>
            <p className="text-xs text-[#555d71]">
              3 example journeys · no transfers
            </p>
          </div>
          <button
            onClick={() => onNavigate('journey-filter')}
            className="p-1.5 text-[#0d1747] hover:bg-slate-100 rounded-xl"
            title="Sort options"
          >
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="14" y2="12" />
              <line x1="4" y1="18" x2="9" y2="18" />
            </svg>
          </button>
        </div>

        {/* Featured Recommended Journey Card */}
        <div className="border-2 border-[#84ad32] rounded-3xl p-4.5 bg-white shadow-xs mb-3 transition-all hover:shadow-md">
          {/* Card Top: Duration + Recommended Pill */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-[#0d1747] tracking-tight">46</span>
              <span className="text-sm font-semibold text-[#555d71]">min</span>
            </div>
            <span className="bg-[#e1ecfa] text-[#1c3f76] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
              Recommended
            </span>
          </div>

          {/* Timeline steps */}
          <div className="flex items-center gap-2 mb-4 text-xs font-bold text-[#0d1747]">
            <div className="flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-[#6c7487]" />
              <span>6 min</span>
            </div>
            <span className="text-[#a8afbe]">&gt;</span>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-[#84ad32] text-white flex items-center justify-center font-extrabold text-xs">
                A
              </div>
              <span>36 min</span>
            </div>
            <span className="text-[#a8afbe]">&gt;</span>
            <div className="flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-[#6c7487]" />
              <span>4 min</span>
            </div>
          </div>

          {/* Time & Fare Row */}
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="text-base font-extrabold text-[#0d1747]">
                08:10 – 08:56
              </p>
              <p className="text-xs text-[#555d71]">
                Example A · via Jan Smuts Avenue
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-extrabold text-[#0d1747]">
                R18.00
              </p>
              <p className="text-[10px] text-[#717b94]">
                standard fare
              </p>
            </div>
          </div>

          {/* Green Action Button */}
          <button
            onClick={() => handleViewJourneyMap('08:10 – 08:56')}
            className="w-full bg-[#84ad32] hover:bg-[#749b29] active:scale-[0.99] text-white py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>View journey map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Departure 2 Card */}
        <div
          onClick={() => handleViewJourneyMap('08:40 – 09:26')}
          className="bg-white rounded-2xl p-4 border border-[#e5e1d7] mb-2.5 flex items-center justify-between cursor-pointer hover:border-[#0d1747] transition-colors"
        >
          <div>
            <p className="text-sm font-extrabold text-[#0d1747]">08:40 – 09:26</p>
            <p className="text-xs text-[#555d71]">46 min · Example A · 30 min later</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#798090]" />
        </div>

        {/* Departure 3 Card */}
        <div
          onClick={() => handleViewJourneyMap('09:10 – 09:56')}
          className="bg-white rounded-2xl p-4 border border-[#e5e1d7] mb-4 flex items-center justify-between cursor-pointer hover:border-[#0d1747] transition-colors"
        >
          <div>
            <p className="text-sm font-extrabold text-[#0d1747]">09:10 – 09:56</p>
            <p className="text-xs text-[#555d71]">46 min · Example A · 60 min later</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#798090]" />
        </div>

        {/* Info notice box */}
        <div className="bg-[#eef3f6] border border-[#d8e3eb] p-3.5 rounded-2xl flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#1c3f76] shrink-0 mt-0.5" />
          <p className="text-xs text-[#1c3f76] leading-relaxed font-medium">
            A little planning goes a long way. Check current routes, boarding points, fares and payment methods with Metrobus before travelling.
          </p>
        </div>
      </div>

      {/* Preferences Modal */}
      {isPreferencesOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center">
          <div className="bg-white rounded-t-3xl max-w-md w-full p-5 max-h-[80vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between pb-4 border-b border-[#eeebe3]">
              <h3 className="font-extrabold text-lg text-[#0d1747]">
                Commute Preferences
              </h3>
              <button
                onClick={() => setIsPreferencesOpen(false)}
                className="text-xs font-bold text-[#0d1747] px-3 py-1 bg-slate-100 rounded-lg"
              >
                Done
              </button>
            </div>
            <div className="py-4 space-y-3">
              {[
                'Bus + walking · fewest transfers',
                'Bus only · minimal walking',
                'Fastest route · direct corridors',
                'Connect with minibus taxi rank',
              ].map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setPreferences(opt);
                    onUpdateSearchParams({ preferences: opt });
                    setIsPreferencesOpen(false);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
                    preferences === opt
                      ? 'border-[#0d1747] bg-[#0d1747] text-white font-bold'
                      : 'border-[#dedad0] bg-white text-[#0d1747]'
                  }`}
                >
                  <span className="text-xs">{opt}</span>
                  {preferences === opt && <Check className="w-4 h-4 text-[#84ad32]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <DisclaimerFooter />

      {/* Bottom Navigation */}
      <BottomNav currentScreen="home-dashboard" onNavigate={onNavigate} />
    </div>
  );
};
