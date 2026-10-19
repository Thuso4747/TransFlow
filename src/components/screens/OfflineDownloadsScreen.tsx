import React from 'react';
import { ScreenId, OfflinePackage } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { Download, Check, Trash2, RotateCw, ArrowRight } from 'lucide-react';

interface OfflineDownloadsProps {
  onNavigate: (screen: ScreenId) => void;
  packages: OfflinePackage[];
  onRemovePackage: (id: string) => void;
  onUpdatePackage: (id: string) => void;
  savedCount?: number;
}

export const OfflineDownloadsScreen: React.FC<OfflineDownloadsProps> = ({
  onNavigate,
  packages,
  onRemovePackage,
  onUpdatePackage,
  savedCount = 0,
}) => {
  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

        <div className="px-5 pt-5 pb-2">
          {/* Tag */}
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
            READY WHEN DATA IS LOW
          </p>

          {/* Title */}
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            Take your directions with you.
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] text-[#555d71] leading-relaxed mb-5">
            Offline copies are stored on this device. Fares and service information can become outdated.
          </p>

          {/* Package List */}
          {packages.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#dedad0] text-center my-6 shadow-xs">
              <Download className="w-10 h-10 text-[#798090] mx-auto mb-3" />
              <h3 className="text-base font-extrabold text-[#0d1747] mb-1">
                No offline packages
              </h3>
              <p className="text-xs text-[#555d71] max-w-xs mx-auto mb-5 leading-relaxed">
                Download directions from any journey results page to view without mobile data.
              </p>
              <button
                onClick={() => onNavigate('journey-planner')}
                className="inline-flex items-center gap-1.5 bg-[#0d1747] text-white px-5 py-3 rounded-2xl text-xs font-bold"
              >
                <span>Find a journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 mb-5">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs"
                >
                  {/* Top status badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#f0f6e6] text-[#456d17] border border-[#d2e2b9] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#84ad32]" />
                      <span>Available offline</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#798090]">
                      {pkg.sizeKb} KB
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-[#0d1747] mb-1">
                    {pkg.origin} – {pkg.destination}
                  </h3>

                  <p className="text-xs text-[#555d71] mb-2">
                    All text directions, fare snapshot, source labels and schematic.
                  </p>

                  <p className="text-[10px] text-[#798090] mb-4">
                    Downloaded {pkg.downloadDate} · Schema v1
                  </p>

                  {/* Actions matching Screen 19 */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-[#f0eee6]">
                    <button
                      onClick={() => onNavigate('offline-journey')}
                      className="w-full bg-[#0d1747] hover:bg-[#15236b] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Open offline copy</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onUpdatePackage(pkg.id)}
                        className="py-2.5 border border-[#dedad0] rounded-xl text-xs font-bold text-[#0d1747] hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-[#798090]" />
                        <span>Update</span>
                      </button>

                      <button
                        onClick={() => onRemovePackage(pkg.id)}
                        className="py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Manage data preferences link */}
          <div className="text-center pb-3">
            <button
              onClick={() => onNavigate('data-preferences')}
              className="text-xs font-bold text-[#0d1747] hover:underline"
            >
              Manage data preferences →
            </button>
          </div>
        </div>
      </div>

      <BottomNav currentScreen="offline-downloads" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
