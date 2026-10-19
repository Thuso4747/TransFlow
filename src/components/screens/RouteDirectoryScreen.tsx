import React, { useState } from 'react';
import { ScreenId, MetroRoute } from '../../types/transit';
import { METRO_ROUTES } from '../../data/mockData';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Info,
  ArrowRight,
  X,
} from 'lucide-react';
import { DisclaimerFooter } from '../common/DisclaimerFooter';
import { BottomNav } from '../common/BottomNav';

interface RouteDirectoryProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectRouteForPlan?: (route: MetroRoute) => void;
}

export const RouteDirectoryScreen: React.FC<RouteDirectoryProps> = ({
  onNavigate,
  onSelectRouteForPlan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDirection, setFilterDirection] = useState<'all' | 'northbound' | 'west'>('all');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-a');

  const filteredRoutes = METRO_ROUTES.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.via.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.letter.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterDirection === 'northbound' && r.direction !== 'northbound') return false;
    if (filterDirection === 'west' && r.direction !== 'west') return false;

    return true;
  });

  const selectedRoute = METRO_ROUTES.find((r) => r.id === selectedRouteId) || METRO_ROUTES[0];

  const handlePlanWithRoute = () => {
    if (onSelectRouteForPlan) {
      onSelectRouteForPlan(selectedRoute);
    }
    onNavigate('home-dashboard');
  };

  return (
    <div className="min-h-screen pb-24 pt-5 px-4 max-w-md mx-auto">
      {/* Top Header */}
      <div className="mb-4">
        <p className="text-[11px] font-extrabold tracking-wider text-[#0d1747] uppercase mb-1">
          Johannesburg / Route Directory
        </p>
        <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
          Find your route.
        </h1>
        <p className="text-[13px] text-[#555d71]">
          Explore example Metrobus corridors across the city.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-[#dedad0] p-3 flex items-center gap-2.5 mb-3.5 shadow-2xs">
        <Search className="w-4 h-4 text-[#798090] shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search a route, suburb or stop"
          className="w-full bg-transparent text-xs font-semibold text-[#0d1747] placeholder-[#798090] focus:outline-hidden"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setFilterDirection('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterDirection === 'all'
              ? 'bg-[#0d1747] text-white shadow-xs'
              : 'bg-white text-[#0d1747] border border-[#dedad0]'
          }`}
        >
          All routes <span className="opacity-70 ml-1">6</span>
        </button>

        <button
          onClick={() => setFilterDirection('northbound')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterDirection === 'northbound'
              ? 'bg-[#0d1747] text-white shadow-xs'
              : 'bg-white text-[#0d1747] border border-[#dedad0]'
          }`}
        >
          Northbound <span className="opacity-70 ml-1">3</span>
        </button>

        <button
          onClick={() => setFilterDirection('west')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterDirection === 'west'
              ? 'bg-[#0d1747] text-white shadow-xs'
              : 'bg-white text-[#0d1747] border border-[#dedad0]'
          }`}
        >
          West <span className="opacity-70 ml-1">2</span>
        </button>
      </div>

      <p className="text-[11px] text-[#717b94] font-medium mb-3">
        From city centre · Corridors A–F
      </p>

      {/* Routes List */}
      <div className="space-y-2.5 mb-5">
        {filteredRoutes.map((route) => {
          const isSelected = selectedRouteId === route.id;

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`bg-white rounded-2xl p-3.5 border transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'border-l-4 border-l-[#84ad32] border-[#84ad32]/50'
                  : 'border-[#e5e1d7] hover:border-[#0d1747]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      route.letter === 'A'
                        ? 'bg-[#84ad32] text-white'
                        : 'bg-[#0d1747] text-white'
                    }`}
                  >
                    {route.letter}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0d1747]">
                      {route.title}
                    </h3>
                    <p className="text-[11px] text-[#555d71] font-medium">
                      {route.via}
                    </p>
                    <p className="text-[10px] text-[#717b94]">
                      Example {route.letter} · {route.interval} · {route.fare}
                    </p>
                  </div>
                </div>

                <div className="text-[#798090]">
                  {isSelected ? (
                    <ChevronDown className="w-4 h-4 text-[#0d1747]" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notice box */}
      <div className="bg-[#eef3f6] border border-[#d8e3eb] p-3.5 rounded-2xl flex items-start gap-2.5 mb-6">
        <Info className="w-4 h-4 text-[#1c3f76] shrink-0 mt-0.5" />
        <p className="text-xs text-[#1c3f76] leading-relaxed font-medium">
          This is a sample directory, not the full Metrobus network. Confirm official route numbers, stops and timetables before travelling.
        </p>
      </div>

      {/* Selected Route Detail Section */}
      <div className="mb-6">
        <h3 className="text-base font-extrabold text-[#0d1747] mb-3">
          Selected route · Example {selectedRoute.letter}
        </h3>

        {/* Navy Detail Card */}
        <div className="bg-[#0d1747] text-white rounded-3xl p-5 shadow-lg border border-[#1b2762]">
          {/* Top row with letter badge and Corridor tag */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-xl bg-white text-[#0d1747] flex items-center justify-center font-black text-sm">
              {selectedRoute.letter}
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">
              Example Corridor
            </span>
          </div>

          {/* Corridor Headline */}
          <div className="mb-5">
            <h2 className="text-2xl font-extrabold tracking-tight leading-tight">
              City centre<br />to {selectedRoute.destination}
            </h2>
            <p className="text-xs text-white/70 mt-1">
              Via Jan Smuts Avenue · {selectedRoute.direction}
            </p>
          </div>

          {/* Service Window & Interval Columns */}
          <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/15 mb-5">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-white/60 mb-0.5">
                Demo Service Window
              </p>
              <p className="text-base font-black">
                {selectedRoute.serviceWindow}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-white/60 mb-0.5">
                Demo Interval
              </p>
              <p className="text-base font-black">
                {selectedRoute.interval.split(' ')[0]} min
              </p>
            </div>
          </div>

          {/* Stops List */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold text-white">Example area stops</span>
              <span className="text-white/60">{selectedRoute.stops.length} stops</span>
            </div>

            {/* Stop Sequence with Green Terminals */}
            <div className="space-y-2.5 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/20">
              {selectedRoute.stops.map((stop, idx) => {
                const isTerminal = idx === 0 || idx === selectedRoute.stops.length - 1;

                return (
                  <div key={stop.id} className="relative flex items-center gap-2.5 text-xs">
                    <div
                      className={`absolute -left-4 w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                        isTerminal
                          ? 'bg-[#84ad32] ring-2 ring-white/30'
                          : 'bg-[#0d1747] border-2 border-white/80'
                      }`}
                    >
                      {isTerminal && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span
                      className={`font-semibold ${
                        isTerminal ? 'text-white font-extrabold' : 'text-white/80'
                      }`}
                    >
                      {stop.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plan with Route Button */}
          <button
            onClick={handlePlanWithRoute}
            className="w-full bg-[#84ad32] hover:bg-[#749b29] active:scale-[0.99] text-white py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Plan with Example {selectedRoute.letter}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <DisclaimerFooter />

      {/* Bottom Nav */}
      <BottomNav currentScreen="route-directory" onNavigate={onNavigate} />
    </div>
  );
};
