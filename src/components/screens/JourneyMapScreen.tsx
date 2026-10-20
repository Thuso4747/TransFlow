import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScreenId, JourneyOption, JourneySearchParams, PastTrip } from '../../types/transit';
import { ArrowRight, Bus, Check, ChevronDown, Download, Flag, Footprints, Phone } from 'lucide-react';
import { BottomNav } from '../common/BottomNav';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { LiveTripPreviewMap } from '../common/LiveTripPreviewMap';
import { METRO_ROUTES, shiftTime } from '../../data/metrobusRoutes';
import { loadTripProgress, saveTripProgress } from '../../lib/offlineStore';

interface JourneyMapProps {
  onNavigate: (screen: ScreenId) => void;
  searchParams?: JourneySearchParams;
  selectedJourney?: JourneyOption | null;
  onDownloadOffline?: () => void;
  isOfflineDownloaded?: boolean;
  savedCount?: number;
  backTo?: ScreenId;
  pastTrips?: PastTrip[];
  onEndTrip?: () => void;
}

function minutesBetween(from: string, to: string): number {
  const parse = (value: string) => {
    const [hours, mins] = value.split(':').map(Number);
    return hours * 60 + mins;
  };
  let diff = parse(to) - parse(from);
  if (diff < 0) diff += 24 * 60;
  return diff;
}

function orderedStopNames(names: string[], from: string, to: string): string[] {
  const fromIdx = names.findIndex((name) => name === from);
  const toIdx = names.findIndex((name) => name === to);
  if (fromIdx >= 0 && toIdx >= 0 && fromIdx !== toIdx) {
    if (fromIdx < toIdx) return names.slice(fromIdx, toIdx + 1);
    return names.slice(toIdx, fromIdx + 1).reverse();
  }
  return names;
}

function dateKey(value = new Date()) {
  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, '0'),
    String(value.getDate()).padStart(2, '0'),
  ].join('-');
}

function clockFromIso(iso: string) {
  const value = new Date(iso);
  return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
}

function nationalMobile(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  let national = digits;
  if (digits.startsWith('27') && digits.length >= 11) national = digits.slice(2, 11);
  else if (digits.startsWith('0') && digits.length >= 10) national = digits.slice(1, 10);
  else if (digits.length >= 9) national = digits.slice(0, 9);
  if (national.length !== 9) return null;
  if (!/^[6-8]/.test(national)) return null;
  return national;
}

function formatMobile(national: string) {
  return `+27 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}`;
}

function ShareLiveIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M0 0h16v16H0z" fill="none" />
      <path
        fill="currentColor"
        d="M3.05 3.05a.75.75 0 0 1 1.06 1.06a5.5 5.5 0 0 0 0 7.778a.75.75 0 0 1-1.06 1.06a7 7 0 0 1 0-9.9m8.838 0a.75.75 0 0 1 1.06 0a7 7 0 0 1 0 9.9a.75.75 0 1 1-1.06-1.061a5.5 5.5 0 0 0 0-7.778a.75.75 0 0 1 0-1.061M5.174 5.172a.75.75 0 1 1 1.06 1.06a2.5 2.5 0 0 0 0 3.536a.75.75 0 0 1-1.06 1.06a4 4 0 0 1 0-5.656m4.596 0a.75.75 0 0 1 1.06 0a4 4 0 0 1 0 5.656a.75.75 0 1 1-1.06-1.06a2.5 2.5 0 0 0 0-3.535a.75.75 0 0 1 0-1.061M8 7a1 1 0 1 1 0 2a1 1 0 0 1 0-2"
      />
    </svg>
  );
}

function EndTripIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M2.75 6h12.5m-12.5 5h7.5m-7.5 5h5.5m7.43-4.25h1.64q1 0 1.71.71l1.51 1.51q.71.71.71 1.71v1.64q0 1-.71 1.71l-1.51 1.51q-.71.71-1.71.71h-1.64q-1 0-1.71-.71l-1.51-1.51q-.71-.71-.71-1.71v-1.64q0-1 .71-1.71l1.51-1.51q.71-.71 1.71-.71M14.5 16.5h4"
      />
    </svg>
  );
}

function haversineMetres(aLat: number, aLng: number, bLat: number, bLng: number) {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.min(1, Math.sqrt(s)));
}

