import React from 'react';
import { MapPin, Navigation, Compass, Code, Smile } from 'lucide-react';

interface QuickChipsProps {
  onSelectChip: (query: string) => void;
}

export const QuickChips: React.FC<QuickChipsProps> = ({ onSelectChip }) => {
  const chips = [
    { label: 'Bhopal to Indore Route', query: 'Plan safest route from Bhopal to Indore', icon: MapPin },
    { label: 'Delhi to Solan Route', query: 'Plan safest route from Delhi to Solan', icon: Navigation },
    { label: 'Compare Ride Modes', query: 'Compare Safe Walk vs Rapido Bike vs Ola Auto vs Uber Cab', icon: Compass },
    { label: 'Python GPS Code', query: 'Write a Python snippet for real-time GPS tracking', icon: Code },
    { label: 'Relaxing Travel Joke', query: 'Tell me a joke to relax during my trip', icon: Smile },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto px-5 py-3.5 border-b border-[#2A2A2A] bg-[#121212] no-scrollbar">
      {chips.map((chip, idx) => {
        const Icon = chip.icon;
        return (
          <button
            key={idx}
            onClick={() => onSelectChip(chip.query)}
            className="min-h-[48px] px-5 py-3 text-xs sm:text-sm font-extrabold bg-[#1E1E1E] border border-[#2A2A2A] text-gray-200 hover:text-white hover:border-[#3B82F6]/60 rounded-xl whitespace-nowrap flex items-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm shrink-0"
          >
            <Icon className="w-4.5 h-4.5 text-[#3B82F6] shrink-0" />
            <span className="whitespace-nowrap">{chip.label}</span>
          </button>
        );
      })}
    </div>
  );
};
