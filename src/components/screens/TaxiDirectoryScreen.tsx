import React, { useState } from 'react';
import { ScreenId, TaxiRank } from '../../types/transit';
import { TAXI_RANKS } from '../../data/mockData';
import {
  Search,
  ChevronDown,
  Car,
  FileText,
  Clock,
  ArrowRight,
  Info,
  X,
  MapPin,
  HelpCircle,
  Coins,
  ShieldAlert,
} from 'lucide-react';
import { BottomNav } from '../common/BottomNav';

import { TransFlowHeader } from '../common/TransFlowHeader';

interface TaxiDirectoryProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectRank?: (rank: TaxiRank) => void;
  onSelectDestination?: (dest: string) => void;
  savedCount?: number;
}

export const TaxiDirectoryScreen: React.FC<TaxiDirectoryProps> = ({
  onNavigate,
  onSelectRank,
  onSelectDestination,
  savedCount = 0,
}) => {
  const [ranksList, setRanksList] = useState<TaxiRank[]>(TAXI_RANKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [fareFilter, setFareFilter] = useState<'all' | 'indicative' | 'unconfirmed'>('all');
  const [selectedRank, setSelectedRank] = useState<TaxiRank | null>(null);
  const [isAddRankModalOpen, setIsAddRankModalOpen] = useState(false);

  // New Rank Form fields
  const [newRankName, setNewRankName] = useState('');
  const [newRankDest, setNewRankDest] = useState('');
  const [newRankFare, setNewRankFare] = useState('');
  const [newRankTips, setNewRankTips] = useState('');

  const handleOpenRankDetails = (rank: TaxiRank) => {
    if (onSelectRank) {
      onSelectRank(rank);
    }
    onNavigate('taxi-details');
  };

  const handleAddRank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRankName.trim() || !newRankDest.trim()) return;

    const createdRank: TaxiRank = {
      id: `custom-rank-${Date.now()}`,
      name: newRankName.trim(),
      destination: `To ${newRankDest.trim()}`,
      fareStatus: newRankFare.trim() ? 'indicative' : 'unconfirmed',
      fareRange: newRankFare.trim() ? `R ${newRankFare.trim()}` : 'Fare unknown',
      source: 'Commuter Community Report',
      lastReviewed: 'Just now · Verified by TransFlow',
      isDemo: false,
      description: 'Commuter-reported rank facility with latest local pricing updates.',
      popularDestinations: [newRankDest.trim()],
      boardingTips: newRankTips.trim() || 'Confirm bay with the rank marshall on arrival.',
      connectingBus: 'Nearby Metrobus feeder stop',
    };

    setRanksList([createdRank, ...ranksList]);
    setIsAddRankModalOpen(false);
    setNewRankName('');
    setNewRankDest('');
    setNewRankFare('');
    setNewRankTips('');
  };

  const handlePlanToRank = (rank: TaxiRank) => {
    if (onSelectDestination) {
      onSelectDestination(rank.name);
    }
    setSelectedRank(null);
    onNavigate('journey-planner');
  };

  const filteredRanks = ranksList.filter((rank) => {
    const matchesQuery =
      rank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rank.destination.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (fareFilter === 'indicative' && rank.fareStatus !== 'indicative') return false;
    if (fareFilter === 'unconfirmed' && rank.fareStatus !== 'unconfirmed') return false;

    return true;
  });

  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} />

        <div className="px-5 pt-5 pb-2">
          {/* Header Tag matching Screen 07 */}
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
            KNOW BEFORE YOU BOARD
          </p>
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            Taxi information, clearly.
          </h1>
          <p className="text-[13px] text-[#555d71] leading-relaxed mb-4">
            Search a rank. Check the fare. See and know where the information comes from.
          </p>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-[#dedad0] p-3 flex items-center gap-2.5 mb-4 shadow-2xs">
        <Search className="w-4 h-4 text-[#798090] shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search rank or destination"
          className="w-full bg-transparent text-xs font-semibold text-[#0d1747] placeholder-[#798090] focus:outline-hidden"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label className="block text-[10px] font-extrabold tracking-wider text-[#798090] uppercase mb-1">
          Fare Information
        </label>
        <div className="relative">
          <select
            value={fareFilter}
            onChange={(e) => setFareFilter(e.target.value as any)}
            className="w-full bg-white rounded-2xl border border-[#dedad0] p-3 text-xs font-bold text-[#0d1747] appearance-none pr-8 focus:outline-hidden cursor-pointer shadow-2xs"
          >
            <option value="all">All records</option>
            <option value="indicative">Confirmed indicative fares only</option>
            <option value="unconfirmed">Unconfirmed records only</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#798090] absolute right-3 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Directory Count */}
      <div className="text-xs font-semibold text-[#555d71] mb-3">
        {filteredRanks.length} directory records
      </div>

      {/* Ranks Cards List */}
      <div className="space-y-4">
        {filteredRanks.map((rank) => {
          const isIndicative = rank.fareStatus === 'indicative';

          return (
            <div
              key={rank.id}
              className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs"
            >
              {/* Header: Icon + Name + Demo badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#edeae2] flex items-center justify-center text-[#0d1747] shrink-0 mt-0.5">
                    {/* Minibus Taxi Silhouette Icon */}
                    <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="13" rx="2" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <circle cx="7" cy="17" r="2" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0d1747]">
                      {rank.name}
                    </h3>
                    <p className="text-xs text-[#555d71]">
                      {rank.destination}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fare Sub-card */}
              <div
                className={`rounded-2xl p-3.5 my-3.5 ${
                  isIndicative
                    ? 'bg-[#f0f5e7] border border-[#dce9c9]'
                    : 'bg-[#edeae2]'
                }`}
              >
                <p
                  className={`text-[9px] font-extrabold uppercase tracking-wider mb-0.5 ${
                    isIndicative ? 'text-[#546b2b]' : 'text-[#798090]'
                  }`}
                >
                  {isIndicative ? 'Indicative Single Fare' : 'Fare Not Confirmed'}
                </p>
                <p className="text-xl font-extrabold text-[#0d1747]">
                  {rank.fareRange}
                </p>
              </div>

              {/* Source & Metadata */}
              <div className="flex items-start gap-2 text-xs text-[#555d71] mb-3">
                {isIndicative ? (
                  <FileText className="w-3.5 h-3.5 text-[#798090] shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-[#798090] shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-[11px] font-medium text-[#485065]">
                    {rank.source}
                  </p>
                  <p className="text-[10px] text-[#798090]">
                    {rank.lastReviewed}
                  </p>
                </div>
              </div>

              {/* View Rank Details Link */}
              <div className="pt-2 border-t border-[#edeae2]">
                <button
                  onClick={() => setSelectedRank(rank)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#0d1747] hover:text-[#84ad32] transition-colors"
                >
                  <span>View rank details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operator Warning Box */}
      <div className="border border-dashed border-[#ccc7ba] rounded-2xl p-3.5 flex items-start gap-2.5 my-5 bg-white/50">
        <Info className="w-4 h-4 text-[#798090] shrink-0 mt-0.5" />
        <p className="text-xs text-[#555d71] leading-relaxed">
          Confirm the fare and boarding point with the operator on rank arrival. There is no booking, departure guarantee or live vehicle feed.
        </p>
      </div>

      {/* Seed Network Footer Tag */}
      <div className="flex items-center justify-between text-[10px] text-[#798090] px-1 font-mono pb-2">
        <span>TransFlow Transit Network</span>
        <span>Directory Records</span>
      </div>
        </div>
      </div>

      {/* Rank Detail Modal */}
      {selectedRank && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center">
          <div className="bg-white rounded-t-3xl max-w-md w-full p-5 max-h-[85vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between pb-4 border-b border-[#eeebe3]">
              <div>
                <h3 className="font-extrabold text-lg text-[#0d1747]">
                  {selectedRank.name}
                </h3>
                <p className="text-xs text-[#555d71]">
                  {selectedRank.destination}
                </p>
              </div>
              <button
                onClick={() => setSelectedRank(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-[#555d71]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="bg-[#f0f5e7] p-3.5 rounded-2xl border border-[#dce9c9]">
                <p className="text-[10px] font-extrabold uppercase text-[#546b2b]">
                  Estimated Cash Fare
                </p>
                <p className="text-2xl font-black text-[#0d1747]">
                  {selectedRank.fareRange}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#0d1747] uppercase tracking-wider mb-1">
                  About this rank facility
                </h4>
                <p className="text-xs text-[#555d71] leading-relaxed">
                  {selectedRank.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#0d1747] uppercase tracking-wider mb-1.5">
                  Popular destinations dispatched
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRank.popularDestinations.map((dest) => (
                    <span
                      key={dest}
                      className="px-2.5 py-1 bg-[#edeae2] text-[#0d1747] rounded-lg text-xs font-semibold"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#fff9eb] border border-[#f5e6be] p-3.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#8a5d00] mb-1">
                  <Coins className="w-4 h-4" />
                  <span>Commuter Cash Etiquette</span>
                </div>
                <p className="text-xs text-[#715414] leading-relaxed">
                  {selectedRank.boardingTips}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-[#0d1747]">Connecting Transit: </span>
                <span className="text-[#555d71]">{selectedRank.connectingBus}</span>
              </div>

              <button
                onClick={() => handlePlanToRank(selectedRank)}
                className="w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <span>Plan Metrobus Connection to this Rank</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Report Rank Modal */}
      {isAddRankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center">
          <div className="bg-white rounded-t-3xl max-w-md w-full p-5 max-h-[85vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between pb-4 border-b border-[#eeebe3]">
              <div>
                <h3 className="font-extrabold text-lg text-[#0d1747]">
                  Report / Add Taxi Rank
                </h3>
                <p className="text-xs text-[#555d71]">
                  Share local rank fare and queue destination with commuters
                </p>
              </div>
              <button
                onClick={() => setIsAddRankModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-[#555d71]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRank} className="py-4 space-y-3.5">
              <div className="bg-[#edeae2] rounded-2xl p-3 focus-within:ring-2 focus-within:ring-[#0d1747]">
                <label className="block text-[10px] font-extrabold tracking-wider text-[#636b80] uppercase mb-1">
                  Rank Facility Name
                </label>
                <input
                  type="text"
                  required
                  value={newRankName}
                  onChange={(e) => setNewRankName(e.target.value)}
                  placeholder="e.g. Noord Street Taxi Rank"
                  className="w-full bg-transparent text-xs font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
                />
              </div>

              <div className="bg-[#edeae2] rounded-2xl p-3 focus-within:ring-2 focus-within:ring-[#0d1747]">
                <label className="block text-[10px] font-extrabold tracking-wider text-[#636b80] uppercase mb-1">
                  Primary Destination
                </label>
                <input
                  type="text"
                  required
                  value={newRankDest}
                  onChange={(e) => setNewRankDest(e.target.value)}
                  placeholder="e.g. Alexandra Far East"
                  className="w-full bg-transparent text-xs font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
                />
              </div>

              <div className="bg-[#edeae2] rounded-2xl p-3 focus-within:ring-2 focus-within:ring-[#0d1747]">
                <label className="block text-[10px] font-extrabold tracking-wider text-[#636b80] uppercase mb-1">
                  Single Cash Fare (Optional)
                </label>
                <input
                  type="text"
                  value={newRankFare}
                  onChange={(e) => setNewRankFare(e.target.value)}
                  placeholder="e.g. 18,00 – 22,00"
                  className="w-full bg-transparent text-xs font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
                />
              </div>

              <div className="bg-[#edeae2] rounded-2xl p-3 focus-within:ring-2 focus-within:ring-[#0d1747]">
                <label className="block text-[10px] font-extrabold tracking-wider text-[#636b80] uppercase mb-1">
                  Commuter Boarding Tips (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newRankTips}
                  onChange={(e) => setNewRankTips(e.target.value)}
                  placeholder="e.g. Queue in Bay 3 for morning peak. Cash only, exact coins preferred."
                  className="w-full bg-transparent text-xs font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddRankModalOpen(false)}
                  className="flex-1 py-3 border border-[#dedad0] rounded-2xl text-xs font-bold text-[#555d71]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 bg-[#0d1747] text-white rounded-2xl text-xs font-bold hover:bg-[#142161]"
                >
                  Save to Directory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <BottomNav currentScreen="taxi-directory" onNavigate={onNavigate} />
    </div>
  );
};
