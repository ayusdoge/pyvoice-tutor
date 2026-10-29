import React from 'react';
import { Flame, Sparkles, Heart, Globe2 } from 'lucide-react';
import { ttsService } from '../services/ttsService';

interface MobileHeaderProps {
  streak: number;
  xp: number;
  hearts: number;
  languageMode: 'english' | 'hinglish' | 'both';
  setLanguageMode: (mode: 'english' | 'hinglish' | 'both') => void;
  onOpenSettings?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  streak,
  xp,
  hearts,
  languageMode,
  setLanguageMode,
  onOpenSettings,
}) => {
  const persona = ttsService.getSelectedPersona();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3.5 py-2.5 flex items-center justify-between">
      {/* App Logo & Active Tutor Persona Pill */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs transition-colors"
          title="Click to change tutor voice"
        >
          <span>{persona.gender === 'female' ? '👩' : '👨'}</span>
          <span className="font-bold text-slate-200 text-[11px]">{persona.tutorName}</span>
          <span className="text-[10px]">{persona.flag}</span>
        </button>
      </div>

      {/* Gamification Stats */}
      <div className="flex items-center gap-2">
        {/* Streak */}
        <div className="flex items-center gap-1 text-[11px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
          <Flame className="w-3 h-3 fill-amber-400" />
          <span>{streak}</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1 text-[11px] font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
          <Sparkles className="w-3 h-3 fill-purple-400" />
          <span>{xp}</span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1 text-[11px] font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
          <Heart className="w-3 h-3 fill-rose-400" />
          <span>{hearts}</span>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => {
            const nextMode =
              languageMode === 'english'
                ? 'hinglish'
                : languageMode === 'hinglish'
                ? 'both'
                : 'english';
            setLanguageMode(nextMode);
          }}
          className="flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 hover:text-white transition-colors"
          title="Switch Explanation Language"
        >
          <Globe2 className="w-2.5 h-2.5 text-purple-400" />
          <span className="uppercase">{languageMode === 'both' ? 'Dual' : languageMode.slice(0, 3)}</span>
        </button>
      </div>
    </header>
  );
};
