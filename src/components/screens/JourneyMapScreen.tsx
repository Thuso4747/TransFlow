import React, { useState, useEffect } from 'react';
import { ScreenId } from '../../types/transit';
import {
  ArrowRight,
  Footprints,
  Navigation,
  MapPin,
  Plus,
  Minus,
  Compass,
  CheckCircle2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { BottomNav } from '../common/BottomNav';

import { JourneyOption, JourneySearchParams } from '../../types/transit';

interface JourneyMapProps {
  onNavigate: (screen: ScreenId) => void;
  searchParams?: JourneySearchParams;
  selectedJourney?: JourneyOption | null;
}

export const JourneyMapScreen: React.FC<JourneyMapProps> = ({
  onNavigate,
  searchParams,
  selectedJourney,
}) => {
  const origin = searchParams?.fromLocation || selectedJourney?.origin || 'Park Station';
  const destination = searchParams?.toLocation || selectedJourney?.destination || 'Rosebank Mall';
  const duration = selectedJourney ? `${selectedJourney.durationMinutes}` : '46';
  const fare = selectedJourney ? selectedJourney.fare : 'R18.00';
  const departureWindow = selectedJourney
    ? `${selectedJourney.departureTime} → ${selectedJourney.arrivalTime}`
    : '08:10 → 08:56';

  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeStopIndex, setActiveStopIndex] = useState<number | null>(null);
  const [isTripActive, setIsTripActive] = useState(false);
  const [tripProgress, setTripProgress] = useState(0); // 0 to 100
  const [audioAlerts, setAudioAlerts] = useState(true);

  // Simulation timer for active trip
  useEffect(() => {
    let interval: any;
    if (isTripActive) {
      interval = setInterval(() => {
        setTripProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTripActive]);

  const STOPS_DATA = [
    { name: origin.includes('Station') ? origin : `${origin} area`, x: 135, y: 350, time: '08:16', desc: 'Starting Terminal & Gautrain Connection' },
    { name: 'Braamfontein', x: 135, y: 300, time: '08:22', desc: 'Civic Centre & Nelson Mandela Bridge' },
    { name: 'Wits University', x: 155, y: 250, time: '08:28', desc: 'Empire Road Main Gate Stop' },
    { name: 'Parktown', x: 180, y: 200, time: '08:34', desc: 'Jan Smuts & Carse O Gowrie' },
    { name: 'Zoo Lake', x: 200, y: 160, time: '08:41', desc: 'Lower Park Drive' },
    { name: 'Saxonwold', x: 215, y: 130, time: '08:47', desc: 'Saxonwold Circle' },
    { name: destination, x: 235, y: 100, time: '08:52', desc: 'Terminal Destination Stop' },
  ];

  return (
    <div className="min-h-screen pb-24 pt-5 px-4 max-w-md mx-auto">
      {/* Header Tag & Title */}
      <div className="mb-4">
        <p className="text-[11px] font-extrabold tracking-wider text-[#0d1747] uppercase mb-1">
          Your journey / Northbound
        </p>
        <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
          {origin} to {destination}
        </h1>
        <p className="text-[13px] text-[#555d71]">
          Wed, 14 Oct · via Jan Smuts Avenue
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#e5e1d7] flex items-center justify-between mb-4 shadow-xs">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-[#0d1747]">{duration}</span>
          <span className="text-sm font-semibold text-[#555d71]">min</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-extrabold text-[#0d1747]">
            {departureWindow}
          </p>
          <p className="text-xs text-[#555d71]">
            No transfers · 680 m walking
          </p>
        </div>
      </div>

      {/* Active Trip Simulation Banner if running */}
      {isTripActive && (
        <div className="mb-4 bg-[#0d1747] text-white p-4 rounded-2xl shadow-lg border border-[#84ad32]/50 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#84ad32] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#a7d44c]">
                Live Trip Active · Corridor A
              </span>
            </div>
            <button
              onClick={() => setAudioAlerts(!audioAlerts)}
              className="text-white/70 hover:text-white"
            >
              {audioAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span>Next Stop: {tripProgress < 40 ? 'Braamfontein' : tripProgress < 75 ? 'Zoo Lake' : 'Rosebank Mall'}</span>
            <span>{100 - tripProgress}% remaining</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#84ad32] h-full transition-all duration-500 rounded-full"
              style={{ width: `${tripProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Interactive transit map representation */}
      <div className="rounded-3xl border border-[#dedad0] overflow-hidden relative bg-[#eef1eb] mb-5 shadow-inner">
        {/* Top left not to scale badge */}
        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[10px] font-bold text-[#0d1747] shadow-xs flex items-center gap-1.5 border border-white">
          <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          </svg>
          <span>Illustrative journey · not to scale</span>
        </div>

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.3))}
            className="w-7 h-7 bg-white hover:bg-slate-100 rounded-lg shadow-sm border border-[#d8d3c7] flex items-center justify-center text-[#0d1747]"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.85))}
            className="w-7 h-7 bg-white hover:bg-slate-100 rounded-lg shadow-sm border border-[#d8d3c7] flex items-center justify-center text-[#0d1747]"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Compass */}
        <div className="absolute bottom-12 right-3 z-10 w-7 h-7 bg-white rounded-lg shadow-sm border border-[#d8d3c7] flex flex-col items-center justify-center text-[#0d1747]">
          <span className="text-[8px] font-black leading-none">▲</span>
          <span className="text-[9px] font-black leading-none">N</span>
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#0d1747] shadow-xs flex items-center gap-3 border border-white">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1 bg-[#84ad32] rounded-full" />
            <span>Example A</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0d1747] bg-white" />
            <span>Area stop</span>
          </div>
        </div>

        {/* SVG Johannesburg Map Canvas */}
        <div
          className="transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 380 440"
            className="w-full h-80 select-none"
            style={{ backgroundColor: '#ebefe6' }}
          >
            {/* Street Grid Lines */}
            <path d="M 0 80 L 380 80" stroke="#ffffff" strokeWidth="12" />
            <path d="M 0 170 L 380 170" stroke="#ffffff" strokeWidth="14" />
            <path d="M 0 270 L 380 270" stroke="#ffffff" strokeWidth="12" />
            <path d="M 0 370 L 380 370" stroke="#ffffff" strokeWidth="16" />

            {/* Vertical Arterials */}
            <path d="M 70 0 L 70 440" stroke="#ffffff" strokeWidth="10" />
            <path d="M 280 0 L 280 440" stroke="#ffffff" strokeWidth="16" />
            <path d="M 170 0 L 170 440" stroke="#ffffff" strokeWidth="10" />

            {/* Parktown / Zoo Lake Green Spaces */}
            <ellipse cx="160" cy="170" rx="36" ry="24" fill="#d2dec1" />
            <ellipse cx="320" cy="180" rx="42" ry="32" fill="#d2dec1" />

            {/* Suburb / Road Names */}
            <text x="250" y="70" fill="#758270" fontSize="8" fontWeight="bold" letterSpacing="0.5">
              BOLTON RD
            </text>
            <text x="165" y="72" fill="#323f2f" fontSize="9" fontWeight="bold">
              Rosebank
            </text>
            <text x="195" y="125" fill="#52624d" fontSize="8" fontWeight="600">
              Saxonwold
            </text>
            <text x="145" y="172" fill="#445540" fontSize="8" fontWeight="bold">
              Zoo Lake
            </text>
            <text x="215" y="178" fill="#52624d" fontSize="8">
              Johannesburg Zoo
            </text>
            <text x="188" y="228" fill="#323f2f" fontSize="9" fontWeight="bold">
              Parktown
            </text>
            <text x="85" y="258" fill="#52624d" fontSize="8">
              Wits University
            </text>
            <text x="75" y="328" fill="#52624d" fontSize="8">
              Braamfontein
            </text>
            <text x="205" y="395" fill="#727b88" fontSize="8" fontWeight="bold">
              JOHANNESBURG CBD
            </text>

            {/* Corridor A Bus Path in Lime Green */}
            <path
              d="M 135 350 L 135 300 L 155 250 L 180 200 L 200 160 L 215 130 L 235 100"
              stroke="#84ad32"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active Bus Marker during trip simulation */}
            {isTripActive && (
              <circle
                cx={135 + (tripProgress / 100) * 100}
                cy={350 - (tripProgress / 100) * 250}
                r="7"
                fill="#0d1747"
                stroke="#ffffff"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />
            )}

            {/* Stop Nodes */}
            {STOPS_DATA.map((stop, idx) => {
              const isSelected = activeStopIndex === idx;
              return (
                <g
                  key={stop.name}
                  onClick={() => setActiveStopIndex(isSelected ? null : idx)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={stop.x}
                    cy={stop.y}
                    r={isSelected ? 7 : 5}
                    fill={isSelected ? '#84ad32' : '#ffffff'}
                    stroke="#0d1747"
                    strokeWidth="2.5"
                  />
                  {stop.name === 'Park Station' && (
                    <text x={stop.x + 12} y={stop.y + 4} fill="#0d1747" fontSize="9" fontWeight="bold">
                      Park Station
                    </text>
                  )}
                </g>
              );
            })}

            {/* Destination Callout Badge: Rosebank Mall */}
            <g transform="translate(242, 80)">
              <rect
                x="0"
                y="0"
                width="95"
                height="24"
                rx="6"
                fill="#ffffff"
                stroke="#d6d2c8"
                strokeWidth="1"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
              />
              <text x="8" y="11" fill="#0d1747" fontSize="9" fontWeight="bold">
                Rosebank
              </text>
              <text x="8" y="20" fill="#0d1747" fontSize="9" fontWeight="bold">
                Mall
              </text>
            </g>
          </svg>
        </div>

        {/* Selected stop info popup */}
        {activeStopIndex !== null && (
          <div className="absolute top-12 left-4 right-4 z-20 bg-white p-3 rounded-2xl shadow-lg border border-[#e5e1d7] flex items-center justify-between animate-fadeIn">
            <div>
              <p className="text-xs font-bold text-[#0d1747]">
                {STOPS_DATA[activeStopIndex].name}
              </p>
              <p className="text-[11px] text-[#555d71]">
                ETA: {STOPS_DATA[activeStopIndex].time} · {STOPS_DATA[activeStopIndex].desc}
              </p>
            </div>
            <button
              onClick={() => setActiveStopIndex(null)}
              className="text-xs text-[#0d1747] font-bold px-2 py-1 bg-slate-100 rounded-lg"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Your journey Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold text-[#0d1747]">
            Your journey
          </h3>
          <button
            onClick={() => onNavigate('home-dashboard')}
            className="text-sm font-bold text-[#0d1747] hover:underline"
          >
            Edit
          </button>
        </div>

        {/* Origin & Destination line */}
        <div className="pl-1 mb-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#0d1747] bg-white flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#0d1747]" />
            </div>
            <span className="font-extrabold text-sm text-[#0d1747]">
              {origin}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#0d1747] shrink-0" />
            <span className="font-extrabold text-sm text-[#0d1747]">
              {destination}
            </span>
          </div>
        </div>

        {/* Step 1: Walk to boarding area */}
        <div className="bg-white rounded-2xl p-4 border border-[#e5e1d7] mb-3 flex items-start gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#edeae2] flex items-center justify-center text-[#454c60] shrink-0">
            <Footprints className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-[#0d1747]">
                Walk to boarding area
              </h4>
              <span className="text-xs font-bold text-[#555d71]">6 min</span>
            </div>
            <p className="text-xs text-[#555d71] mt-0.5">
              08:10 · Park Station area · about 400 m
            </p>
          </div>
        </div>

        {/* Step 2: Bus Corridor A */}
        <div className="bg-[#f2f7e8] rounded-2xl p-4 border border-[#d6e5be] mb-3 shadow-xs">
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#84ad32] text-white flex items-center justify-center font-black text-sm shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-[#0d1747]">
                  Towards Rosebank
                </h4>
                <span className="text-xs font-bold text-[#555d71]">36 min</span>
              </div>
              <p className="text-[10px] font-extrabold text-[#637151] uppercase tracking-wider mt-0.5">
                Metrobus · Example A
              </p>
            </div>
          </div>

          {/* Stops Timeline */}
          <div className="pl-3.5 border-l-2 border-[#84ad32] ml-4 space-y-3 my-2 text-xs">
            <div>
              <div className="flex items-center justify-between font-bold text-[#0d1747]">
                <span>08:16</span>
                <span>Park Station area</span>
              </div>
            </div>
            <div className="py-1">
              <p className="text-[11px] text-[#556345] font-semibold bg-white/70 px-2.5 py-1.5 rounded-lg border border-[#e0ebd0]">
                7 example stops via Braamfontein, Parktown and Zoo Lake
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between font-bold text-[#0d1747]">
                <span>08:52</span>
                <span>Rosebank area</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Walk to Rosebank Mall */}
        <div className="bg-white rounded-2xl p-4 border border-[#e5e1d7] mb-5 flex items-start gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#edeae2] flex items-center justify-center text-[#454c60] shrink-0">
            <Footprints className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-[#0d1747]">
                Walk to Rosebank Mall
              </h4>
              <span className="text-xs font-bold text-[#555d71]">4 min</span>
            </div>
            <p className="text-xs text-[#555d71] mt-0.5">
              Arrive 08:56 · about 280 m
            </p>
          </div>
        </div>

        {/* Fare row */}
        <div className="flex items-center justify-between pt-2 pb-5 border-t border-[#e5e1d7]">
          <div>
            <p className="text-xs font-bold text-[#0d1747]">
              Illustrative fare
            </p>
            <p className="text-xs text-[#555d71]">
              Confirm before boarding
            </p>
          </div>
          <span className="text-2xl font-extrabold text-[#0d1747]">
            R18.00
          </span>
        </div>

        {/* Start trip Button */}
        <div>
          <button
            onClick={() => {
              setIsTripActive(!isTripActive);
              if (!isTripActive) {
                setTripProgress(10);
              }
            }}
            className="w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#0d1747]/15 transition-all"
          >
            <span>{isTripActive ? 'End Trip' : 'Start trip'}</span>
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav currentScreen="journey-map" onNavigate={onNavigate} />
    </div>
  );
};
