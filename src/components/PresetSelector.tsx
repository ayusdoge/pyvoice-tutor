import React from 'react';
import { PRESET_PROMPTS } from '../services/logicEngine';
import { PresetPrompt } from '../types';
import { Sparkles, MessageSquareQuote } from 'lucide-react';

interface PresetSelectorProps {
  onSelectPreset: (preset: PresetPrompt) => void;
  selectedPresetId: string | null;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  onSelectPreset,
  selectedPresetId,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Judges 1-Click Presets & Spoken Samples</span>
        </h2>
        <span className="text-[11px] text-slate-500">
          Click any preset to test immediately with 0 setup
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {PRESET_PROMPTS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-3 rounded-xl border transition-all duration-200 group relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500/80 ring-1 ring-purple-500/50 shadow-md shadow-purple-900/20'
                  : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-purple-300 transition-colors line-clamp-1">
                    {preset.title}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                      preset.language === 'Hinglish'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {preset.badge}
                  </span>
                </div>

                <div className="flex items-start gap-1.5 text-slate-400 text-xs italic mb-2">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <p className="line-clamp-2 text-[11px] text-slate-300 leading-snug">
                    "{preset.spokenQuery}"
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 line-clamp-1 pt-1.5 border-t border-slate-800/60">
                {preset.preview}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
