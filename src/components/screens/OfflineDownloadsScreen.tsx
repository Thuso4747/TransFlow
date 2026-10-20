import React, { useState } from 'react';
import { ScreenId, OfflinePackage } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface OfflineDownloadsProps {
  onNavigate: (screen: ScreenId) => void;
  packages: OfflinePackage[];
  onRemovePackage: (id: string) => void;
  onUpdatePackage: (id: string) => void;
  onOpenPackage: (pkg: OfflinePackage) => void;
  savedCount?: number;
}

export const OfflineDownloadsScreen: React.FC<OfflineDownloadsProps> = ({
  onNavigate,
  packages,
  onRemovePackage,
  onOpenPackage,
  savedCount = 0,
}) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="min-h-[100dvh] pb-20 bg-[#f7f6f2] max-w-md mx-auto flex flex-col">
      <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

      <div className="flex-1 flex flex-col px-4 pt-5">
        {packages.length === 0 ? (
          <>
            <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
              No offline copies yet.
            </h1>
            <p className="mt-2 text-sm text-[#555d71] leading-relaxed">
              Download a trip to keep directions on this device.
            </p>
            <div className="mt-auto pt-8">
              <button
                type="button"
                onClick={() => onNavigate('home-dashboard')}
                className="w-full bg-[#0d1747] hover:bg-[#142161] text-white py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2"
              >
                <span>Plan a trip</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
              Offline downloads.
            </h1>
            <p className="mt-2 mb-5 text-sm text-[#555d71] leading-relaxed">
              Copies stored on this device. Fares can become outdated.
            </p>

            {packages.map((pkg) => {
              const isOpen = openId === pkg.id;
              const letter = pkg.snapshot?.busLine;
              return (
                <div key={pkg.id} className="border-b border-[#ece9e0]">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : pkg.id)}
                    className="w-full py-3.5 flex items-start gap-3 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-[#0d1747]">
                        {pkg.origin} → {pkg.destination}
                      </p>
                      <p className="mt-0.5 text-sm text-[#555d71]">
                        {letter ? `Route ${letter} · ` : ''}
                        {pkg.durationMinutes} min · {pkg.downloadDate}
                      </p>
                    </div>
                    <p className="shrink-0 text-[15px] font-extrabold tabular-nums text-[#96BD47]">{pkg.fare}</p>
                    <ChevronDown
                      className={`w-4 h-4 mt-1 shrink-0 text-[#687085] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-4">
                      <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                        <span className="text-[12px] text-[#687085]">Duration</span>
                        <span className="text-[15px] font-semibold text-[#0d1747]">{pkg.durationMinutes} min</span>
                      </div>
                      <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                        <span className="text-[12px] text-[#687085]">Fare</span>
                        <span className="text-[18px] font-extrabold tabular-nums text-[#96BD47]">{pkg.fare}</span>
                      </div>
                      <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                        <span className="text-[12px] text-[#687085]">Offline</span>
                        <span className="text-[15px] font-semibold text-[#0d1747]">Saved on this device</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenPackage(pkg)}
                        className="mt-4 w-full bg-[#96BD47] hover:bg-[#7fa53a] text-white py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <span>Open trip</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemovePackage(pkg.id)}
                        className="mt-3 text-sm font-semibold text-[#c62828]"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      <BottomNav currentScreen="offline-downloads" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
