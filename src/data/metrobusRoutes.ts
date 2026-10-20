import { MetroRoute } from '../types/transit';

type RawRoute = [number: string, origin: string, destination: string, via: string, km: number, minutes: number];

const RAW_ROUTES: RawRoute[] = [
  ['4', 'Gandhi Square', 'Highlands North', 'Louis Botha', 16.4, 25],
  ['13A', 'Gandhi Square', 'Glenhazel', 'Highlands North', 15.9, 23],
  ['13B', 'Gandhi Square', 'Lyndhurst', 'Highlands North', 17, 25],
  ['13C', 'Gandhi Square', 'Kew', 'Highlands North', 24.5, 34],
];

function estimateFare(km: number): string {
  let amount = 12.5;
  if (km > 8) amount = 14;
  if (km > 15) amount = 16.5;
  if (km > 25) amount = 18.5;
  if (km > 40) amount = 22;
  return `R${amount.toFixed(2)}`;
}

const STOP_COORDS: Record<string, { lat: number; lng: number }> = {
  'Gandhi Square': { lat: -26.2054, lng: 28.0436 },
  'Joubert Park': { lat: -26.1978, lng: 28.0469 },
  'Hillbrow': { lat: -26.189, lng: 28.0478 },
  'Houghton': { lat: -26.1647, lng: 28.0547 },
  'Orange Grove': { lat: -26.1633, lng: 28.0836 },
  'Louis Botha': { lat: -26.1528, lng: 28.0875 },
  'Highlands North': { lat: -26.1433, lng: 28.0886 },
  'Glenhazel': { lat: -26.1392, lng: 28.1006 },
  'Lyndhurst': { lat: -26.1264, lng: 28.1081 },
  Kew: { lat: -26.1408, lng: 28.0936 },
};

function inferCorridorStops(origin: string, destination: string): string[] {
  const o = origin.toLowerCase();
  const d = destination.toLowerCase();
  const pair = `${o}|${d}`;

  const known: Record<string, string[]> = {
    'gandhi square|highlands north': ['Joubert Park', 'Hillbrow', 'Houghton', 'Orange Grove', 'Louis Botha'],
    'gandhi square|glenhazel': ['Hillbrow', 'Houghton', 'Orange Grove', 'Highlands North'],
    'gandhi square|lyndhurst': ['Hillbrow', 'Orange Grove', 'Highlands North'],
    'gandhi square|kew': ['Hillbrow', 'Houghton', 'Orange Grove', 'Highlands North', 'Lyndhurst'],
  };

  if (known[pair]) return known[pair];
  const reversed = Object.entries(known).find(([k]) => k === `${d}|${o}`);
  if (reversed) return [...reversed[1]].reverse();
  return [];
}

export function buildEnRouteStops(origin: string, destination: string, via: string, km: number): string[] {
  const viaStops = via
    ? via.split(/,| & | and /i).map((item) => item.trim()).filter(Boolean)
    : [];
  const inferred = inferCorridorStops(origin, destination);
  const seen = new Set([origin.toLowerCase(), destination.toLowerCase()]);
  const middle: string[] = [];
  for (const name of inferred) {
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    middle.push(name);
  }
  for (const name of viaStops) {
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    middle.splice(Math.floor(middle.length / 2), 0, name);
  }
  const maxMid = Math.min(7, middle.length);
  return [origin, ...middle.slice(0, maxMid), destination];
}

export const METRO_ROUTES: MetroRoute[] = RAW_ROUTES.map(([number, origin, destination, via, km, minutes]) => {
  const stopNames = buildEnRouteStops(origin, destination, via, km);
  const stops = stopNames.map((name, index) => ({
    id: `${number}-s${index}`,
    name,
    isTerminal: index === 0 || index === stopNames.length - 1,
    lat: STOP_COORDS[name]?.lat,
    lng: STOP_COORDS[name]?.lng,
  }));

  const nearbyTaxis = [
    { stop: 'Gandhi Square', ranks: 'Faraday · Bree Street' },
    { stop: 'Joubert Park / Hillbrow', ranks: 'MTN Noord · Wanderers' },
  ];

  return {
    id: `mb-${number}`,
    letter: number,
    title: destination,
    origin,
    destination,
    via,
    direction: 'northbound',
    interval: `${minutes} min`,
    fare: estimateFare(km),
    serviceWindow: '',
    stopsCount: stops.length,
    stops,
    color: '#0d1747',
    distanceKm: km,
    durationMinutes: minutes,
    nearbyTaxis,
  };
});