export const JourneyMapScreen: React.FC<JourneyMapProps> = ({
  onNavigate,
  searchParams,
  selectedJourney,
  onDownloadOffline,
  isOfflineDownloaded = false,
  savedCount = 0,
  backTo = 'home-dashboard',
  pastTrips = [],
  onEndTrip,
}) => {
  const [openPastId, setOpenPastId] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [sharePhone, setSharePhone] = useState('');
  const [shareError, setShareError] = useState('');
  const [sharedWith, setSharedWith] = useState<string | null>(null);
  const [livePreview, setLivePreview] = useState(false);
  const pageTopRef = useRef<HTMLDivElement>(null);
  const [checkedTo, setCheckedTo] = useState(-1);

  useEffect(() => {
    const toTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      pageTopRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
    };
    toTop();
    const frame = requestAnimationFrame(toTop);
    return () => cancelAnimationFrame(frame);
  }, [selectedJourney]);

  useEffect(() => {
    if (!selectedJourney?.id) {
      setCheckedTo(-1);
      setShareOpen(false);
      setSharePhone('');
      setShareError('');
      setSharedWith(null);
      setLivePreview(false);
      return;
    }
    setCheckedTo(loadTripProgress(selectedJourney.id));
  }, [selectedJourney?.id]);

  useEffect(() => {
    if (!selectedJourney?.id) return;
    saveTripProgress(selectedJourney.id, checkedTo);
  }, [selectedJourney?.id, checkedTo]);

  const origin = selectedJourney?.origin || searchParams?.fromLocation || '';
  const destination = selectedJourney?.destination || searchParams?.toLocation || '';

  const route = useMemo(() => {
    if (!selectedJourney) return undefined;
    return (
      METRO_ROUTES.find(
        (item) =>
          item.letter === selectedJourney.busLine &&
          (item.origin === selectedJourney.origin ||
            item.destination === selectedJourney.origin ||
            item.via === selectedJourney.origin),
      ) || METRO_ROUTES.find((item) => item.letter === selectedJourney.busLine)
    );
  }, [selectedJourney]);

  const walkBefore = selectedJourney?.steps.find((step) => step.type === 'walk');
  const busStep = selectedJourney?.steps.find((step) => step.type === 'bus');
  const walkAfter = selectedJourney?.steps.filter((step) => step.type === 'walk').at(-1);

  const stopTimeline = useMemo(() => {
    if (!route || !selectedJourney) return [];
    const names = orderedStopNames(
      route.stops.map((stop) => stop.name),
      selectedJourney.origin,
      selectedJourney.destination,
    );
    const boardTime = selectedJourney.departureTime;
    const alightTime = selectedJourney.arrivalTime;
    const span = Math.max(1, minutesBetween(boardTime, alightTime));
    return names.map((name, index) => {
      const match = route.stops.find((stop) => stop.name === name);
      return {
        name,
        time: shiftTime(boardTime, Math.round((index / Math.max(1, names.length - 1)) * span)),
        isBoard: index === 0,
        isAlight: index === names.length - 1,
        lat: match?.lat,
        lng: match?.lng,
      };
    });
  }, [route, selectedJourney]);

  useEffect(() => {
    if (!selectedJourney || stopTimeline.length === 0 || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const radius = Math.max(180, Math.min(accuracy || 180, 320));
        let arrivedAt = -1;
        stopTimeline.forEach((stop, index) => {
          if (stop.lat == null || stop.lng == null) return;
          const distance = haversineMetres(latitude, longitude, stop.lat, stop.lng);
          if (distance <= radius) arrivedAt = Math.max(arrivedAt, index);
        });
        if (arrivedAt >= 0) {
          setCheckedTo((prev) => Math.max(prev, arrivedAt));
        }
      },
      () => undefined,
      { enableHighAccuracy: true, maximumAge: 4000, timeout: 12000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [selectedJourney, stopTimeline]);

  const departDoor = walkBefore?.time || selectedJourney?.departureTime || '';
  const arriveDoor = selectedJourney
    ? shiftTime(selectedJourney.arrivalTime, selectedJourney.walkingMinutesAfter || 0)
    : '';

  const toggleStop = (index: number) => {
    setCheckedTo((prev) => {
      if (index <= prev) return index - 1;
      return index;
    });
  };

  const handleShareLive = (event: React.FormEvent) => {
    event.preventDefault();
    const national = nationalMobile(sharePhone);
    if (!national) {
      setShareError('Enter a South African mobile number.');
      return;
    }
    setShareError('');
    setSharedWith(formatMobile(national));
    setShareOpen(false);
  };

  if (!selectedJourney) {
    const today = dateKey();
    const tripsToday = pastTrips.filter((trip) => trip.endedDate === today);
    const previousTrips = pastTrips.filter((trip) => trip.endedDate !== today);
    const hasHistory = pastTrips.length > 0;

    const renderPast = (trips: PastTrip[]) =>
      trips.map((trip) => {
        const isOpen = openPastId === trip.id;
        return (
          <div key={trip.id} className="border-b border-[#ece9e0]">
            <button
              type="button"
              onClick={() => setOpenPastId(isOpen ? null : trip.id)}
              className="w-full py-3.5 flex items-start gap-3 text-left"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-[#0d1747]">
                  {trip.origin} → {trip.destination}
                </p>
                <p className="mt-0.5 text-sm text-[#555d71]">
                  {trip.scheduledTime}
                  {trip.busLine ? ` · Route ${trip.busLine}` : ''}
                  {` · ${trip.durationMinutes} min`}
                </p>
              </div>
              <p className="shrink-0 text-[15px] font-extrabold tabular-nums text-[#96BD47]">{trip.fare}</p>
              <ChevronDown
                className={`w-4 h-4 mt-1 shrink-0 text-[#687085] transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div className="pb-4">
                <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                  <span className="text-[12px] text-[#687085]">Time</span>
                  <span className="text-[15px] font-semibold tabular-nums text-[#0d1747]">{trip.scheduledTime}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                  <span className="text-[12px] text-[#687085]">Duration</span>
                  <span className="text-[15px] font-semibold text-[#0d1747]">{trip.durationMinutes} min</span>
                </div>
                <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                  <span className="text-[12px] text-[#687085]">Fare</span>
                  <span className="text-[18px] font-extrabold tabular-nums text-[#96BD47]">{trip.fare}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                  <span className="text-[12px] text-[#687085]">Ended</span>
                  <span className="text-[15px] font-semibold tabular-nums text-[#0d1747]">
                    {clockFromIso(trip.endedAt)}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      });

    return (
      <div ref={pageTopRef} className="min-h-[100dvh] pb-20 max-w-md mx-auto flex flex-col bg-[#f7f6f2]">
        <TransFlowHeader onNavigate={onNavigate} />
        <div className="flex-1 flex flex-col pt-5 px-4">
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
            No trip is in progress.
          </h1>
          <p className="mt-2 text-sm text-[#555d71] leading-relaxed">
            Plan a journey and tap Start trip to see your breakdown here.
          </p>

          {tripsToday.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-[#0d1747] mb-1">Trips today</h2>
              {renderPast(tripsToday)}
            </div>
          )}

          {previousTrips.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-[#0d1747] mb-1">Previous trips</h2>
              {renderPast(previousTrips)}
            </div>
          )}

          <div className={hasHistory ? 'mt-8' : 'mt-auto pt-8'}>
            <button
              type="button"
              onClick={() => onNavigate('home-dashboard')}
              className="w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#0d1747]/15 transition-all"
            >
              <span>Plan a trip</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <BottomNav currentScreen="journey-map" onNavigate={onNavigate} savedCount={savedCount} />
      </div>
    );
  }

  return (
    <div ref={pageTopRef} className="min-h-full pb-20 max-w-md mx-auto">
      <TransFlowHeader onNavigate={onNavigate} showBack backTo={backTo} />

      <div className="pt-5 px-4">
        <h1 className="text-[22px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
          {origin} → {destination}
        </h1>
        <p className="mt-1 mb-5 text-sm text-[#555d71]">
          Route {selectedJourney.busLine}
          {route?.via ? ` · via ${route.via}` : ' · direct'}
          {route ? ` · ${route.distanceKm} km · ${route.durationMinutes} min` : ''}
        </p>

        <div className="mb-7">
          <div className="flex items-baseline justify-between gap-3 border-b border-[#ece9e0] py-2.5">
            <span className="text-[12px] text-[#687085]">Depart</span>
            <span className="text-[15px] font-semibold tabular-nums text-[#0d1747]">{departDoor}</span>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-b border-[#ece9e0] py-2.5">
            <span className="text-[12px] text-[#687085]">Arrive</span>
            <span className="text-[15px] font-semibold tabular-nums text-[#0d1747]">{arriveDoor}</span>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-b border-[#ece9e0] py-2.5">
            <span className="text-[12px] text-[#687085]">Fare</span>
            <span className="text-[20px] font-extrabold tabular-nums leading-none text-[#96BD47]">
              {selectedJourney.fare}
            </span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-[#0d1747] mb-3">Trip breakdown</h2>
        <div className="grid grid-cols-2 gap-1 p-1 mb-4 rounded-full bg-[#ece9e0]">
          <button
            type="button"
            onClick={() => setLivePreview(false)}
            className={`py-2.5 rounded-full text-sm font-semibold transition-colors ${
              !livePreview ? 'bg-[#0d1747] text-white' : 'text-[#555d71]'
            }`}
          >
            Breakdown
          </button>
          <button
            type="button"
            onClick={() => setLivePreview(true)}
            className={`py-2.5 rounded-full text-sm font-semibold transition-colors ${
              livePreview ? 'bg-[#0d1747] text-white' : 'text-[#555d71]'
            }`}
          >
            Live map
          </button>
        </div>

        {livePreview ? (
          <div className="mb-4">
            <LiveTripPreviewMap stops={stopTimeline} />
          </div>
        ) : (
        <div className="relative">
          <div className="absolute left-[15px] top-6 bottom-6 w-px bg-[#96BD47]/45" aria-hidden />

          {walkBefore && (
            <div className="flex items-start gap-3 py-2.5">
              <span className="relative z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center bg-[#f7f6f2]">
                <Footprints className="w-4 h-4 text-[#0d1747]" />
              </span>
              <div className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
                <p className="text-[12px] text-[#687085]">{walkBefore.time} · {walkBefore.duration}</p>
                <p className="font-semibold text-[15px] text-[#0d1747]">{walkBefore.title}</p>
              </div>
            </div>
          )}

          {busStep && (
            <div className="flex items-start gap-3 py-2.5">
              <span className="relative z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center bg-[#f7f6f2]">
                <Bus className="w-4 h-4 text-[#96BD47]" />
              </span>
              <div className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
                <p className="text-[12px] text-[#687085]">
                  {selectedJourney.departureTime} → {selectedJourney.arrivalTime} · {busStep.duration}
                </p>
                <p className="font-semibold text-[15px] text-[#0d1747]">
                  Route {selectedJourney.busLine}
                  {route?.via ? ` · via ${route.via}` : ' · direct'}
                </p>

                <div className="mt-3 space-y-0">
                  {stopTimeline.map((stop, index) => {
                    const passed = index <= checkedTo;
                    const current = index === checkedTo + 1;
                    const role = stop.isBoard
                      ? 'Board here'
                      : stop.isAlight
                        ? 'Alight here'
                        : passed
                          ? 'Passed'
                          : current
                            ? 'Next stop'
                            : 'En-route';

                    return (
                      <button
                        key={`${stop.name}-${stop.time}`}
                        type="button"
                        onClick={() => toggleStop(index)}
                        aria-pressed={passed}
                        className="w-full flex items-start justify-between gap-3 py-2.5 border-b border-[#f0eee6] last:border-b-0 text-left"
                      >
                        <span
                          className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 ${
                            passed
                              ? 'border-[#96BD47] bg-[#96BD47]'
                              : current
                                ? 'border-[#96BD47] bg-white'
                                : 'border-[#c5c9d4] bg-white'
                          }`}
                          aria-hidden
                        >
                          {passed ? (
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          ) : current ? (
                            <span className="h-2 w-2 rounded-full bg-[#96BD47]" />
                          ) : null}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[15px] font-semibold truncate ${
                              passed ? 'text-[#687085]' : 'text-[#0d1747]'
                            }`}
                          >
                            {stop.name}
                          </p>
                          <p
                            className={
                              stop.isBoard
                                ? 'text-[13px] font-semibold text-[#96BD47]'
                                : stop.isAlight
                                  ? 'text-[13px] font-semibold text-[#0d1747]'
                                  : 'text-[12px] text-[#687085]'
                            }
                          >
                            {role}
                          </p>
                        </div>
                        <p className="shrink-0 text-[15px] font-semibold tabular-nums text-[#0d1747]">{stop.time}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {walkAfter && walkAfter !== walkBefore && (
            <div className="flex items-start gap-3 py-2.5">
              <span className="relative z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center bg-[#f7f6f2]">
                <Flag className="w-4 h-4 text-[#0d1747]" />
              </span>
              <div className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
                <p className="text-[12px] text-[#687085]">{walkAfter.time} · {walkAfter.duration}</p>
                <p className="font-semibold text-[15px] text-[#0d1747]">{walkAfter.title}</p>
              </div>
            </div>
          )}
        </div>
        )}

        <button
          type="button"
          onClick={onDownloadOffline}
          disabled={isOfflineDownloaded}
          className="mt-6 w-full h-12 rounded-2xl border border-[#0d1747]/15 bg-white text-sm font-semibold text-[#0d1747] flex items-center justify-center gap-2 disabled:text-[#6a8a2e] disabled:border-[#d2e2b9] disabled:bg-[#f4f8ea]"
        >
          {isOfflineDownloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          {isOfflineDownloaded ? 'Downloaded for offline' : 'Download trip offline'}
        </button>

        {!sharedWith && (
          <button
            type="button"
            onClick={() => {
              setShareOpen((open) => !open);
              setShareError('');
            }}
            className="mt-3 w-full h-12 rounded-2xl bg-[#0d1747] hover:bg-[#142161] text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            <ShareLiveIcon className="w-4 h-4" />
            Share live trip
          </button>
        )}

        {shareOpen && !sharedWith && (
          <form onSubmit={handleShareLive} className="mt-4">
            <p className="text-sm text-[#555d71] leading-relaxed">
              Enter a receiver number. They get a preview of this trip and live updates as each stop is passed, until arrival.
            </p>
            {shareError ? <p className="mt-3 text-sm font-medium text-[#c62828]">{shareError}</p> : null}
            <label className="flex items-center gap-3 py-2.5">
              <Phone className="w-4 h-4 text-[#0d1747] shrink-0" />
              <span className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
                <span className="block text-[12px] text-[#687085]">Receiver phone</span>
                <span className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-[#0d1747]">+27</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={sharePhone}
                    onChange={(e) => setSharePhone(e.target.value)}
                    placeholder="82 000 0000"
                    className="w-full bg-transparent text-[15px] font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
                  />
                </span>
              </span>
            </label>
            <button
              type="submit"
              className="mt-3 w-full bg-[#0d1747] hover:bg-[#142161] text-white py-3.5 px-4 rounded-2xl font-bold text-sm"
            >
              Send live preview
            </button>
          </form>
        )}

        {sharedWith && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-[#0d1747]">Receiver preview</h2>
            <p className="mt-1 mb-3 text-sm text-[#555d71] leading-relaxed">
              Live with {sharedWith}. They see each stop as you pass it, until arrival.
            </p>
            {checkedTo >= stopTimeline.length - 1 && stopTimeline.length > 0 ? (
              <p className="mb-3 text-sm font-semibold text-[#96BD47]">Arrived at {destination}.</p>
            ) : (
              <p className="mb-3 text-sm font-semibold text-[#0d1747]">
                {checkedTo < 0
                  ? `Waiting at ${stopTimeline[0]?.name || origin}`
                  : `Passed ${stopTimeline[checkedTo]?.name}`}
              </p>
            )}
            <div>
              {stopTimeline.map((stop, index) => {
                const passed = index <= checkedTo;
                const current = index === checkedTo + 1;
                const role = stop.isBoard
                  ? 'Board here'
                  : stop.isAlight
                    ? 'Alight here'
                    : passed
                      ? 'Passed'
                      : current
                        ? 'Next stop'
                        : 'En-route';
                return (
                  <div
                    key={`share-${stop.name}-${stop.time}`}
                    className="flex items-start justify-between gap-3 py-2.5 border-b border-[#ece9e0]"
                  >
                    <span
                      className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 ${
                        passed
                          ? 'border-[#96BD47] bg-[#96BD47]'
                          : current
                            ? 'border-[#96BD47] bg-white'
                            : 'border-[#c5c9d4] bg-white'
                      }`}
                      aria-hidden
                    >
                      {passed ? (
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      ) : current ? (
                        <span className="h-2 w-2 rounded-full bg-[#96BD47]" />
                      ) : null}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[15px] font-semibold truncate ${passed ? 'text-[#687085]' : 'text-[#0d1747]'}`}>
                        {stop.name}
                      </p>
                      <p
                        className={
                          stop.isBoard
                            ? 'text-[13px] font-semibold text-[#96BD47]'
                            : stop.isAlight
                              ? 'text-[13px] font-semibold text-[#0d1747]'
                              : 'text-[12px] text-[#687085]'
                        }
                      >
                        {role}
                      </p>
                    </div>
                    <p className="shrink-0 text-[15px] font-semibold tabular-nums text-[#0d1747]">{stop.time}</p>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                setSharedWith(null);
                setSharePhone('');
                setShareOpen(false);
              }}
              className="mt-3 text-sm font-semibold text-[#c62828]"
            >
              Stop sharing
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => (onEndTrip ? onEndTrip() : onNavigate('home-dashboard'))}
          className="mt-3 w-full h-12 rounded-2xl bg-[#c62828] hover:bg-[#b71c1c] text-white text-sm font-bold flex items-center justify-center gap-2"
        >
          <EndTripIcon className="w-5 h-5" />
          End trip
        </button>
      </div>

      <BottomNav currentScreen="journey-map" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
