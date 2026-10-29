import React from 'react';
import { Home, Mic, Code2, Settings } from 'lucide-react';
import { soundService } from '../services/soundService';

export type MobileTab = 'quest' | 'studio' | 'code' | 'settings';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'quest', label: 'Quest', icon: Home, color: 'text-emerald-400' },
    { id: 'studio', label: 'Wispr Voice', icon: Mic, color: 'text-purple-400' },
    { id: 'code', label: 'Code Lab', icon: Code2, color: 'text-indigo-400' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-slate-400' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-2 flex items-center justify-around shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              soundService.playPop();
              onTabChange(tab.id as MobileTab);
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Active Pill Indicator */}
            {isActive && (
              <span className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-emerald-400 to-purple-500 rounded-full" />
            )}
            <div className={`p-1 rounded-xl transition-transform ${isActive ? 'scale-110' : ''}`}>
              <Icon className={`w-5 h-5 ${isActive ? tab.color : 'text-slate-400'}`} />
            </div>
            <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'text-white font-black' : 'text-slate-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
