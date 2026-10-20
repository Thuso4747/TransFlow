import React, { useMemo, useState } from 'react';
import { ScreenId, CommuterUser, JourneySearchParams, JourneyOption } from '../../types/transit';
import {
  ArrowUpDown,
  Clock,
  MapPin,
  ChevronDown,
  Search,
  ArrowRight,
  Check,
  Bus,
  X,
} from 'lucide-react';
import { BottomNav } from '../common/BottomNav';
import { TransFlowHeader } from '../common/TransFlowHeader';
import {
  ORIGIN_PLACES,
  getConnectingRoutes,
  getDestinationsFrom,
  getUpcomingDepartures,
  shiftTime,
} from '../../data/metrobusRoutes';

interface HomeDashboardProps {
  onNavigate: (screen: ScreenId) => void;
  searchParams: JourneySearchParams;
  onUpdateSearchParams: (params: Partial<JourneySearchParams>) => void;
  commuter: CommuterUser;
  onOpenProfile: () => void;
  onStartTrip: (journey: JourneyOption) => void;
  savedCount?: number;
  initialPicker?: 'from' | 'to' | null;
  initialTimePickerOpen?: boolean;
}

export const HomeDashboardScreen: React.FC<HomeDashboardProps> = ({
  onNavigate,
  searchParams,
  onUpdateSearchParams,
  onStartTrip,
  savedCount = 0,
  initialPicker = null,
  initialTimePickerOpen = false,
}) => {
  const [fromPlace, setFromPlace] = useState(searchParams.fromLocation || '');
  const [toPlace, setToPlace] = useState(searchParams.toLocation || '');
  const [leaveTime, setLeaveTime] = useState(searchParams.leaveTime || '');
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(initialTimePickerOpen);
  const [picker, setPicker] = useState<'from' | 'to' | null>(initialPicker);
  const [placeQuery, setPlaceQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const reachableTo = useMemo(() => (fromPlace ? getDestinationsFrom(fromPlace) : []), [fromPlace]);

  const pickerPlaces = useMemo(() => {
    const q = placeQuery.trim().toLowerCase();
    const source = picker === 'from' ? ORIGIN_PLACES : reachableTo;
    return source.filter((place) => {
      if (picker === 'from' && place === toPlace) return false;
      if (!q) return true;
      return place.toLowerCase().includes(q);
    });
  }, [placeQuery, picker, toPlace, reachableTo]);

  const connectingRoutes = useMemo(() => {
    if (!fromPlace || !toPlace) return [];
    return [...getConnectingRoutes(fromPlace, toPlace)].sort(
      (a, b) => Number(Boolean(a.via)) - Number(Boolean(b.via)) || a.durationMinutes - b.durationMinutes,
    );
  }, [fromPlace, toPlace]);

  const suggestedTrips = useMemo(() => {
    if (!fromPlace || !toPlace || !leaveTime) return [];
    const order = new Map(connectingRoutes.map((route, index) => [route.id, index]));
    const rows = connectingRoutes.flatMap((route) =>
      getUpcomingDepartures(route, leaveTime, 8).map((slot) => ({
        key: `${route.id}-${slot.depart}`,
        route,
        depart: slot.depart,
        arrive: slot.arrive,
      })),
    );
    rows.sort(
      (a, b) =>
        a.depart.localeCompare(b.depart) || (order.get(a.route.id) ?? 0) - (order.get(b.route.id) ?? 0),
    );
    if (rows.length === 0) return [];
    const first = rows[0];
    const next = rows.find((row) => row.depart > first.depart);
    return next ? [first, next] : [first];
  }, [connectingRoutes, leaveTime]);

  const activeTrip =
    selectedTrip && suggestedTrips.some((trip) => trip.key === selectedTrip)
      ? selectedTrip
      : suggestedTrips[0]?.key ?? null;

  const handleSwap = () => {
    if (!fromPlace || !toPlace) return;
    const newFrom = toPlace;
    const newTo = fromPlace;
    const allowed = getDestinationsFrom(newFrom);
    if (!allowed.includes(newTo)) return;
    setFromPlace(newFrom);
    setToPlace(newTo);
    setSelectedTrip(null);
    onUpdateSearchParams({ fromLocation: newFrom, toLocation: newTo });
  };

  const selectPlace = (place: string) => {
    if (picker === 'from') {
      setFromPlace(place);
      const nextDests = getDestinationsFrom(place);
      const nextTo = nextDests.includes(toPlace) ? toPlace : '';
      setToPlace(nextTo);
      setSelectedTrip(null);
      onUpdateSearchParams({ fromLocation: place, toLocation: nextTo });
    } else if (picker === 'to') {
      setToPlace(place);
      setSelectedTrip(null);
      onUpdateSearchParams({ toLocation: place });
    }
    setPicker(null);
    setPlaceQuery('');
  };

  const minutesLater = (from: string, to: string) => {
    const [ah, am] = from.split(':').map(Number);
    const [bh, bm] = to.split(':').map(Number);
    return Math.max(1, bh * 60 + bm - (ah * 60 + am));
  };

  const chooseTrip = (routeId: string, depart: string) => {
    setSelectedTrip(`${routeId}-${depart}`);
  };

  const handleStartTrip = () => {
    const chosen = suggestedTrips.find((trip) => trip.key === activeTrip);
    if (!chosen) return;
    const route = chosen.route;
    const slot = { depart: chosen.depart, arrive: chosen.arrive };

    const walkBefore = 4;
    const walkAfter = 3;
    const boardTime = slot.depart;
    const walkStart = shiftTime(boardTime, -walkBefore);

    onStartTrip({
      id: chosen.key,
      departureTime: slot.depart,
      arrivalTime: slot.arrive,
      durationMinutes: route.durationMinutes + walkBefore + walkAfter,
      fare: route.fare,
      fareType: 'Cash / Metrobus card',
      crowding: 'Seats available',
      crowdingColor: '#96BD47',
      badge: route.via ? undefined : 'DIRECT BUS (NO TRANSFER)',
      origin: fromPlace,
      destination: toPlace,
      transfersCount: 0,
      transferDetails: route.via ? `Via ${route.via}` : 'Direct',
      busLine: route.letter,
      walkingMinutesBefore: walkBefore,
      walkingMinutesAfter: walkAfter,
      isDirect: !route.via,
      steps: [
        {
          type: 'walk',
          title: `Walk to ${fromPlace} stop`,
          duration: `${walkBefore} min`,
          instruction: `Go to the Metrobus stop at ${fromPlace} and wait for route ${route.letter}.`,
          time: walkStart,
          distance: 'about 250 m',
        },
        {
          type: 'bus',
          title: `Board Metrobus ${route.letter}`,
          duration: `${route.durationMinutes} min`,
          instruction: route.via
            ? `Travel towards ${toPlace} via ${route.via}. Stay on board until ${toPlace}.`
            : `Direct service to ${toPlace}. Stay on board until the destination stop.`,
          time: slot.depart,
          details: `${route.distanceKm} km · ${route.fare}`,
        },
        {
          type: 'walk',
          title: `Alight at ${toPlace}`,
          duration: `${walkAfter} min`,
          instruction: `Get off at ${toPlace} and walk to your final point.`,
          time: slot.arrive,
          distance: 'about 180 m',
        },
      ],
    });
  };

  return (
    <div className="min-h-full pb-20 max-w-md mx-auto">
      <TransFlowHeader onNavigate={onNavigate} />

      <div className="pt-5 px-4">
        <div className="mb-5">
          <h1 className="text-[34px] font-extrabold text-[#0d1747] tracking-tight leading-[1.08] mb-2">
            Your city.<br />Your next stop.
          </h1>
          <p className="text-[14px] text-[#555d71]">
            Choose an origin, then only real Metrobus destinations will appear.
          </p>
        </div>

        <div className="mb-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0d1747]">Let&apos;s get you there</h2>
            <button
              onClick={handleSwap}
              className="p-1.5 -mr-1.5 text-[#0d1747] hover:bg-[#ece9e0] rounded-xl transition-colors"
              title="Swap origin and destination"
            >
              <ArrowUpDown className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          <div>
            <div className="relative">
              <div className="absolute left-[15px] top-7 bottom-7 w-px bg-[#96BD47]/45" aria-hidden />

              <button
                type="button"
                onClick={() => {
                  setPlaceQuery('');
                  setPicker('from');
                }}
                className="w-full py-2.5 flex items-center gap-3 text-left"
              >
                <span className="relative z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center bg-[#f7f6f2]">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[#96BD47]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#96BD47]" />
                  </span>
                </span>
                <span className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
                  <span className="block text-[12px] text-[#687085]">From</span>
                  <span className={`block font-semibold text-[15px] truncate ${fromPlace ? 'text-[#0d1747]' : 'text-[#81899e]'}`}>
                    {fromPlace || 'Select origin'}
                  </span>
                </span>
                <ChevronDown className="w-4 h-4 text-[#555d71] shrink-0" />
              </button>

              <button
                type="button"
                disabled={!fromPlace}
                onClick={() => {
                  if (!fromPlace) return;
                  setPlaceQuery('');
                  setPicker('to');
                }}
                className="w-full py-2.5 flex items-center gap-3 text-left disabled:opacity-50"
              >
                <span className="relative z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center bg-[#f7f6f2]">
                  <MapPin className="w-4 h-4 text-[#0d1747]" />
                </span>
                <span className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
                  <span className="block text-[12px] text-[#687085]">To</span>
                  <span className={`block font-semibold text-[15px] truncate ${toPlace ? 'text-[#0d1747]' : 'text-[#81899e]'}`}>
                    {fromPlace ? toPlace || 'Select destination' : 'Select origin first'}
                  </span>
                </span>
                <ChevronDown className="w-4 h-4 text-[#555d71] shrink-0" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
              className="w-full py-2.5 flex items-center gap-3 text-left"
            >
              <span className="flex h-[31px] w-[31px] shrink-0 items-center justify-center">
                <Clock className="w-4 h-4 text-[#0d1747]" />
              </span>
              <span className={`min-w-0 flex-1 ${isTimePickerOpen ? '' : 'border-b border-[#ece9e0]'} pb-2.5`}>
                <span className="block text-[12px] text-[#687085]">Leave at</span>
                <span className={`block font-semibold text-[15px] ${leaveTime ? 'text-[#0d1747]' : 'text-[#81899e]'}`}>
                  {leaveTime || 'Select time'}
                </span>
              </span>
              <ChevronDown className={`w-4 h-4 text-[#555d71] shrink-0 transition-transform ${isTimePickerOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {isTimePickerOpen && (
            <div className="ml-[43px] pb-1 space-y-0.5">
              {['Depart now', 'Today · 06:15', 'Today · 07:30', 'Today · 08:15', 'Today · 12:00', 'Today · 16:30', 'Today · 17:15'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => {
                    setLeaveTime(time);
                    setIsTimePickerOpen(false);
                    setSelectedTrip(null);
                    onUpdateSearchParams({ leaveTime: time });
                  }}
                  className="w-full py-2 pr-1 text-[14px] font-medium text-[#0d1747] flex items-center justify-between text-left"
                >
                  <span>{time}</span>
                  {leaveTime === time && <Check className="w-4 h-4 text-[#96BD47]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {fromPlace && toPlace && leaveTime ? (
        <div className="mb-6">
          {connectingRoutes.length === 0 ? (
            <>
              <h3 className="text-lg font-bold text-[#0d1747] mb-1">Choose a bus and time</h3>
              <p className="text-sm text-[#555d71]">No Metrobus service between these stops.</p>
            </>
          ) : suggestedTrips.length === 0 ? (
            <>
              <h3 className="text-lg font-bold text-[#0d1747] mb-1">Choose a bus and time</h3>
              <p className="text-sm text-[#555d71]">No more buses from {fromPlace} for the selected time.</p>
            </>
          ) : (
            <div>
              <h3 className="text-[22px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
                {fromPlace} → {toPlace}
              </h3>
              <p className="mt-1 mb-3 text-sm text-[#555d71]">Choose a departure from {fromPlace}</p>

              <div className="rounded-2xl border border-[#e6e2d8] bg-white overflow-hidden">
                {suggestedTrips.map((row, index) => {
                  const isActive = activeTrip === row.key;
                  const isNext = index === 1;
                  const laterMins = isNext ? minutesLater(suggestedTrips[0].depart, row.depart) : 0;

                  return (
                    <button
                      key={row.key}
                      type="button"
                      onClick={() => chooseTrip(row.route.id, row.depart)}
                      className={`w-full flex items-start gap-3 px-4 py-4 text-left transition-colors ${
                        index > 0 ? 'border-t border-[#f0eee6]' : ''
                      } ${isActive ? 'bg-[#f4f8ea]' : 'bg-white hover:bg-[#faf9f6]'}`}
                    >
                      <span
                        className={`mt-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                          isActive ? 'border-[#96BD47]' : 'border-[#c5c9d4]'
                        }`}
                        aria-hidden
                      >
                        {isActive && <span className="h-2 w-2 rounded-full bg-[#96BD47]" />}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className={`text-[11px] font-semibold ${isActive ? 'text-[#6a8a2e]' : 'text-[#687085]'}`}>
                            {isNext
                              ? `Next available · ${laterMins} min later`
                              : leaveTime === 'Depart now'
                                ? 'Earliest bus'
                                : 'At your time'}
                          </p>
                          <p className="text-sm font-bold text-[#0d1747] tabular-nums">{row.route.fare}</p>
                        </div>

                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-[22px] font-extrabold tabular-nums leading-none text-[#0d1747]">
                            {row.depart}
                          </span>
                          <span className="text-sm font-medium text-[#96BD47]">→</span>
                          <span className="text-[15px] font-semibold tabular-nums text-[#555d71]">{row.arrive}</span>
                        </div>

                        <p className="mt-1.5 text-sm font-semibold text-[#0d1747] truncate">
                          Route {row.route.letter}
                          {row.route.via ? ` · via ${row.route.via}` : ' · direct'}
                          {` · ${row.route.distanceKm} km · ${row.route.durationMinutes} min`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleStartTrip}
                disabled={!activeTrip}
                className="mt-3 w-full bg-[#96BD47] hover:bg-[#7fa53a] disabled:bg-[#c5cad6] disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>Start trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        ) : null}

        {picker && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center">
            <div className="bg-white rounded-t-3xl max-w-md w-full p-5 max-h-[82vh] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-extrabold text-lg text-[#0d1747]">
                    {picker === 'from' ? 'Select origin' : 'Select destination'}
                  </h3>
                  {picker === 'to' && (
                    <p className="text-[11px] text-[#717b94]">Only stops Metrobus serves from {fromPlace}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setPicker(null);
                    setPlaceQuery('');
                  }}
                  className="p-1 text-[#0d1747]"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 bg-[#f4f2ec] rounded-2xl px-3 py-2.5 mb-3">
                <Search className="w-4 h-4 text-[#798090]" />
                <input
                  autoFocus
                  value={placeQuery}
                  onChange={(e) => setPlaceQuery(e.target.value)}
                  placeholder="Search a stop or suburb"
                  className="w-full bg-transparent text-sm font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
                />
              </div>
              <div className="overflow-y-auto -mx-1 px-1">
                {pickerPlaces.map((place) => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => selectPlace(place)}
                    className="w-full flex items-center gap-3 py-3 border-b border-[#f0eee6] text-left"
                  >
                    <Bus className="w-4 h-4 text-[#96BD47] shrink-0" />
                    <span className="text-sm font-semibold text-[#0d1747]">{place}</span>
                  </button>
                ))}
                {pickerPlaces.length === 0 && (
                  <p className="text-xs text-[#717b94] py-6 text-center">No Metrobus stops match.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav currentScreen="home-dashboard" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
