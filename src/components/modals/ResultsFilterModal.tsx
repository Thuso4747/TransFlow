import React, { useState } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

interface ResultsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSort: 'fastest' | 'earliest' | 'transfers' | 'fare';
  onSelectSort: (sort: 'fastest' | 'earliest' | 'transfers' | 'fare') => void;
  maxTransfers: string;
  onSelectMaxTransfers: (val: string) => void;
  walkingPreference: string;
  onSelectWalkingPreference: (val: string) => void;
  busCorridors: boolean;
  onToggleBusCorridors: (val: boolean) => void;
  onReset: () => void;
}

export const ResultsFilterModal: React.FC<ResultsFilterModalProps> = ({
  isOpen,
  onClose,
  currentSort,
  onSelectSort,
  maxTransfers,
  onSelectMaxTransfers,
  walkingPreference,
  onSelectWalkingPreference,
  busCorridors,
  onToggleBusCorridors,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#dedad0] animate-fadeIn max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#ece9e0] mb-4">
          <h3 className="font-extrabold text-base text-[#0d1747]">
            Sort &amp; filter
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#6b7280] hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1.5">
              Sort by
            </label>
            <div className="relative">
              <select
                value={currentSort}
                onChange={(e) => onSelectSort(e.target.value as any)}
                className="w-full bg-[#f7f6f2] rounded-2xl border border-[#dedad0] px-3.5 py-2.5 text-xs font-bold text-[#0d1747] appearance-none pr-8 focus:outline-hidden"
              >
                <option value="fastest">Fastest</option>
                <option value="earliest">Earliest departure</option>
                <option value="transfers">Fewest transfers</option>
                <option value="fare">Lowest fare</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#798090] absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1.5">
              Maximum transfers
            </label>
            <div className="relative">
              <select
                value={maxTransfers}
                onChange={(e) => onSelectMaxTransfers(e.target.value)}
                className="w-full bg-[#f7f6f2] rounded-2xl border border-[#dedad0] px-3.5 py-2.5 text-xs font-bold text-[#0d1747] appearance-none pr-8 focus:outline-hidden"
              >
                <option value="all">Any transfers</option>
                <option value="0">0 · Direct only</option>
                <option value="1">1 transfer max</option>
                <option value="2">2 transfers max</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#798090] absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1.5">
              Walking preference
            </label>
            <div className="relative">
              <select
                value={walkingPreference}
                onChange={(e) => onSelectWalkingPreference(e.target.value)}
                className="w-full bg-[#f7f6f2] rounded-2xl border border-[#dedad0] px-3.5 py-2.5 text-xs font-bold text-[#0d1747] appearance-none pr-8 focus:outline-hidden"
              >
                <option value="any">Any suggested walking</option>
                <option value="minimal">Minimal walking (&lt; 500m)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#798090] absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          
          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <div
              onClick={() => onToggleBusCorridors(!busCorridors)}
              className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                busCorridors ? 'bg-[#0d1747] text-white' : 'border-2 border-[#b5bac7] bg-white'
              }`}
            >
              {busCorridors && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div>
              <span className="text-xs font-bold text-[#0d1747] block">
                Bus corridors
              </span>
              <span className="text-[11px] text-[#555d71] leading-tight">
                Include scheduled Metrobus and express services.
              </span>
            </div>
          </label>

          
          <div className="p-3 bg-[#eef3f8] border border-[#d6e3f0] rounded-2xl text-[11px] text-[#1b3a6b] leading-relaxed">
            Only bus corridors are supported in this demo. Minibus taxi rank details are handled separately.
          </div>

          
          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => {
                onReset();
                onClose();
              }}
              className="flex-1 py-3 border border-[#dedad0] rounded-2xl text-xs font-bold text-[#555d71] hover:bg-slate-50 transition-colors"
            >
              Clear filters
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-[#0d1747] hover:bg-[#19276d] text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
