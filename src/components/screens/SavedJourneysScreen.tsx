import React, { useState } from 'react';
import { ScreenId, SavedJourney } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { Heart, Edit2, Trash2, Download, ArrowRight, Info, Check } from 'lucide-react';

interface SavedJourneysProps {
  onNavigate: (screen: ScreenId) => void;
  savedJourneys: SavedJourney[];
  onRemoveSaved: (id: string) => void;
  onRenameSaved: (id: string, newTitle: string) => void;
  onDownloadOffline: (id: string) => void;
}

export const SavedJourneysScreen: React.FC<SavedJourneysProps> = ({
  onNavigate,
  savedJourneys,
  onRemoveSaved,
  onRenameSaved,
  onDownloadOffline,
}) => {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartRename = (item: SavedJourney) => {
    setRenamingId(item.id);
    setEditName(item.title);
  };

  const handleSaveRename = (id: string) => {
    if (editName.trim()) {
      onRenameSaved(id, editName.trim());
    }
    setRenamingId(null);
  };

  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} />

        <div className="px-5 pt-5 pb-2">
          {/* Tag */}
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
            YOUR REGULAR JOURNEYS
          </p>

          {/* Title */}
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            A familiar way to go.
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] text-[#555d71] leading-relaxed mb-5">
            Journey shortcuts saved on this device. No cross-device account sync.
          </p>

          {/* Empty State: Screen 12 */}
          {savedJourneys.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#dedad0] text-center my-6 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#f7f6f2] border border-[#dedad0] flex items-center justify-center mx-auto mb-4 text-[#798090]">
                <Heart className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-base font-extrabold text-[#0d1747] mb-1">
                No saved journeys yet
              </h3>
              <p className="text-xs text-[#555d71] max-w-xs mx-auto mb-6 leading-relaxed">
                Plan a journey, then choose Save journey to keep it here.
              </p>
              <button
                onClick={() => onNavigate('journey-planner')}
                className="inline-flex items-center justify-center gap-2 bg-[#0d1747] hover:bg-[#15236b] text-white py-3 px-6 rounded-2xl font-bold text-xs shadow-sm transition-all"
              >
                <span>Plan journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Saved Journeys List: Screen 11 */
            <div className="space-y-4 mb-6">
              {savedJourneys.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs"
                >
                  {/* Top row with Heart & Date */}
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    <span className="text-[11px] text-[#798090] font-medium">
                      {item.scheduledTime}
                    </span>
                  </div>

                  {/* Nickname & Rename input */}
                  {renamingId === item.id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 bg-[#edeae2] px-3 py-1.5 rounded-xl text-sm font-extrabold text-[#0d1747] focus:outline-hidden"
                      />
                      <button
                        onClick={() => handleSaveRename(item.id)}
                        className="px-3 py-1.5 bg-[#84ad32] text-white rounded-xl text-xs font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-base font-extrabold text-[#0d1747] mb-0.5">
                      {item.title}
                    </h3>
                  )}

                  {/* Route */}
                  <p className="text-xs text-[#555d71] font-semibold mb-2">
                    {item.origin} → {item.destination}
                  </p>

                  {/* Fare & Duration */}
                  <div className="flex items-center gap-3 text-xs mb-3 pb-3 border-b border-[#f0eee6]">
                    <span className="font-extrabold text-[#0d1747]">{item.fare}</span>
                    <span className="text-[#a5acbe]">·</span>
                    <span className="text-[#555d71] font-medium">{item.durationMinutes} min</span>
                  </div>

                  {/* Date saved timestamp */}
                  <p className="text-[10px] text-[#798090] mb-3">
                    Saved {item.dateSaved}
                  </p>

                  {/* Action buttons matching Screen 11 */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onNavigate('journey-steps')}
                      className="py-2.5 px-3 bg-[#0d1747] hover:bg-[#15236b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Open journey</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleStartRename(item)}
                      className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-[#dedad0] text-[#0d1747] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#798090]" />
                      <span>Rename</span>
                    </button>

                    <button
                      onClick={() => onRemoveSaved(item.id)}
                      className="py-2 px-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>

                    <button
                      onClick={() => onDownloadOffline(item.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border ${
                        item.isOfflineDownloaded
                          ? 'bg-[#f0f6e6] text-[#456d17] border-[#d2e2b9]'
                          : 'border-[#dedad0] text-[#0d1747] hover:bg-slate-50'
                      }`}
                    >
                      {item.isOfflineDownloaded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#84ad32]" />
                          <span>Downloaded</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 text-[#798090]" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {/* Informative notice */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#dedad0] flex items-start gap-2.5 text-xs text-[#555d71] shadow-2xs">
                <Info className="w-4 h-4 text-[#798090] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Saving stores a shortcut and snapshot. Download for offline to also preserve the step-by-step text and complete directions are available without a connection.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav currentScreen="saved-journeys" onNavigate={onNavigate} savedCount={savedJourneys.length} />
    </div>
  );
};
