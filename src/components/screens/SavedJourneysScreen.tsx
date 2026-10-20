import React, { useState } from 'react';
import { ScreenId, SavedJourney } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface SavedJourneysProps {
  onNavigate: (screen: ScreenId) => void;
  savedJourneys: SavedJourney[];
  onRemoveSaved: (id: string) => void;
  onRenameSaved: (id: string, newTitle: string) => void;
  onDownloadOffline: (id: string) => void;
  onOpenSaved: (item: SavedJourney) => void;
}

export const SavedJourneysScreen: React.FC<SavedJourneysProps> = ({
  onNavigate,
  savedJourneys,
  onRemoveSaved,
  onRenameSaved,
  onDownloadOffline,
  onOpenSaved,
}) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartRename = (item: SavedJourney) => {
    setRenamingId(item.id);
    setEditName(item.title);
  };

  const handleSaveRename = (id: string) => {
    if (editName.trim()) onRenameSaved(id, editName.trim());
    setRenamingId(null);
  };

  return (
    <div className="min-h-[100dvh] pb-20 bg-[#f7f6f2] max-w-md mx-auto flex flex-col">
      <TransFlowHeader onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col px-4 pt-5 pb-2">
        {savedJourneys.length === 0 ? (
          <>
            <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
              No saved journeys yet.
            </h1>
            <p className="mt-2 text-sm text-[#555d71] leading-relaxed">
              Saved journeys live here, including trips you download for offline use.
            </p>
            <div className="flex-1 flex flex-col">
              <div className="mt-auto pt-8">
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
          </>
        ) : (
          <>
            <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
              Saved.
            </h1>
            <p className="mt-2 mb-5 text-sm text-[#555d71] leading-relaxed">
              Saved journeys live here, including trips you download for offline use.
            </p>

            <div>
              {savedJourneys.map((item) => {
                const isOpen = openId === item.id;
                const routeLetter = item.snapshot?.busLine;
                return (
                  <div key={item.id} className="border-b border-[#ece9e0]">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="w-full py-3.5 flex items-start gap-3 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-[#0d1747]">
                          {item.origin} → {item.destination}
                        </p>
                        <p className="mt-0.5 text-sm text-[#555d71]">
                          {item.scheduledTime}
                          {routeLetter ? ` · Route ${routeLetter}` : ''}
                          {` · ${item.durationMinutes} min`}
                        </p>
                      </div>
                      <p className="shrink-0 text-[15px] font-extrabold tabular-nums text-[#96BD47]">
                        {item.fare}
                      </p>
                      <ChevronDown
                        className={`w-4 h-4 mt-1 shrink-0 text-[#687085] transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="pb-4">
                        {renamingId === item.id ? (
                          <div className="flex items-center gap-2 py-2.5 border-b border-[#ece9e0]">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 bg-transparent border-b border-[#ece9e0] py-1 text-[15px] font-semibold text-[#0d1747] focus:outline-hidden"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveRename(item.id)}
                              className="text-sm font-semibold text-[#96BD47]"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                            <span className="text-[12px] text-[#687085]">Name</span>
                            <span className="text-[15px] font-semibold text-[#0d1747] text-right">
                              {item.title}
                            </span>
                          </div>
                        )}
                        <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                          <span className="text-[12px] text-[#687085]">Time</span>
                          <span className="text-[15px] font-semibold tabular-nums text-[#0d1747]">
                            {item.scheduledTime}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                          <span className="text-[12px] text-[#687085]">Duration</span>
                          <span className="text-[15px] font-semibold text-[#0d1747]">
                            {item.durationMinutes} min
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                          <span className="text-[12px] text-[#687085]">Fare</span>
                          <span className="text-[18px] font-extrabold tabular-nums text-[#96BD47]">
                            {item.fare}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                          <span className="text-[12px] text-[#687085]">Offline</span>
                          <span className="text-[15px] font-semibold text-[#0d1747]">
                            {item.isOfflineDownloaded ? 'Saved on this device' : 'Not downloaded'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onOpenSaved(item)}
                          className="mt-4 w-full bg-[#96BD47] hover:bg-[#7fa53a] text-white py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                        >
                          <span>Open trip</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <div className="mt-3 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleStartRename(item)}
                            className="text-sm font-semibold text-[#0d1747]"
                          >
                            Rename
                          </button>
                          {!item.isOfflineDownloaded ? (
                            <button
                              type="button"
                              onClick={() => onDownloadOffline(item.id)}
                              className="text-sm font-semibold text-[#0d1747]"
                            >
                              Download offline
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => onRemoveSaved(item.id)}
                            className="text-sm font-semibold text-[#c62828]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <BottomNav currentScreen="saved-journeys" onNavigate={onNavigate} savedCount={savedJourneys.length} />
    </div>
  );
};
