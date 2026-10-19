import React from 'react';
import { Info } from 'lucide-react';

export const DisclaimerFooter: React.FC = () => {
  return (
    <footer className="mt-8 pt-4 pb-8 border-t border-[#e8e5dc]">
      <div className="flex items-start gap-2.5 px-2 text-[#798090]">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#798090]" />
        <p className="text-[11px] leading-relaxed">
          Independent concept, not an official Metrobus app. Routes, stops, times, fares and trip progress are illustrative, not live or verified.
        </p>
      </div>
    </footer>
  );
};