const placeSet = new Set<string>();
METRO_ROUTES.forEach((route) => {
  placeSet.add(route.origin);
  placeSet.add(route.destination);
  if (route.via) placeSet.add(route.via);
});

export const ROUTE_PLACES = Array.from(placeSet).sort((a, b) => a.localeCompare(b));

export const ROUTE_HUBS = ['All', 'Gandhi Square'] as const;

const originSet = new Set<string>();
METRO_ROUTES.forEach((route) => {
  originSet.add(route.origin);
  originSet.add(route.destination);
});
export const ORIGIN_PLACES = Array.from(originSet).sort((a, b) => a.localeCompare(b));

export function getDestinationsFrom(from: string): string[] {
  const dests = new Set<string>();
  METRO_ROUTES.forEach((route) => {
    if (route.origin === from) {
      dests.add(route.destination);
      if (route.via) dests.add(route.via);
    }
    if (route.destination === from) {
      dests.add(route.origin);
      if (route.via) dests.add(route.via);
    }
    if (route.via === from) {
      dests.add(route.origin);
      dests.add(route.destination);
    }
  });
  dests.delete(from);
  return Array.from(dests).sort((a, b) => a.localeCompare(b));
}

export function getConnectingRoutes(from: string, to: string) {
  return METRO_ROUTES.filter((route) => {
    const forward =
      route.origin === from && (route.destination === to || route.via === to);
    const reverse =
      route.origin === to && (route.destination === from || route.via === from);
    const viaHop = route.via === from && (route.origin === to || route.destination === to);
    return forward || reverse || viaHop;
  });
}

export interface DepartureOption {
  depart: string;
  arrive: string;
}

export function shiftTime(hhmm: string, deltaMinutes: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  return fromMinutes(h * 60 + m + deltaMinutes);
}

function fromMinutes(total: number): string {
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function isPeak(mins: number): boolean {
  return (mins >= 6 * 60 && mins < 9 * 60) || (mins >= 16 * 60 && mins < 18 * 60 + 30);
}

function routeOffset(letter: string): number {
  let hash = 0;
  for (let i = 0; i < letter.length; i++) hash += letter.charCodeAt(i);
  return hash % 13;
}

function parseLeaveAt(leaveAt: string): number {
  const now = new Date();
  let start = now.getHours() * 60 + now.getMinutes();
  if (leaveAt && leaveAt !== 'Depart now') {
    const match = leaveAt.match(/(\d{1,2}):(\d{2})/);
    if (match) start = Number(match[1]) * 60 + Number(match[2]);
  }
  return start;
}

export function getUpcomingDepartures(
  route: { letter: string; distanceKm: number; durationMinutes: number },
  leaveAt: string,
  count = 4
): DepartureOption[] {
  const longHaul = route.distanceKm > 35;
  const inner = route.distanceKm < 12;
  const first = inner ? 5 * 60 + 30 : 6 * 60;
  const last = inner ? 19 * 60 : longHaul ? 18 * 60 : 18 * 60 + 30;
  const peakInterval = inner ? 12 : longHaul ? 30 : 20;
  const offPeakInterval = inner ? 25 : longHaul ? 45 : 30;
  const offset = routeOffset(route.letter);

  const after = parseLeaveAt(leaveAt);
  const options: DepartureOption[] = [];
  let t = first + offset;
  while (t <= last && options.length < count) {
    const interval = isPeak(t) ? peakInterval : offPeakInterval;
    if (t >= after) {
      const arrive = t + route.durationMinutes;
      if (arrive <= 20 * 60) {
        options.push({
          depart: fromMinutes(t),
          arrive: fromMinutes(arrive),
        });
      }
    }
    t += interval;
  }
  return options;
}
