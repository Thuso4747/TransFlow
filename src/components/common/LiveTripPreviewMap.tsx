import React, { useEffect, useRef } from 'react';
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

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export const LiveTripPreviewMap: React.FC<LiveTripPreviewMapProps> = ({ stops }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

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

    const dark = document.documentElement.classList.contains('tf-dark');
    const tiles = dark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    const map = L.map(host, {
      zoomControl: false,
      attributionControl: true,
      dragging: true,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer(tiles, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const first = points[0];
    map.setView([first.lat, first.lng], 15, { animate: false });

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
      map.remove();
      mapRef.current = null;
    };
  }, [stops]);

  const hasPoints = stops.some((stop) => stop.lat != null && stop.lng != null);

  if (!hasPoints) {
    return <p className="py-6 text-sm text-[#555d71]">Map preview is not available for this trip.</p>;
  }

  return (
    <div className="relative">
      <div ref={hostRef} className="tf-live-map h-[420px] w-full overflow-hidden rounded-2xl" />
    </div>
  );
};
