import React, { useMemo, useState } from 'react';
import { ScreenId, MetroRoute } from '../../types/transit';
import { METRO_ROUTES } from '../../data/metrobusRoutes';
import { TAXI_RANK_LISTINGS } from '../../data/taxiRanks';
import { Search, X, ArrowRight, ChevronDown } from 'lucide-react';
import { BottomNav } from '../common/BottomNav';
import { TransFlowHeader } from '../common/TransFlowHeader';

interface RouteDirectoryProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectRouteForPlan?: (route: MetroRoute) => void;
  savedCount?: number;
  initialMode?: 'bus' | 'taxi';
  initialRouteId?: string | null;
  initialRankId?: string | null;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
      <span className="text-[12px] text-[#687085] shrink-0">{label}</span>
      <span className="text-[15px] font-semibold text-[#0d1747] text-right">{value}</span>
    </div>
  );
}

export const RouteDirectoryScreen: React.FC<RouteDirectoryProps> = ({
  onNavigate,
  onSelectRouteForPlan,
  savedCount = 0,
  initialMode = 'bus',
  initialRouteId = null,
  initialRankId = null,
}) => {
  const [mode, setMode] = useState<'bus' | 'taxi'>(initialMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(initialRouteId);
  const [selectedRankId, setSelectedRankId] = useState<string | null>(initialRankId);

  const filteredRoutes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return METRO_ROUTES;
    return METRO_ROUTES.filter(
      (route) =>
        route.letter.toLowerCase().includes(q) ||
        route.origin.toLowerCase().includes(q) ||
        route.destination.toLowerCase().includes(q) ||
        route.via.toLowerCase().includes(q) ||
        route.nearbyTaxis.some(
          (link) => link.stop.toLowerCase().includes(q) || link.ranks.toLowerCase().includes(q),
        ),
    );
  }, [searchQuery]);

  const filteredRanks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return TAXI_RANK_LISTINGS;
    return TAXI_RANK_LISTINGS.filter(
      (rank) =>
        rank.name.toLowerCase().includes(q) ||
        rank.location.toLowerCase().includes(q) ||
        rank.routes.some((item) => item.toLowerCase().includes(q)) ||
        rank.note.toLowerCase().includes(q) ||
        rank.nearbyMetrobus.some(
          (link) =>
            link.stop.toLowerCase().includes(q) ||
            link.routes.toLowerCase().includes(q) ||
            link.detail.toLowerCase().includes(q),
        ),
    );
  }, [searchQuery]);

  const selectedRoute = METRO_ROUTES.find((route) => route.id === selectedRouteId) || null;

  const handlePlanWithRoute = () => {
    if (!selectedRoute) return;
    if (onSelectRouteForPlan) onSelectRouteForPlan(selectedRoute);
    onNavigate('home-dashboard');
  };

  return (
    <div className="min-h-full pb-20 max-w-md mx-auto">
      <TransFlowHeader onNavigate={onNavigate} />

      <div className="pt-5 px-4">
        <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
          Find your route.
        </h1>
        <p className="mt-2 mb-5 text-sm text-[#555d71]">
          {mode === 'bus'
            ? 'Metrobus corridors from Gandhi Square.'
            : 'Johannesburg CBD taxi ranks.'}
        </p>

        <div className="grid grid-cols-2 gap-1 p-1 mb-5 rounded-full bg-[#ece9e0]">
          {(['bus', 'taxi'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                setSearchQuery('');
                setSelectedRouteId(null);
                setSelectedRankId(null);
              }}
              className={`py-2.5 rounded-full text-sm font-semibold capitalize transition-colors ${
                mode === item ? 'bg-[#0d1747] text-white' : 'text-[#555d71]'
              }`}
            >
              {item === 'bus' ? 'Bus' : 'Taxi'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 py-2.5 mb-1">
          <Search className="w-4 h-4 text-[#0d1747] shrink-0" />
          <div className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={mode === 'bus' ? 'Search a route or suburb' : 'Search a rank or area'}
              className="w-full bg-transparent text-[15px] font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
            />
          </div>
          {searchQuery ? (
            <button type="button" onClick={() => setSearchQuery('')} className="p-1 text-[#687085]" aria-label="Clear search">
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {mode === 'bus' ? (
          <div className="mt-2">
            {filteredRoutes.length === 0 ? (
              <p className="py-6 text-sm text-[#555d71]">No Metrobus routes match.</p>
            ) : (
              filteredRoutes.map((route) => {
                const isOpen = selectedRouteId === route.id;
                return (
                  <div key={route.id} className="border-b border-[#ece9e0]">
                    <button
                      type="button"
                      onClick={() => setSelectedRouteId(isOpen ? null : route.id)}
                      className="w-full py-3.5 flex items-start gap-3 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-[#0d1747]">
                          {route.origin} → {route.destination}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 mt-1 shrink-0 text-[#687085] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="pb-4">
                        <Fact label="Route" value={route.letter} />
                        <Fact label="Via" value={route.via || 'Direct'} />
                        <Fact label="Distance" value={`${route.distanceKm} km`} />
                        <Fact label="Typical time" value={`${route.durationMinutes} min`} />
                        <Fact label="Fare (estimate)" value={route.fare} />

                        <p className="mt-4 mb-1 text-[12px] text-[#687085]">Nearby taxi ranks</p>
                        {route.nearbyTaxis.map((link) => (
                          <div key={link.stop} className="py-2.5 border-b border-[#ece9e0]">
                            <p className="text-[18px] font-extrabold leading-none text-[#96BD47]">
                              {link.ranks}
                            </p>
                            <p className="mt-2 text-[15px] font-semibold text-[#0d1747]">{link.stop}</p>
                          </div>
                        ))}

                        <p className="mt-4 mb-1 text-[12px] text-[#687085]">Stops</p>
                        <div className="relative pl-4">
                          <div className="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-[#96BD47]/45" aria-hidden />
                          {route.stops.map((stop, index) => (
                            <div key={stop.id} className="relative flex items-baseline justify-between gap-3 py-1.5">
                              <span
                                className={`absolute -left-4 top-2 h-2.5 w-2.5 rounded-full ${
                                  index === 0 || index === route.stops.length - 1 ? 'bg-[#96BD47]' : 'bg-[#0d1747]'
                                }`}
                              />
                              <p className="text-[15px] font-semibold text-[#0d1747]">{stop.name}</p>
                              <p className="text-[12px] text-[#687085]">
                                {index === 0 ? 'Start' : index === route.stops.length - 1 ? 'End' : 'En-route'}
                              </p>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={handlePlanWithRoute}
                          className="mt-4 w-full bg-[#96BD47] hover:bg-[#7fa53a] text-white py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                        >
                          <span>Plan this route</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="mt-2">
            {filteredRanks.length === 0 ? (
              <p className="py-6 text-sm text-[#555d71]">No taxi ranks match.</p>
            ) : (
              filteredRanks.map((rank) => {
                const isOpen = selectedRankId === rank.id;
                return (
                  <div key={rank.id} className="border-b border-[#ece9e0]">
                    <button
                      type="button"
                      onClick={() => setSelectedRankId(isOpen ? null : rank.id)}
                      className="w-full py-3.5 flex items-start gap-3 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-[#0d1747]">{rank.name}</p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 mt-1 shrink-0 text-[#687085] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="pb-4">
                        <Fact label="Location" value={rank.location} />

                        <p className="mt-4 mb-1 text-[12px] text-[#687085]">Nearby Metrobus</p>
                        {rank.nearbyMetrobus.map((link) => (
                          <div key={link.stop} className="py-2.5 border-b border-[#ece9e0]">
                            <p className="text-[18px] font-extrabold tabular-nums leading-none text-[#96BD47]">
                              Routes {link.routes}
                            </p>
                            <p className="mt-2 text-[15px] font-semibold text-[#0d1747]">{link.stop}</p>
                            <p className="mt-0.5 text-sm text-[#555d71] leading-relaxed">{link.detail}</p>
                          </div>
                        ))}

                        <p className="mt-4 mb-1 text-[12px] text-[#687085]">Serves</p>
                        <div className="relative pl-4">
                          <div className="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-[#96BD47]/45" aria-hidden />
                          {rank.routes.map((item) => (
                            <div key={item} className="relative py-1.5">
                              <span className="absolute -left-4 top-2.5 h-2.5 w-2.5 rounded-full bg-[#96BD47]" />
                              <p className="text-[15px] font-semibold text-[#0d1747]">{item}</p>
                            </div>
                          ))}
                        </div>

                        <p className="pt-3 text-sm text-[#555d71] leading-relaxed">{rank.note}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <BottomNav currentScreen="route-directory" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
