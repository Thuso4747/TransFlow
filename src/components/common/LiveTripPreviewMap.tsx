import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type PreviewStop = {
  name: string;
  lat?: number;
  lng?: number;
  isBoard?: boolean;
  isAlight?: boolean;
};

interface LiveTripPreviewMapProps {
  stops: PreviewStop[];
}

const JHB_CBD: L.LatLngTuple = [-26.2041, 28.0473];
const OSM_TILES = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
const STREET_FALLBACK =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function locateErrorMessage(error: GeolocationPositionError | null, unsupported: boolean) {
  if (unsupported) return 'Location is not supported in this browser.';
  if (!error) return 'Could not get your location.';
  if (error.code === error.PERMISSION_DENIED) {
    return 'Location permission was denied. Allow location in the browser and try again.';
  }
  if (error.code === error.POSITION_UNAVAILABLE) return 'Your location is unavailable.';
  if (error.code === error.TIMEOUT) return 'Location request timed out.';
  return 'Could not get your location.';
}

export const LiveTripPreviewMap: React.FC<LiveTripPreviewMapProps> = ({ stops }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [locateError, setLocateError] = useState('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const points = stops
      .filter((stop) => stop.lat != null && stop.lng != null)
      .map((stop) => ({
        name: stop.name,
        lat: stop.lat as number,
        lng: stop.lng as number,
        isBoard: Boolean(stop.isBoard),
        isAlight: Boolean(stop.isAlight),
      }));

    if (points.length === 0) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const dark = document.documentElement.classList.contains('tf-dark');

    const map = L.map(host, {
      zoomControl: false,
      attributionControl: true,
      dragging: true,
      scrollWheelZoom: false,
      touchZoom: true,
    });
    mapRef.current = map;

    const tiles = L.tileLayer(OSM_TILES, {
      attribution: OSM_ATTR,
      maxZoom: 19,
    }).addTo(map);

    let usedFallback = false;
    tiles.on('tileerror', () => {
      if (usedFallback) return;
      usedFallback = true;
      L.tileLayer(STREET_FALLBACK, {
        attribution: `${OSM_ATTR} · Tiles © Esri`,
        maxZoom: 19,
      }).addTo(map);
    });

    map.setView(JHB_CBD, 14, { animate: false });

    const first = points[0];

    const ghost = L.polyline(
      points.map((stop) => [stop.lat, stop.lng] as L.LatLngExpression),
      { color: dark ? '#1b2762' : '#c5c9d4', weight: 6, opacity: 0.55, lineJoin: 'round' },
    ).addTo(map);

    const outline = L.polyline([], {
      color: '#0d1747',
      weight: 8,
      opacity: 1,
      lineJoin: 'round',
      lineCap: 'round',
    }).addTo(map);

    const lime = L.polyline([], {
      color: '#96BD47',
      weight: 4,
      opacity: 1,
      lineJoin: 'round',
      lineCap: 'round',
    }).addTo(map);

    const offsets = [
      { x: 12, y: -34 },
      { x: 12, y: 12 },
      { x: -12, y: -34 },
      { x: -12, y: 12 },
    ];

    let cancelled = false;
    const markers: L.Marker[] = [];

    const addStop = (stop: (typeof points)[number], index: number) => {
      const offset = offsets[index % offsets.length];
      const alignRight = offset.x < 0;
      const icon = L.divIcon({
        className: 'tf-map-marker',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        html: `<div class="tf-map-pin ${stop.isBoard || stop.isAlight ? 'tf-map-pin--end' : ''}">
            <span class="tf-map-dot"></span>
            <span class="tf-map-label${alignRight ? ' tf-map-label--left' : ''}" style="transform: translate(${offset.x}px, ${offset.y}px)">
              ${stop.name}
            </span>
          </div>`,
      });
      const marker = L.marker([stop.lat, stop.lng], { icon, interactive: false }).addTo(map);
      markers.push(marker);
    };

    const play = async () => {
      const drawn: L.LatLngExpression[] = [[first.lat, first.lng]];
      outline.setLatLngs(drawn);
      lime.setLatLngs(drawn);
      addStop(points[0], 0);
      await wait(900);
      if (cancelled) return;

      for (let i = 1; i < points.length; i += 1) {
        if (cancelled) return;
        const from = points[i - 1];
        const to = points[i];
        const steps = 12;
        for (let s = 1; s <= steps; s += 1) {
          if (cancelled) return;
          const t = s / steps;
          const lat = lerp(from.lat, to.lat, t);
          const lng = lerp(from.lng, to.lng, t);
          drawn.push([lat, lng]);
          outline.setLatLngs(drawn);
          lime.setLatLngs(drawn);
          map.panTo([lat, lng], { animate: true, duration: 0.12 });
          await wait(70);
        }
        addStop(to, i);
        map.flyTo([to.lat, to.lng], 15, { duration: 0.55, easeLinearity: 0.4 });
        await wait(850);
      }

      if (cancelled) return;
      map.fitBounds(ghost.getBounds().pad(0.28), { animate: true, duration: 1.6, maxZoom: 14 });
    };

    const ready = window.setTimeout(() => map.invalidateSize(), 80);
    void play();

    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.clearTimeout(ready);
      window.removeEventListener('resize', onResize);
      markers.forEach((marker) => marker.remove());
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [stops]);

  const handleMyLocation = () => {
    setLocateError('');
    if (!navigator.geolocation) {
      setLocateError(locateErrorMessage(null, true));
      return;
    }
    const map = mapRef.current;
    if (!map) {
      setLocateError('Map is still loading.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const liveMap = mapRef.current;
        if (!liveMap) return;
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const icon = L.divIcon({
          className: 'tf-map-marker',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          html: `<div class="tf-map-pin tf-map-pin--end">
              <span class="tf-map-dot"></span>
              <span class="tf-map-label" style="transform: translate(12px, -34px)">You</span>
            </div>`,
        });
        userMarkerRef.current?.remove();
        userMarkerRef.current = L.marker([lat, lng], { icon, interactive: false }).addTo(liveMap);
        liveMap.flyTo([lat, lng], 16, { duration: 0.8 });
      },
      (error) => {
        setLocating(false);
        setLocateError(locateErrorMessage(error, false));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  };

  const hasPoints = stops.some((stop) => stop.lat != null && stop.lng != null);

  if (!hasPoints) {
    return <p className="py-6 text-sm text-[#555d71]">Map preview is not available for this trip.</p>;
  }

  return (
    <div className="relative">
      <div ref={hostRef} className="tf-live-map h-[420px] w-full overflow-hidden rounded-2xl" />
      <button
        type="button"
        onClick={handleMyLocation}
        disabled={locating}
        className="absolute top-3 right-3 z-[1000] bg-[#0d1747] text-white text-sm font-semibold px-3.5 py-2 rounded-full shadow-lg shadow-[#0d1747]/20 disabled:opacity-70"
      >
        {locating ? 'Finding…' : 'My location'}
      </button>
      {locateError ? (
        <p className="mt-2 text-sm font-medium text-[#c62828]">{locateError}</p>
      ) : null}
    </div>
  );
};
