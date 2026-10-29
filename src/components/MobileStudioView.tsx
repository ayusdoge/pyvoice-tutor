import React from 'react';
import { Send, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { PRESET_PROMPTS } from '../services/logicEngine';
import { LogicSynthesisResult, PresetPrompt } from '../types';
import { soundService } from '../services/soundService';
import { VoiceMicButton } from './VoiceMicButton';

interface MobileStudioViewProps {
  query: string;
  setQuery: (q: string) => void;
  onSubmit: (spokenText: string) => void;
  isLoading: boolean;
  synthesisResult: LogicSynthesisResult;
  onOpenCodeLab: () => void;
  onSelectPreset: (preset: PresetPrompt) => void;
}

export const MobileStudioView: React.FC<MobileStudioViewProps> = ({
  query,
  setQuery,
  onSubmit,
  isLoading,
  synthesisResult,
  onOpenCodeLab,
  onSelectPreset,
}) => {
  const handleVoiceTranscription = (transcript: string) => {
    setQuery(transcript);
  };

  return (
    <div className="p-4 space-y-4 pb-24 max-w-sm mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          <span>Wispr Voice Studio</span>
        </div>
        <h2 className="text-lg font-black text-white">Speak Your Python Logic</h2>
        <p className="text-xs text-slate-400">
          Press the microphone button or hold your Wispr key & speak!
        </p>
      </div>

      {/* Voice Mic Button + Dictation Textarea */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-3.5 shadow-xl space-y-3">
        {/* Real-time Voice Transcription Button */}
        <VoiceMicButton
          onTranscriptionComplete={handleVoiceTranscription}
          label="Tap to Speak with Your Voice 🎙️"
          suggestedHint="bhai, mere ko ek Python ka program banana hai ki prime numbers kaise find karein"
        />

        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Your spoken words will appear here... e.g., 'bhai, mere ko ek Python ka program banana hai ki prime numbers kaise find karein'"
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 resize-none font-sans leading-relaxed"
          />
        </div>

        <button
          onClick={() => {
            soundService.playPop();
            if (query.trim() && !isLoading) onSubmit(query.trim());
          }}
          disabled={!query.trim() || isLoading}
          className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Translating Voice...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Generate Python & Explain</span>
            </>
          )}
        </button>
      </div>

      {/* Quick 1-Tap Sample Voice Queries */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 block">
          Or try these sample spoken prompts:
        </span>
        <div className="grid grid-cols-1 gap-2">
          {PRESET_PROMPTS.slice(0, 3).map((p) => (
            <button
              key={p.id}
              onClick={() => {
                soundService.playPop();
                onSelectPreset(p);
              }}
              className="text-left p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex-1 pr-2">
                <span className="text-[10px] font-bold text-amber-400 block">
                  {p.title}
                </span>
                <span className="text-[11px] text-slate-300 italic line-clamp-1">
                  "{p.spokenQuery}"
                </span>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 shrink-0">
                Try
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Generated Solution Snapshot Card */}
      {synthesisResult && (
        <div className="bg-slate-900 border-2 border-purple-500/30 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-300">
              {synthesisResult.title}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-bold">
              {synthesisResult.languageDetected === 'hinglish' ? '🇮🇳 Hinglish' : '🌐 English'}
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-36">
            <pre>{synthesisResult.code}</pre>
          </div>

          <button
            onClick={() => {
              soundService.playPop();
              onOpenCodeLab();
            }}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
          >
            <span>Inspect Line-by-Line & Run</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
